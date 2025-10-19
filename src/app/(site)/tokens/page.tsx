'use client';

import Link from 'next/link';
import { useAccount, useChainId, useDisconnect } from 'wagmi';
import { Wallet, TrendingUp, Copy, Check, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TokenCard } from '@/components/cards/TokenCard';
import { TokenCardSkeleton } from '@/components/cards/TokenCardSkeleton';
import { WalletConnectButton } from '@/components/buttons/WalletConnectButton';
import { useMounted } from '@/hooks/useMounted';
import { useState } from 'react';

// Helpers
function shortAddr(addr?: `0x${string}` | string) {
    if (!addr) return '';
    const a = String(addr);
    return a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;
}

// ---- MOCKS ----
const MOCK_TOKENS = [
    {
        tokenId: 'SBT-001',
        placeName: 'Cristo Redentor',
        mintedLabel: 'Conquistado em 16 de out. de 2025',
        txUrl:
            'https://etherscan.io/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
    {
        tokenId: 'SBT-002',
        placeName: 'Torre Eiffel',
        mintedLabel: 'Conquistado em 03 de out. de 2025',
        txUrl:
            'https://etherscan.io/tx/0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    },
    {
        tokenId: 'SBT-003',
        placeName: 'Machu Picchu',
        mintedLabel: 'Conquistado em 18 de set. de 2025',
        txUrl:
            'https://etherscan.io/tx/0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    },
];
const MOCK_GLOBAL = { totalReviews: 3, ranking: 608 };

/** Pill com endereço + copiar + desconectar */
function AddressPill({ address }: { address: string }) {
    const { disconnect } = useDisconnect();
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { }
    }

    return (
        <div className='mt-3 inline-flex flex-wrap items-center gap-3 rounded-full border bg-background px-3 py-1.5 shadow-sm'>
            <span className='font-mono text-sm'>{shortAddr(address)}</span>
            <span className='mx-1 h-4 w-px bg-border' />

            {/* Botão só com ícone */}
            <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 text-muted-foreground hover:text-foreground'
                onClick={copy}
                aria-label={copied ? 'Copiado!' : 'Copiar endereço'}
            >
                {copied ? (
                    <Check className='h-4 w-4 text-primary' />
                ) : (
                    <Copy className='h-4 w-4 text-primary' />
                )}
            </Button>

            <span className='mx-1 h-4 w-px bg-border' />

            <Button
                variant='ghost'
                size='sm'
                className='h-7 px-2 gap-1'
                onClick={() => disconnect()}
            >
                {/* <LogOut className='h-3.5 w-3.5' /> */}
                <span className='text-sm'>Desconectar</span>
            </Button>
        </div>
    );
}

export default function TokensPage() {
    const mounted = useMounted();
    const { address, isConnected, status } = useAccount();
    const chainId = useChainId();

    const isLoadingWallet = !mounted || status === 'connecting' || status === 'reconnecting';
    const tokens = isConnected ? MOCK_TOKENS : [];
    const totalTokens = tokens.length;

    return (
        <main className='container mx-auto max-w-5xl px-4 py-10'>
            {/* Minha carteira */}
            <section className='mb-8'>
                <div className='flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4'>
                    <div className='hidden sm:flex h-16 w-16 md:h-20 md:w-20 rounded-full bg-sky-500 items-center justify-center'>
                        <Wallet className='h-8 w-8 md:h-10 md:w-10 text-primary-foreground' />
                    </div>

                    <div className='w-full'>
                        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>Minha carteira</h1>

                        {isLoadingWallet ? (
                            <>
                                <Skeleton className='mt-1 h-3.5 w-32 sm:h-4 sm:w-36' />
                                <Skeleton className='mt-3 h-8 w-56 rounded-full sm:w-72' />
                            </>
                        ) : isConnected && address ? (
                            <AddressPill address={address} />
                        ) : (
                            <p className='mt-1 font-mono text-sm text-muted-foreground'>Carteira não conectada</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Conteúdo */}
            {isLoadingWallet ? (
                <section className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    <TokenCardSkeleton />
                    <TokenCardSkeleton />
                    <TokenCardSkeleton />
                </section>
            ) : !isConnected ? (
                <section className='max-w-md mx-auto rounded-xl border p-6 text-center text-sm sm:p-8'>
                    <div className='flex flex-col items-center gap-3'>
                        <Wallet className='h-8 w-8 text-primary' />
                        <h2 className='text-lg font-semibold'>Conecte sua carteira</h2>
                        <p className='text-muted-foreground text-sm leading-relaxed'>
                            Conecte sua carteira MetaMask para visualizar seus SBTs, avaliações e ranking.
                        </p>
                        <div className='mt-4'>
                            <WalletConnectButton />
                        </div>
                        <p className='mt-2 text-D text-muted-foreground'>
                            Após conectar, suas informações aparecerão automaticamente aqui.
                        </p>
                    </div>
                </section>
            ) : (
                <>
                    {/* Métricas globais */}
                    <section className='mb-12 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2'>
                        <Card>
                            <CardContent className='p-6 flex items-center gap-4'>
                                <div className='h-12 w-12 rounded-lg bg-sky-100 flex items-center justify-center'>
                                    <TrendingUp className='h-6 w-6 text-primary' />
                                </div>
                                <div>
                                    <p className='text-2xl font-bold'>{MOCK_GLOBAL.totalReviews}</p>
                                    <p className='text-sm text-muted-foreground'>Avaliações Feitas</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className='p-6 flex items-center gap-4'>
                                <div className='h-12 w-12 rounded-lg bg-sky-50 flex items-center justify-center'>
                                    <Badge className='text-lg font-bold border-transparent bg-sky-100 text-primary'>
                                        #{MOCK_GLOBAL.ranking}
                                    </Badge>
                                </div>
                                <div>
                                    <p className='text-sm text-muted-foreground'>Ranking Global</p>
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Tokens */}
                    <section>
                        <div className='mb-6 flex items-center justify-between flex-wrap gap-2'>
                            <h2 className='text-2xl font-bold'>Meus Soulbound Tokens</h2>
                            <Badge className='text-xs font-medium' variant='outline'>
                                {totalTokens} {totalTokens === 1 ? 'Token' : 'Tokens'}
                            </Badge>
                        </div>

                        {totalTokens === 0 ? (
                            <div className='rounded-xl border p-6 text-sm'>
                                <p className='text-muted-foreground'>
                                    Você ainda não possui SBTs. Avalie um ponto turístico para conquistar o seu primeiro!
                                </p>
                                <div className='mt-4'>
                                    <Button asChild>
                                        <Link href='/pontos'>Explorar pontos turísticos</Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                {tokens.map((t) => (
                                    <TokenCard
                                        key={t.tokenId}
                                        tokenId={t.tokenId}
                                        placeName={t.placeName}
                                        mintedLabel={t.mintedLabel}
                                        txUrl={t.txUrl}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Bloco explicativo */}
                    <section className='mt-12'>
                        <Card className='rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20'>
                            <CardHeader>
                                <CardTitle className='leading-none font-semibold'>
                                    O que são Soulbound Tokens?
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className='text-sm text-muted-foreground leading-relaxed'>
                                    SBTs são NFTs não transferíveis que registram suas contribuições na plataforma.
                                    Cada avaliação válida gera <strong>1 SBT</strong>. Permitimos{' '}
                                    <strong>1 avaliação por carteira</strong> em cada ponto turístico.
                                </p>
                            </CardContent>
                        </Card>
                    </section>
                </>
            )}
        </main>
    );
}
