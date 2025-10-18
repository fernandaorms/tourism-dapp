import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
    email: z.email().transform((v) => v.toLowerCase().trim()),
    password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            credentials: { email: {}, password: {} },
            authorize: async (credentials) => {
                const parsed = credentialsSchema.safeParse(credentials);
                if (!parsed.success) return null;

                const { email, password } = parsed.data;

                // find user
                const user = await prisma.appUser.findUnique({
                    where: { email },
                    select: { id: true, email: true, username: true, passwordHash: true, role: true },
                });
                if (!user) return null;

                // compare pasword hash
                const ok = await bcrypt.compare(password, user.passwordHash);
                if (!ok) return null;

                // return user object
                return {
                    id: Number(user.id),
                    email: user.email,
                    name: user.username, // padrão NextAuth
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = Number(user.id);
                token.role = user.role;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).id = token.id as number;
                session.user.role = token.role as 'USER' | 'ADMIN';
                session.user.name = token.name as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});
