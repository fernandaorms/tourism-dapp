'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// 🔹 MOCK apenas das reviews (user vem da sessão)
const MOCK_REVIEWS = [
    {
        id: 1,
        username: 'fernanda.oliveira',
        rating: 5,
        comment: 'Experiência incrível! O visual é deslumbrante e o acesso é bem organizado.',
        createdAt: '2025-10-10T14:30:00Z',
        walletAddress: '0xAbCdEf1234567890abcdef1234567890abcdef12',
        onchainTxHash:
            '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        pointName: 'Cristo Redentor',
        pointUrl: '/pontos/1',
    },
    {
        id: 2,
        username: 'fernanda.oliveira',
        rating: 4,
        comment: 'Lugar muito bonito, mas a fila estava bem longa.',
        createdAt: '2025-09-25T09:00:00Z',
        walletAddress: '0xAbCdEf1234567890abcdef1234567890abcdef12',
        onchainTxHash:
            '0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef',
        pointName: 'Torre Eiffel',
        pointUrl: '/pontos/2',
    },
];

export default function ProfilePage() {
    const { data: session, status } = useSession(); // 'loading' | 'authenticated' | 'unauthenticated'

    // ⏳ Loading — sem cards/bordas: skeletons inline
    if (status === 'loading') {
        return (
            <main className='container mx-auto max-w-5xl px-4 py-10 space-y-10'>
                {/* Informações da conta */}
                <section>
                    <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>Meu perfil</h1>
                    <div className='mt-6 grid gap-3'>
                        <div>
                            <p className='text-sm text-muted-foreground'>Usuário</p>
                            <Skeleton className='mt-1 h-4 w-40' />
                        </div>
                        <div>
                            <p className='text-sm text-muted-foreground'>E-mail</p>
                            <Skeleton className='mt-1 h-4 w-56' />
                        </div>
                    </div>
                </section>

                {/* Minhas avaliações */}
                <section>
                    <h2 className='text-xl font-semibold'>Minhas avaliações</h2>
                    <div className='mt-4 grid gap-4'>
                        <Skeleton className='h-24 w-full' />
                        <Skeleton className='h-24 w-full' />
                    </div>
                </section>
            </main>
        );
    }

    // 🔐 Não logado (fallback; seu middleware já deve bloquear)
    if (status === 'unauthenticated' || !session?.user) {
        return (
            <main className='container mx-auto max-w-5xl px-4 py-10'>
                <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>Meu perfil</h1>
                <p className='mt-4 text-sm text-muted-foreground'>
                    Você precisa estar logado para ver seu perfil.
                </p>
                <div className='mt-4'>
                    <Button asChild>
                        <Link href='/login'>Ir para login</Link>
                    </Button>
                </div>
            </main>
        );
    }

    // ✅ Logado — sem cards/bordas; só headings + conteúdo
    const username = session.user.name ?? 'Usuário';
    const email = session.user.email ?? '—';

    return (
        <main className='container mx-auto max-w-5xl px-4 py-10 space-y-10'>
            {/* 1) Informações da conta */}
            <section>
                <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>Meu perfil</h1>

                <div className='mt-6 grid gap-3'>
                    <div>
                        <p className='text-sm text-muted-foreground'>Usuário</p>
                        <p className='font-medium'>{username}</p>
                    </div>
                    <div>
                        <p className='text-sm text-muted-foreground'>E-mail</p>
                        <p className='font-medium'>{email}</p>
                    </div>
                </div>
            </section>

            {/* 2) Minhas avaliações */}
            <section>
                <h2 className='text-xl font-semibold'>Minhas avaliações</h2>

                <div className='mt-4 grid gap-4'>
                    {MOCK_REVIEWS.length > 0 ? (
                        MOCK_REVIEWS.map((r) => <ReviewCard key={r.id} review={r} />)
                    ) : (
                        <p className='text-sm text-muted-foreground'>
                            Você ainda não fez nenhuma avaliação.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}
