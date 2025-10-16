"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const signupSchema = z.object({
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Mínimo de 6 caracteres"),
    confirm: z.string().min(6, "Mínimo de 6 caracteres"),
}).refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Senhas não conferem",
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const [isPending, startTransition] = useTransition();
    const form = useForm<SignupValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: { email: "", password: "", confirm: "" },
    });

    async function onSubmit(values: SignupValues) {
        startTransition(async () => {
            try {
                // TODO: chamar server action real (signupAction)
                await new Promise((r) => setTimeout(r, 600));
                toast.success("Conta criada com sucesso");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                toast.error(e?.message ?? "Erro ao criar conta");
            }
        });
    }

    return (
        <div className="container mx-auto max-w-md px-4 py-12">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Criar conta</h1>
                <p className="text-sm text-muted-foreground">Cadastre-se para começar a avaliar.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="voce@exemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar senha</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Criando…" : "Criar conta"}
                    </Button>
                </form>
            </Form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Já tem conta?{" "}
                <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                    Entrar
                </Link>
            </p>
        </div>
    );
}