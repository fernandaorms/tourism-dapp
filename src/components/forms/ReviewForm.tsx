'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const schema = z.object({
    rating: z.number().int().min(0).max(10),
    comment: z.string().trim().min(1, 'Escreva um comentário').max(2000),
});

type Values = z.infer<typeof schema>;
type SubmitResult = { ok: boolean; message?: string };

export function ReviewForm({
    onSubmitReview,
    isConnected = true,
    isMounted = true,
    defaultRating = 8,
}: {
    onSubmitReview: (data: Values) => Promise<SubmitResult> | SubmitResult;
    isConnected?: boolean;
    isMounted?: boolean;
    defaultRating?: number;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { rating: defaultRating, comment: '' },
    });

    function submit(values: Values) {
        startTransition(async () => {
            try {
                const res = await onSubmitReview(values);
                if (!res?.ok) {
                    toast.error(res?.message ?? 'Erro ao enviar avaliação');
                    return;
                }
                toast.success('Avaliação enviada');
                form.reset({ rating: defaultRating, comment: '' });

                router.refresh();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                toast.error(e?.message ?? 'Erro ao enviar avaliação');
            }
        });
    }

    const disabled = isPending || !isMounted || !isConnected;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className='grid gap-4'>
                <FormField
                    control={form.control}
                    name='rating'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nota (0–10)</FormLabel>
                            <FormControl>
                                <Slider value={[field.value]} min={0} max={10} step={1} onValueChange={([v]) => field.onChange(v)} />
                            </FormControl>
                            <div className='text-xs text-muted-foreground'>{field.value}</div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='comment'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comentário</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Conte sua experiência…' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {isMounted ? (
                    <>
                        <Button type='submit' disabled={disabled}>
                            {isPending ? 'Enviando…' : !isConnected ? 'Conecte a carteira' : 'Enviar avaliação'}
                        </Button>
                        {!isConnected && (
                            <p className='text-xs text-muted-foreground'>Conecte sua carteira para enviar a avaliação.</p>
                        )}
                    </>
                ) : (
                    <Skeleton className='h-10 w-full rounded-md' />
                )}
            </form>
        </Form>
    );
}
