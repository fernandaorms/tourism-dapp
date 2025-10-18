import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

type NavLink = {
    href: string;
    label: string;
};

type Props = {
    nav: NavLink[];
};


export function HeaderNavMobile({ nav }: Props) {
    return (
        < Sheet >
            <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='md:hidden' aria-label='Abrir menu'>
                    <Menu className='h-5 w-5' />
                </Button>
            </SheetTrigger>

            <SheetContent side='right'>
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <div className='mt-4 grid gap-2 p-4'>
                    {nav.map((item) => (
                        <Link key={item.href} href={item.href} className='rounded-md px-3 py-2 text-sm hover:bg-accent'>
                            {item.label}
                        </Link>
                    ))}

                    <div className='mt-4 grid gap-2'>
                        <Button asChild variant='outline'>
                            <Link href='/login'>Entrar</Link>
                        </Button>

                        <Button asChild>
                            <Link href='/signup'>Criar conta</Link>
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet >
    )
}
