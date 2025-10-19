'use server';

import { prisma } from '@/lib/prisma';
import HomeClient from '@/components/containers/HomeClient';

export default async function Home() {
    // search categories
    const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    });

    // search points
    const points = await prisma.point.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            city: true,
            country: true,
            photoUrl: true,
            category: { select: { id: true, name: true } },
            reviews: { select: { rating: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    // convert rating (ratingAvg / ratingCount)
    const items = points.map((p) => {
        const count = p.reviews.length;
        const avg =
            count > 0
                ? Number(
                    (p.reviews.reduce((acc, r) => acc + r.rating, 0) / count).toFixed(1)
                )
                : 0;

        return {
            id: p.id,
            name: p.name,
            description: p.description ?? '',
            city: p.city,
            country: p.country,
            photoUrl: p.photoUrl ?? '',
            category: p.category ? { id: p.category.id, name: p.category.name } : undefined,
            ratingAvg: avg,
            ratingCount: count,
        };
    });

    return <HomeClient categories={categories} initialItems={items} />;
}
