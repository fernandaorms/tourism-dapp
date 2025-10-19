'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useAccount, useChainId } from 'wagmi';
import { ReviewForm } from '@/components/forms/ReviewForm';
import { WalletConnectButton } from '@/components/buttons/WalletConnectButton';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { Button } from '@/components/ui/button';

type ReviewItem = {
    id: number;
    username: string;
    rating: number;
    comment: string;
    createdAt: string;
    walletAddress: string;
    onchainTxHash?: string;
};

type SubmitResult = { ok: boolean; message?: string };

export function PointDetailClient({
    point,
}: {
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
    const { data: session } = useSession();
    const { isConnected } = useAccount();
    const chainId = useChainId();

    const [reviews] = useState<ReviewItem[]>(point.reviews);
    const [ratingAvg] = useState<number>(point.ratingAvg);
    const [ratingCount] = useState<number>(point.ratingCount);

    const isLoggedIn = useMemo(() => Boolean(session?.user), [session?.user]);
    const networkLabel = chainId === 11155111 ? 'Sepolia' : `Chain ${chainId ?? 'desconhecida'}`;

    function handleSubmitMock(values: { rating: number; comment: string }): SubmitResult {
        if (!isLoggedIn) {
            return { ok: false, message: 'Faça login para avaliar.' };
        }
        if (!isConnected) {
            return { ok: false, message: 'Conecte sua carteira para avaliar.' };
        }
        if (chainId !== 11155111) {
            return { ok: false, message: `Rede incorreta. Conecte-se à ${networkLabel}.` };
        }

        // mock de sucesso
        return { ok: true };
    }

    return (
        <div className="grid gap-8 md:grid-cols-[1fr_minmax(280px,360px)]">
            {/* Esquerda: descrição + avaliações */}
            <div className="grid gap-8">
                <section>
                    <h2 className="text-lg font-semibold">Descrição</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground whitespace-pre-line">
                        {point.description}
                    </p>
                </section>

                <section>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Avaliações ({ratingCount}) · ★ {ratingAvg}
                        </h2>
                    </div>

                    <div className="mt-4 grid gap-4">
                        {reviews.length === 0 && (
                            <p className="text-sm text-muted-foreground">
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
            <aside className="md:pl-4 lg:pl-8">
                <div className="sticky top-24 rounded-lg border p-4">
                    <h3 className="text-base font-semibold">Deixe sua avaliação</h3>

                    {!isLoggedIn ? (
                        <div className="mt-3 text-sm">
                            <p className="text-muted-foreground">
                                Você precisa estar logado para avaliar este ponto.
                            </p>
                            <Button asChild className="mt-3 w-full">
                                <Link href="/login">Fazer login</Link>
                            </Button>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Após o login, conecte sua carteira MetaMask (Sepolia) e envie sua avaliação.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-3 grid gap-3">
                            <WalletConnectButton />

                            {/* 🔹 Passa o estado da conexão para desabilitar o botão */}
                            <ReviewForm onSubmitReview={handleSubmitMock} isConnected={isConnected} />

                            <p className="mt-2 text-xs text-muted-foreground">
                                * Esta ação é apenas um mock — nada será salvo ainda.
                            </p>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}
