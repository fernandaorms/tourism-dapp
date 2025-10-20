// components/point/PointDetailClient.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { ReviewForm } from '@/components/forms/ReviewForm';
import { WalletConnectButton } from '@/components/buttons/WalletConnectButton';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMounted } from '@/hooks/useMounted';

type ReviewItem = {
    id: number;
    username: string;
    rating: number;
    comment: string;
    createdAt: string;
    walletAddress: string;
    onchainTxHash?: string;
};

export function PointDetailClient({
    isLoggedIn,
    point,
}: {
    isLoggedIn: boolean;
    point: {
        id: number;
        name: string;
        description: string;
        city: string;
        country: string;
        categoryName?: string;
        ratingAvg: number;
        ratingCount: number;
        reviews: ReviewItem[];
    };
}) {
    const mounted = useMounted();
    const { status: accountStatus, isConnected } = useAccount();
    const chainId = useChainId();

    const [reviews] = useState<ReviewItem[]>(point.reviews);
    const [ratingAvg] = useState<number>(point.ratingAvg);
    const [ratingCount] = useState<number>(point.ratingCount);

    const networkLabel =
        chainId === 11155111 ? 'Sepolia' : `Chain ${chainId ?? 'desconhecida'}`;

    const showWalletSkeleton =
        !mounted || accountStatus === 'connecting' || accountStatus === 'reconnecting';

    return (
        <div className='grid gap-8 md:grid-cols-[1fr_minmax(280px,360px)]'>
            {/* Esquerda */}
            <div className='grid gap-8'>
                <section>
                    <h2 className='text-lg font-semibold'>Descrição</h2>
                    <p className='mt-2 text-sm leading-6 text-muted-foreground whitespace-pre-line'>
                        {point.description}
                    </p>
                </section>

                <section>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-semibold'>Avaliações ({ratingCount}) · ★ {ratingAvg}</h2>
                    </div>
                    <div className='mt-4 grid gap-4'>
                        {reviews.length === 0 && (
                            <p className='text-sm text-muted-foreground'>Ainda não há avaliações para este ponto.</p>
                        )}
                        {reviews.map((r) => (<ReviewCard key={r.id} review={r} />))}
                    </div>
                </section>
            </div>

            {/* Direita: sidebar */}
            <aside className='md:pl-4 lg:pl-8'>
                <div className='sticky top-24 rounded-lg border p-4'>
                    <h3 className='text-base font-semibold'>Deixe sua avaliação</h3>

                    {!isLoggedIn ? (
                        <div className='mt-3 text-sm'>
                            <p className='text-muted-foreground'>Você precisa estar logado para avaliar este ponto.</p>
                            <Button asChild className='mt-3 w-full'>
                                <Link href='/login'>Fazer login</Link>
                            </Button>
                            <p className='mt-2 text-xs text-muted-foreground'>
                                Após o login, conecte sua carteira MetaMask (Sepolia) e envie sua avaliação.
                            </p>
                        </div>
                    ) : showWalletSkeleton ? (
                        <div className='mt-3 grid gap-3'>
                            <Skeleton className='h-10 w-full rounded-md' />
                            <Skeleton className='h-24 w-full rounded-md' />
                        </div>
                    ) : (
                        <div className='mt-3 grid gap-3'>
                            <WalletConnectButton className='w-full' />
                            <ReviewForm
                                onSubmitReview={() => ({ ok: isConnected && chainId === 11155111 })}
                                isConnected={mounted && isConnected}
                                isMounted={mounted}
                            />
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}
