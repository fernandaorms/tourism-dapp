// app/admin/page.tsx
import { prisma } from '@/lib/prisma';
import { NewPointForm } from '@/components/forms/NewPointForm';

export default async function AdminPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true },
    });

    return (
        <section className='container mx-auto max-w-2xl px-4 py-10'>
            <h1 className='text-2xl font-bold tracking-tight'>Cadastrar ponto turístico</h1>
            <p className='text-sm text-muted-foreground mb-6 mt-2'>
                Preencha os dados abaixo para criar um novo ponto turístico.
            </p>

            <NewPointForm categories={categories} />
        </section>
    );
}
