"use client";

import { useCallback } from "react";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { toast } from "sonner";

export function PointDetailPageClient({ id }: { id: string }) {
    const onSubmitReview = useCallback(async (data: { rating: number; comment: string }) => {
        await new Promise((r) => setTimeout(r, 500));
        toast.message("(Mock) Review registrada localmente");
    }, []);

    return (
        <div className="container mx-auto max-w-2xl px-4 py-10">
            <h1 className="text-2xl font-semibold tracking-tight">Ponto #{id}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Detalhes do ponto turístico (carregar via Prisma no server component futuramente).
            </p>
            <div className="mt-8">
                <h2 className="text-lg font-medium">Deixe sua avaliação</h2>
                <div className="mt-4">
                    <ReviewForm onSubmitReview={onSubmitReview} />
                </div>
            </div>
        </div>
    );
}
