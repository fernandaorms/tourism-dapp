'use server'

import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const serverSignupSchema = z.object({
    email: z.email('E-mail inválido').transform((v) => v.toLowerCase().trim()),
    username: z
        .string()
        .min(3, 'Mínimo de 3 caracteres')
        .max(16, 'Máximo de 16 caracteres')
        .regex(/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/,
            'O nome de usuário deve começar com uma letra e pode conter letras, números e underscores (_)')
        .transform((v) => v.trim()),
    password: z.string().min(6, 'Mínimo de 6 caracteres'),
});

export async function signupAction(input: unknown) {
    const { email, username, password } = serverSignupSchema.parse(input);

    const [emailUsed, usernameUsed] = await Promise.all([
        prisma.appUser.findUnique({ where: { email } }),
        prisma.appUser.findUnique({ where: { username } }),
    ]);

    if (emailUsed) throw new Error('E-mail já cadastrado');
    if (usernameUsed) throw new Error('Usuário indisponível');

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.appUser.create({
        data: { email, username, passwordHash },
        select: { id: true, email: true, username: true, role: true, createdAt: true },
    });

    return { userId: user.id, email: user.email, username: user.username, role: user.role }
}
