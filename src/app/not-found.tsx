import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <section className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
                Oops! Algo deu errado.
            </h1>

            <p className="text-muted-foreground max-w-md mb-6">
                Não conseguimos encontrar a página que você procura.<br />
                Tente voltar para a página inicial e continuar sua jornada.
            </p>

            <Button asChild>
                <Link href="/">Voltar para a Home</Link>
            </Button>
        </section>
    );
}
