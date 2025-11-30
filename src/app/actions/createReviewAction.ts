'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { z } from 'zod';

const createReviewSchema = z.object({
    pointId: z.number().int(),
    rating: z.number().int().min(0).max(10),
    comment: z.string().trim().min(1).max(2000),
    walletAddress: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, 'Endereço de carteira inválido.'),
    reviewHash: z
        .string()
        .regex(/^0x[0-9a-fA-F]{64}$/, 'Hash de avaliação inválido.'),
    onchainTxHash: z
        .string()
        .regex(/^0x[0-9a-fA-F]{64}$/, 'Hash da transação inválido.'),
    blockNumber: z.union([z.string(), z.number()]),
    tokenId: z.string(),
});

export async function createReviewAction(input: unknown) {
    const session = await auth();
    if (!session?.user) throw new Error('Não autenticado.');

    const userIdNumber = Number(session.user.id);
    if (!userIdNumber || Number.isNaN(userIdNumber)) {
        throw new Error('Usuário inválido na sessão.');
    }

    const data = createReviewSchema.parse(input);

    const walletAddressLower = data.walletAddress.toLowerCase();
    const blockNumberBigInt =
        typeof data.blockNumber === 'string'
            ? BigInt(data.blockNumber)
            : BigInt(data.blockNumber);

    const existing = await prisma.review.findFirst({
        where: {
            pointId: data.pointId,
            walletAddress: walletAddressLower,
        },
        select: { id: true },
    });

    if (existing) {
        throw new Error('Você já avaliou este ponto com esta carteira.');
    }

    const review = await prisma.review.create({
        data: {
            pointId: data.pointId,
            userId: userIdNumber,
            walletAddress: walletAddressLower,
            rating: data.rating,
            comment: data.comment,
            reviewHash: data.reviewHash,
            onchainTxHash: data.onchainTxHash,
            blockNumber: blockNumberBigInt,
            confirmed: true,
        },
        select: {
            id: true,
            pointId: true,
            rating: true,
            comment: true,
            walletAddress: true,
            onchainTxHash: true,
            createdAt: true,
        },
    });

    await prisma.sbtMint.create({
        data: {
            tokenId: data.tokenId,
            walletAddress: walletAddressLower,
            pointId: data.pointId,
            onchainTxHash: data.onchainTxHash,
            mintedAt: new Date(),
        },
    });

    return { ok: true, review };
}
