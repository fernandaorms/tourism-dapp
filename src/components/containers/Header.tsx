import { auth } from '@/auth'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeaderNav } from '../menus/HeaderNav';
import { HeaderNavMobile } from '../menus/HeaderNavMobile';
import { LogoutButton } from '../buttons/LogoutButton';


export async function Header() {
    const session = await auth();

    console.log(session);

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

                    <HeaderNav nav={nav} />
                </div>

                <div className='hidden items-center gap-2 md:flex'>
                    <Button asChild variant='ghost'>
                        <Link href='/login'>Entrar</Link>
                    </Button>

                    <Button asChild>
                        <Link href='/signup'>Criar conta</Link>
                    </Button>

                    <LogoutButton />
                </div>

                <HeaderNavMobile nav={nav} />
            </div>
        </header>
    );
}
