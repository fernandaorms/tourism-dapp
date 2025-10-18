'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { User as UserIcon, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { WalletButton } from '@/components/buttons/WalletButton';
import { signOut } from 'next-auth/react';

type NavLink = { href: string; label: string };
type Props = { nav: NavLink[]; isLogged: boolean; username?: string; role?: 'USER' | 'ADMIN' };

export function HeaderNavMobile({ nav, isLogged, role }: Props) {
    const [open, setOpen] = useState(false);

    const closeAnd = useCallback((fn?: () => void) => {
        return () => {
            setOpen(false);
            if (fn) setTimeout(fn, 0);
        };
    }, []);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='lg:hidden' aria-label='Abrir menu'>
                    <Menu className='h-5 w-5' />
                </Button>
            </SheetTrigger>

            {/* 👇 vira um layout em coluna ocupando a altura inteira */}
            <SheetContent side='right' className='p-0 flex h-full flex-col'>
                <SheetHeader className='p-4'>
                    <SheetTitle>
                        Tourism<span className='text-primary'>DApp</span>
                    </SheetTitle>
                </SheetHeader>

                {/* conteúdo “rolável” do meio */}
                <div className='flex-1 overflow-y-auto p-4'>
                    {/* Navegação principal */}
                    <nav className='grid gap-2'>
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className='rounded-md px-3 py-2 text-sm hover:bg-accent'
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className='my-3 h-px bg-border' />

                    {/* Ações por estado de sessão (tudo menos o logout) */}
                    {!isLogged ? (
                        <div className='grid gap-2'>
                            <Button asChild variant='outline' onClick={() => setOpen(false)}>
                                <Link href='/login'>Entrar</Link>
                            </Button>
                            <Button asChild onClick={() => setOpen(false)} className='w-full'>
                                <Link href='/signup'>Criar conta</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className='grid gap-2'>
                            <div className='px-3'>
                                <WalletButton className='w-full' />
                            </div>
                            <Link
                                href='/perfil'
                                onClick={() => setOpen(false)}
                                className='rounded-md px-3 py-2 text-sm hover:bg-accent inline-flex items-center gap-2'
                            >
                                <UserIcon className='h-4 w-4' />
                                Meu perfil
                            </Link>
                            {role === 'ADMIN' && (
                                <Link
                                    href='/admin'
                                    onClick={() => setOpen(false)}
                                    className='rounded-md px-3 py-2 text-sm hover:bg-accent'
                                >
                                    Admin
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {isLogged && (
                    <div className='mt-auto border-t p-4 pb-6'>
                        <Button
                            variant='ghost'
                            className='w-full justify-start'
                            onClick={closeAnd(() => signOut({ redirect: true, callbackUrl: '/' }))}
                        >
                            <LogOut className='mr-2 h-4 w-4' />
                            Logout
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
