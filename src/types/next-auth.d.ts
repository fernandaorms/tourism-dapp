// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: number;
            name?: string | null;
            email?: string | null;
            role: 'USER' | 'ADMIN';
        };
    }

    interface User {
        id: number;
        role: 'USER' | 'ADMIN';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: number;
        role: 'USER' | 'ADMIN';
    }
}
