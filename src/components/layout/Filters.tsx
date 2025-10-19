'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter } from 'lucide-react';

export type FiltersState = {
    categoryId?: string;
    minRating?: number;
};

export function FiltersMenu({
    categories,
    value,
    onChange,
}: {
    categories: { id: number; name: string }[];
    value: FiltersState;
    onChange: (f: FiltersState) => void;
}) {
    const [open, setOpen] = useState(false);
    const [local, setLocal] = useState<FiltersState>(value);

    useEffect(() => setLocal(value), [value]);

    function apply() {
        onChange(local);
        setOpen(false);
    }

    function clearAll() {
        const cleared: FiltersState = {};
        setLocal(cleared);
        onChange(cleared);
    }

    return (
        <div className='container mx-auto px-4'>
            <div className='flex justify-end'>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant='outline' className='gap-2'>
                            <Filter className='h-4 w-4' /> Filtros
                        </Button>
                    </SheetTrigger>

                    <SheetContent side='right' className='w-80'>
                        <SheetHeader>
                            <SheetTitle>Filtros</SheetTitle>
                        </SheetHeader>

                        <div className='mt-6 grid gap-6 px-4'>
                            <div className='grid gap-2'>
                                <label className='text-sm font-medium'>Categoria</label>
                                <Select
                                    value={local.categoryId ?? 'all'}
                                    onValueChange={(v) =>
                                        setLocal((s) => ({
                                            ...s,
                                            categoryId: v === 'all' ? undefined : v,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
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

                            <div className='grid gap-2'>
                                <label className='text-sm font-medium'>Rating mínimo (0–10)</label>
                                <Slider
                                    value={[local.minRating ?? 0]}
                                    min={0}
                                    max={10}
                                    step={1}
                                    onValueChange={([v]) => setLocal((s) => ({ ...s, minRating: v }))}
                                />
                                <div className='text-xs text-muted-foreground'>
                                    {local.minRating ?? 0}
                                </div>
                            </div>

                            <div className='mt-2 grid grid-cols-[1fr_auto] gap-2'>
                                <Button className='w-full' onClick={apply}>
                                    Aplicar
                                </Button>
                                <Button variant='outline' onClick={clearAll}>
                                    Limpar
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
