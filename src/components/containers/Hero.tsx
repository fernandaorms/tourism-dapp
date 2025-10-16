"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Hero({
    title = "Avalie pontos turísticos com transparência",
    description = "Busque por cidade, país ou categoria e encontre avaliações ancoradas na blockchain.",
    onSearch,
    defaultQuery = "",
    className,
}: {
    title?: string;
    description?: string;
    onSearch?: (q: string) => void;
    defaultQuery?: string;
    className?: string;
}) {
    const [q, setQ] = useState(defaultQuery);

    // debounce simples (300ms)
    useEffect(() => {
        const t = setTimeout(() => onSearch?.(q.trim()), 300);
        return () => clearTimeout(t);
    }, [q, onSearch]);

    return (
        <section className={cn("container mx-auto px-4 py-10 md:py-16", className)}>
            <div className="mx-auto max-w-3xl text-center">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
                <p className="mt-2 text-muted-foreground">{description}</p>
                <div className="mt-6">
                    <Input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Pesquisar pontos (ex.: Rio de Janeiro, Museu, Lisboa)"
                        aria-label="Pesquisar"
                    />
                </div>
            </div>
        </section>
    );
}