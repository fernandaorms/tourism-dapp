'use server';

import { signIn } from '@/auth';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.email().transform(v => v.toLowerCase().trim()),
    password: z.string().min(6),
});

export async function loginAction(input: unknown) {
    const { email, password } = loginSchema.parse(input);

    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        return { success: true };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        if (err?.type === 'CredentialsSignin') {
            return { success: false, message: 'E-mail ou senha inválidos.' };
        }
        return { success: false, message: 'Erro inesperado ao efetuar login.' };
    }
}
