// app/admin/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { auth } from '@/auth';

const newPointSchema = z.object({
    name: z.string().min(3),
    description: z.string().trim().min(10).max(200),
    city: z.string().min(2),
    country: z.string().min(2),
    photoUrl: z.url(),
    categoryId: z.number().int(),
});


export async function createPointAction(input: unknown) {
    const session = await auth();
    if (!session?.user) throw new Error('Não autenticado.');
    if (session.user.role !== 'ADMIN') throw new Error('Acesso negado.');

    const data = newPointSchema.parse(input);

    const existing = await prisma.point.findFirst({
        where: {
            name: { equals: data.name, mode: 'insensitive' },
            city: { equals: data.city, mode: 'insensitive' },
            country: { equals: data.country, mode: 'insensitive' },
        },
        select: { id: true },
    });

    if (existing) {
        throw new Error('Já existe um ponto com este nome nesta cidade e país.');
    }

    const created = await prisma.point.create({
        data: {
            name: data.name,
            description: data.description,
            city: data.city,
            country: data.country,
            photoUrl: data.photoUrl,
            categoryId: data.categoryId,
            onchainRegistered: false,
        },
        select: { id: true },
    });

    return { id: created.id };
}
