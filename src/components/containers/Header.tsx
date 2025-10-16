'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';


export function Header() {
    const pathname = usePathname();

    const nav = [
        { href: '/', label: 'Início' },
        { href: '/pontos', label: 'Pontos' },
        { href: '/tokens', label: 'Tokens' },
    ];

    return (
        <header className='sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container mx-auto flex h-16 items-center justify-between px-4'>
                <div className='flex items-center gap-3'>
                    <Link href='/' className='font-bold tracking-tight'>
                        Tourism<span className='text-primary'>DApp</span>
                    </Link>

                    <nav className='hidden md:block'>
                        <NavigationMenu>
                            <NavigationMenuList>
                                {nav.map((item) => (
                                    <NavigationMenuItem key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
                                                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                                            )}
                                        >
                                            {item.label}
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>
                </div>

                <div className='hidden items-center gap-2 md:flex'>
                    <Button asChild variant='ghost'>
                        <Link href='/login'>Entrar</Link>
                    </Button>

                    <Button asChild>
                        <Link href='/signup'>Criar conta</Link>
                    </Button>
                </div>

                {/* Mobile */}
                <Sheet>
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
                </Sheet>
            </div>
        </header>
    );
}
