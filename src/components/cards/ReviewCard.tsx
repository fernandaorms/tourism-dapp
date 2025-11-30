// components/point/ReviewCard.tsx
import Link from 'next/link';
import { RatingStars } from '@/components/layout/RatingStars';

export function ReviewCard({
    review,
}: {
    review: {
        id: number;
        username: string;
        rating: number;
        comment: string;
        createdAt: string;
        onchainTxHash?: string;
        walletAddress: string;
        pointName?: string;
    };
}) {
    const date = new Date(review.createdAt);
    const shortWallet = `${review.walletAddress.slice(0, 6)}…${review.walletAddress.slice(-4)}`;

    return (
        <article className='rounded-lg border p-4 hover:shadow-sm transition-shadow'>
            <div className='flex items-center justify-between'>
                <div className='text-sm font-medium'>{review.username}</div>
                <RatingStars rating={review.rating} size={14} />
            </div>

            {review.pointName && (
                <p className='mt-1 text-xs text-muted-foreground italic'>
                    Avaliação de <span className='font-medium'>{review.pointName}</span>
                </p>
            )}

            <p className='mt-2 text-sm leading-6'>{review.comment}</p>

            <div className='mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
                <span>{date.toLocaleDateString('pt-BR')}</span>
                <span className='rounded border px-1.5 py-0.5 font-mono'>{shortWallet}</span>
                {review.onchainTxHash && (
                    <Link
                        href={`https://sepolia.etherscan.io/tx/${review.onchainTxHash}`}
                        className='underline underline-offset-4'
                        target='_blank'
                        rel='noreferrer'
                    >
                        Ver transação
                    </Link>
                )}
            </div>
        </article>
    );
}
