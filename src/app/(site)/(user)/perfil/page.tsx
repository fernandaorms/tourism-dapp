'use server';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { ReviewCard } from '@/components/cards/ReviewCard';
import { Button } from '@/components/ui/button';

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user) {
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

    const userId = Number(session.user.id);
    if (!userId || Number.isNaN(userId)) {
        redirect('/login');
    }

    const reviews = await prisma.review.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            walletAddress: true,
            onchainTxHash: true,
            user: {
                select: { username: true },
            },
            point: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    const username = (session.user as any).username ?? session.user.name ?? '-';
    const email = session.user.email ?? '-';

    return (
        <main className='container mx-auto max-w-5xl px-4 py-10 space-y-10'>
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

            <section>
                <h2 className='text-xl font-semibold'>Minhas avaliações</h2>

                <div className='mt-4 grid gap-4'>
                    {reviews.length > 0 ? (
                        reviews.map((r) => (
                            <ReviewCard
                                key={r.id}
                                review={{
                                    id: r.id,
                                    username: r.user.username,
                                    rating: r.rating,
                                    comment: r.comment ?? '',
                                    createdAt: r.createdAt.toISOString(),
                                    walletAddress: r.walletAddress,
                                    onchainTxHash: r.onchainTxHash ?? undefined,
                                    pointName: r.point.name,
                                }}
                            />
                        ))
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
