import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Não autenticado.' },
                { status: 401 }
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userId = (session.user as any).id as number | undefined;
        if (!userId) {
            return NextResponse.json(
                { error: 'Usuário inválido na sessão.' },
                { status: 400 }
            );
        }

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
                point: {
                    reviews: {
                        some: {
                            userId,
                            walletAddress: normalized,
                        },
                    },
                },
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
