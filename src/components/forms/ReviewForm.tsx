"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const schema = z.object({
    rating: z.number().int().min(0).max(10),
    comment: z.string().trim().min(1, "Escreva um comentário").max(2000),
});

type Values = z.infer<typeof schema>;

export function ReviewForm({
    onSubmitReview,
    defaultRating = 8,
}: {
    onSubmitReview: (data: Values) => Promise<void> | void;
    defaultRating?: number;
}) {
    const [isPending, startTransition] = useTransition();
    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { rating: defaultRating, comment: "" },
    });

    function submit(values: Values) {
        startTransition(async () => {
            try {
                await onSubmitReview(values);
                toast.success("Avaliação enviada");
                form.reset({ rating: defaultRating, comment: "" });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                toast.error(e?.message ?? "Erro ao enviar avaliação");
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nota (0–10)</FormLabel>
                            <FormControl>
                                <Slider value={[field.value]} min={0} max={10} step={1} onValueChange={([v]) => field.onChange(v)} />
                            </FormControl>
                            <div className="text-xs text-muted-foreground">{field.value}</div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Comentário</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Conte sua experiência…" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isPending}>{isPending ? "Enviando…" : "Enviar avaliação"}</Button>
            </form>
        </Form>
    );
}
