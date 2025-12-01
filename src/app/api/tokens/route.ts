// app/api/tokens/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const wallet = searchParams.get('wallet');

        if (!wallet) {
            return NextResponse.json(
                { error: 'Parâmetro wallet é obrigatório.' },
                { status: 400 }
            );
        }

        const normalized = wallet.toLowerCase();

        const sbtMints = await prisma.sbtMint.findMany({
            where: {
                walletAddress: normalized,
            },
            orderBy: {
                mintedAt: 'desc',
            },
            select: {
                tokenId: true,
                mintedAt: true,
                onchainTxHash: true,
                point: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        const tokens = sbtMints.map((sbt) => ({
            tokenId: sbt.tokenId,
            placeName: sbt.point.name,
            mintedAt: sbt.mintedAt ? sbt.mintedAt.toISOString() : null,
            txHash: sbt.onchainTxHash ?? null,
            pointId: sbt.point.id,
        }));

        return NextResponse.json({ tokens }, { status: 200 });
    } catch (err: any) {
        console.error('Error in /api/tokens:', err);
        return NextResponse.json(
            {
                error: 'Erro interno ao buscar tokens.',
                detail: err?.message ?? String(err),
            },
            { status: 500 }
        );
    }
}
