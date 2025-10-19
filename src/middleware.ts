import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const config = {
    matcher: [
        '/login',
        '/signup',
        '/admin',
        '/perfil',
        '/tokens'
    ]
};

export default auth((req) => {
    const { user } = req.auth ?? {};

    if (req.nextUrl.pathname.startsWith('/login')) {
        if (user?.id) return NextResponse.redirect(new URL("/", req.nextUrl.origin));
        return NextResponse.next();
    }

    if (req.nextUrl.pathname.startsWith('/signup')) {
        if (user?.id) return NextResponse.redirect(new URL("/", req.nextUrl.origin));
        return NextResponse.next();
    }

    // Block access - not auth user
    if (!user) {
        return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
    }

    // Block access - not admin user
    if (req.nextUrl.pathname.startsWith('/admin') && user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.nextUrl.origin));
    }

    return NextResponse.next();
});
