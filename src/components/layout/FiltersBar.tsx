'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import * as React from 'react';

export type FiltersState = {
    categoryId?: string; // id da categoria (string) — undefined = todas
    minRating?: number;  // 0..10
};

export function FiltersBar({
    categories,
    value,
    onChange,
}: {
    categories: { id: number; name: string }[];
    value: FiltersState;
    onChange: (f: FiltersState) => void;
}) {
    const hasAny = value.categoryId !== undefined || typeof value.minRating === 'number';

    const setCategory = (v: string) => {
        onChange({ ...value, categoryId: v === 'all' ? undefined : v });
    };

    const setMinRating = (n: number) => {
        onChange({ ...value, minRating: n });
    };

    const clearAll = () => onChange({});

    // labels ativos
    const activeBadges = (
        <div className='flex flex-wrap items-center gap-2'>
            {value.categoryId && (
                <Badge variant='secondary'>
                    {categories.find((c) => String(c.id) === value.categoryId)?.name ?? 'Categoria'}
                </Badge>
            )}
            {typeof value.minRating === 'number' && (
                <Badge variant='secondary'>Nota ≥ {value.minRating}</Badge>
            )}
            {hasAny && (
                <Button variant='ghost' size='sm' className='h-7 px-2 gap-1' onClick={clearAll}>
                    <X className='h-4 w-4' />
                    Limpar
                </Button>
            )}
        </div>
    );

    return (
        <div className='container mx-auto px-4'>
            <div className='flex flex-wrap items-center gap-3 py-2'>
                {/* Controles */}
                <div className='flex flex-wrap items-center gap-3'>
                    {/* Categoria */}
                    <div className='flex items-center gap-2'>
                        <span className='text-sm text-muted-foreground'>Categoria</span>
                        <Select
                            value={value.categoryId ?? 'all'}
                            onValueChange={setCategory}
                        >
                            <SelectTrigger className='w-48'>
                                <SelectValue placeholder='Todas' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='all'>Todas</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Rating mínimo */}
                    <div className='flex items-center gap-3'>
                        <span className='text-sm text-muted-foreground'>Nota mínima</span>
                        <div className='flex items-center gap-3'>
                            <Slider
                                value={[value.minRating ?? 0]}
                                min={0}
                                max={10}
                                step={1}
                                className='w-40'
                                onValueChange={([v]) => setMinRating(v)}
                            />
                            <span className='text-sm w-6 text-right'>{value.minRating ?? 0}</span>
                        </div>
                    </div>
                </div>

                {/* Ativos e botão limpar */}
                <div className='ml-auto'>{activeBadges}</div>
            </div>
        </div>
    );
}
