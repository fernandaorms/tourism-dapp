// components/auth/UserMenu.tsx
'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User as UserIcon, LogOut } from 'lucide-react';

export function UserMenu({ username }: { username?: string | null }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='gap-2'>
                    <UserIcon className='h-4 w-4' />
                    <span className='hidden sm:inline'>{username ?? 'Conta'}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-44'>
                <DropdownMenuItem asChild>
                    <Link href='/perfil'>Perfil</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                    className='text-destructive focus:text-destructive'
                >
                    <LogOut className='mr-2 h-4 w-4 text-destructive' />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
