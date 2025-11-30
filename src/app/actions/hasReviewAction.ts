'use server';

import { prisma } from '@/lib/prisma';

export async function hasReviewAction(pointId: number, wallet: string | null) {
    if (!wallet) return { hasReview: false };

    const walletLower = wallet.toLowerCase();

    const existing = await prisma.review.findFirst({
        where: {
            pointId,
            walletAddress: walletLower,
        },
        select: { id: true },
    });

    return { hasReview: !!existing };
}
