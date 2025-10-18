'use client';

import { z } from 'zod';
import { useEffect, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createPointAction } from '@/app/actions/createPointAction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

const formSchema = z.object({
    name: z.string().min(3, 'Mínimo 3 caracteres'),
    description: z
        .string()
        .min(10, 'A descrição deve ter pelo menos 10 caracteres.')
        .max(200, 'A descrição deve ter no máximo 500 caracteres.'),
    city: z.string().min(2, 'Informe a cidade'),
    country: z.string().min(2, 'Informe o país'),
    photoUrl: z.url('URL inválida'),
    categoryId: z.string().min(1, 'Selecione uma categoria'),
});
type Values = z.infer<typeof formSchema>;

export function NewPointForm({
    categories,
}: {
    categories: { id: number; name: string }[];
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const hasCategories = categories.length > 0;
    const defaultCategoryId = useMemo(
        () => (hasCategories ? String(categories[0].id) : ''),
        [hasCategories, categories]
    );

    const form = useForm<Values>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            city: '',
            country: '',
            photoUrl: '',
            categoryId: defaultCategoryId,
        },
    });

    useEffect(() => {
        if (!hasCategories) {
            form.setValue('categoryId', '');
        } else {
            const current = form.getValues('categoryId');
            if (!current) form.setValue('categoryId', defaultCategoryId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasCategories, defaultCategoryId]);

    function onSubmit(values: Values) {
        startTransition(async () => {
            try {
                const payload = {
                    ...values,
                    categoryId: Number(values.categoryId),
                };
                const res = await createPointAction(payload);

                toast.success('Ponto cadastrado com sucesso!');

                router.push(`/ponto/${res.id}`);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                toast.error(e?.message ?? 'Erro ao criar ponto.');
            }
        });
    }

    const handleCancel = () => {
        router.push('/');
    };

    if (!hasCategories) {
        return (
            <div className='mt-6 flex items-start gap-3 rounded-md border p-4'>
                <AlertTriangle className='h-5 w-5 text-amber-500 mt-0.5' />
                <div className='text-sm'>
                    <p className='font-medium'>Nenhuma categoria cadastrada.</p>
                    <p className='text-muted-foreground'>
                        Cadastre ao menos uma categoria antes de criar um ponto turístico.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome *</FormLabel>
                            <FormControl><Input placeholder='Ex.: Cristo Redentor' {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                        control={form.control}
                        name='city'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cidade *</FormLabel>
                                <FormControl><Input placeholder='Rio de Janeiro' {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='country'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>País *</FormLabel>
                                <FormControl><Input placeholder='Brasil' {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name='photoUrl'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Foto *</FormLabel>
                            <FormControl>
                                <div className='grid gap-2'>
                                    <ImageUploader
                                        value={field.value}
                                        onChange={(url) => field.onChange(url || '')}
                                    />
                                    <Input
                                        placeholder='Ou cole uma URL https://…'
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='categoryId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Categoria *</FormLabel>
                            <Select
                                value={field.value}
                                onValueChange={(v) => field.onChange(v)}
                            >
                                <SelectTrigger><SelectValue placeholder='Selecione a categoria' /></SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição *</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Fale um pouco sobre o ponto...' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='grid grid-cols-[1fr_auto] gap-2 pt-2'>
                    <Button type='submit' disabled={isPending} className='w-full'>
                        {isPending ? 'Salvando…' : 'Salvar ponto'}
                    </Button>
                    <Button type='button' variant='outline' onClick={handleCancel}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </Form>
    );
}
