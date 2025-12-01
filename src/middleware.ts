import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const config = {
    matcher: [
        '/login',
        '/signup',
        '/admin',
        '/perfil',
        '/tokens',
    ],
};

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isLoggedIn = !!token;

    const role =
        (token as any)?.role ??
        (token as any)?.user?.role ??
        null;

    if (pathname.startsWith('/login')) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/', origin));
        }
        return NextResponse.next();
    }

    if (pathname.startsWith('/signup')) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/', origin));
        }
        return NextResponse.next();
    }

    const isProtected =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/perfil') ||
        pathname.startsWith('/tokens');

    if (isProtected && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', origin));
    }

    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', origin));
    }

    return NextResponse.next();
}
