'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
    useAccount,
    useChainId,
    useWriteContract,
    usePublicClient,
} from 'wagmi';
import { keccak256, encodePacked, decodeEventLog } from 'viem';

import { ReviewForm } from '@/components/forms/ReviewForm';
import { WalletConnectButton } from '@/components/buttons/WalletConnectButton';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useMounted } from '@/hooks/useMounted';
import { REVIEW_SBT_ADDRESS, reviewSbtAbi } from '@/chain/reviewSbt';
import { createReviewAction } from '@/app/actions/createReviewAction';
import { hasReviewAction } from '@/app/actions/hasReviewAction';

type ReviewItem = {
    id: number;
    username: string;
    rating: number;
    comment: string;
    createdAt: string;
    walletAddress: string;
    onchainTxHash?: string;
};

type ReviewFormValues = {
    rating: number;
    comment: string;
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
    const { address, status: accountStatus, isConnected } = useAccount();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    const [walletHasReview, setWalletHasReview] = useState(false);

    const reviews = point.reviews;
    const ratingAvg = point.ratingAvg;
    const ratingCount = point.ratingCount;

    const showWalletSkeleton = !mounted || accountStatus === 'connecting' || accountStatus === 'reconnecting';

    useEffect(() => {
        async function check() {
            if (!address) {
                setWalletHasReview(false);
                return;
            }

            const res = await hasReviewAction(point.id, address);
            setWalletHasReview(res.hasReview);
        }

        check();
    }, [address, point.id]);

    async function handleSubmitReview(
        values: ReviewFormValues
    ): Promise<{ ok: boolean; message?: string }> {
        try {
            if (!mounted) {
                return {
                    ok: false,
                    message: 'O componente ainda não foi montado. Tente novamente.',
                };
            }

            if (!isLoggedIn) {
                return {
                    ok: false,
                    message: 'Você precisa estar logado para avaliar.',
                };
            }

            if (!isConnected || !address) {
                return {
                    ok: false,
                    message: 'Conecte sua carteira para enviar a avaliação.',
                };
            }

            if (chainId !== 11155111) {
                return {
                    ok: false,
                    message: 'Rede incorreta. Conecte-se à Sepolia para avaliar.',
                };
            }

            if (!publicClient) {
                return {
                    ok: false,
                    message: 'Cliente público da blockchain indisponível.',
                };
            }

            if (walletHasReview) {
                return {
                    ok: false,
                    message: 'Você já avaliou este ponto com esta carteira.',
                };
            }

            const reviewHash = keccak256(
                encodePacked(
                    ['uint256', 'address', 'uint8', 'string'],
                    [BigInt(point.id), address as `0x${string}`, values.rating, values.comment]
                )
            );

            const txHash = await writeContractAsync({
                address: REVIEW_SBT_ADDRESS as `0x${string}`,
                abi: reviewSbtAbi,
                functionName: 'submitReview',
                args: [BigInt(point.id), values.rating, reviewHash],
            });

            const receipt = await publicClient.waitForTransactionReceipt({
                hash: txHash,
            });

            const log = receipt.logs.find(
                (l) => l.address.toLowerCase() === REVIEW_SBT_ADDRESS.toLowerCase()
            );

            if (!log) {
                return {
                    ok: false,
                    message:
                        'Não foi possível encontrar o evento de review na transação.',
                };
            }

            const decoded = decodeEventLog({
                abi: reviewSbtAbi,
                data: log.data,
                topics: log.topics,
            });

            const args = decoded.args as any;
            const tokenId: bigint = args.tokenId;

            await createReviewAction({
                pointId: point.id,
                rating: values.rating,
                comment: values.comment,
                walletAddress: address,
                reviewHash,
                onchainTxHash: txHash,
                blockNumber: receipt.blockNumber.toString(),
                tokenId: tokenId.toString(),
            });

            return { ok: true };
        } catch (err: any) {
            console.error(err);
            return {
                ok: false,
                message: err?.message ?? 'Erro ao enviar avaliação.',
            };
        }
    }

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
                        <h2 className='text-lg font-semibold'>
                            Avaliações ({ratingCount}) · ★ {ratingAvg}
                        </h2>
                    </div>
                    <div className='mt-4 grid gap-4'>
                        {reviews.length === 0 && (
                            <p className='text-sm text-muted-foreground'>
                                Ainda não há avaliações para este ponto.
                            </p>
                        )}
                        {reviews.map((r) => (
                            <ReviewCard key={r.id} review={r} />
                        ))}
                    </div>
                </section>
            </div>

            {/* Direita: sidebar */}
            <aside className='md:pl-4 lg:pl-8'>
                <div className='sticky top-24 rounded-lg border p-4'>
                    <h3 className='text-base font-semibold'>Deixe sua avaliação</h3>

                    {!isLoggedIn ? (
                        <div className='mt-3 text-sm'>
                            <p className='text-muted-foreground'>
                                Você precisa estar logado para avaliar este ponto.
                            </p>
                            <Button asChild className='mt-3 w-full'>
                                <Link href='/login'>Fazer login</Link>
                            </Button>
                            <p className='mt-2 text-xs text-muted-foreground'>
                                Após o login, conecte sua carteira MetaMask (Sepolia) e envie
                                sua avaliação.
                            </p>
                        </div>
                    ) : showWalletSkeleton ? (
                        <div className='mt-3 grid gap-3'>
                            <Skeleton className='h-10 w-full rounded-md' />
                            <Skeleton className='h-24 w-full rounded-md' />
                        </div>
                    ) : (
                        <div className='mt-3 grid gap-3'>
                            {walletHasReview ? (
                                <>
                                    <WalletConnectButton className='w-full' />

                                    <p className="text-sm text-muted-foreground">
                                        Você já avaliou este ponto com esta carteira.<br /><br />
                                        Para enviar outra avaliação, conecte uma conta diferente.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <WalletConnectButton className='w-full' />
                                    <ReviewForm
                                        onSubmitReview={handleSubmitReview}
                                        isConnected={mounted && isConnected}
                                        isMounted={mounted}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}
