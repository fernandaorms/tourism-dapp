// components/home/HomeClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { Hero } from '@/components/containers/Hero';
import { PointCard, type PointCardProps } from '@/components/cards/PointCard';
import { FiltersBar, type FiltersState } from '@/components/layout/FiltersBar';

type Category = { id: number; name: string };

export default function HomeClient({
    categories,
    initialItems,
}: {
    categories: Category[];
    initialItems: PointCardProps[];
}) {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<FiltersState>({});
    const [items, setItems] = useState<PointCardProps[]>(initialItems);

    useEffect(() => {
        const q = query.toLowerCase().trim();

        let arr = initialItems.filter((p) =>
            [p.name, p.city, p.country, p.category?.name]
                .filter(Boolean)
                .some((v) => (v as string).toLowerCase().includes(q))
        );

        if (filters.categoryId && filters.categoryId !== 'all') {
            arr = arr.filter((p) => String(p.category?.id) === filters.categoryId);
        }
        if (typeof filters.minRating === 'number') {
            arr = arr.filter((p) => (p.ratingAvg ?? 0) >= filters.minRating!);
        }

        setItems(arr);
    }, [query, filters, initialItems]);

    return (
        <div className='space-y-4'>
            <Hero onSearch={setQuery} />

            <FiltersBar categories={categories} value={filters} onChange={setFilters} />
            
            <section className='container mx-auto px-4 pb-12'>
                <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                    {items.map((p) => (
                        <PointCard key={p.id} {...p} />
                    ))}
                    {items.length === 0 && (
                        <div className='col-span-full text-sm text-muted-foreground'>
                            Nenhum ponto encontrado para os filtros/busca atuais.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
