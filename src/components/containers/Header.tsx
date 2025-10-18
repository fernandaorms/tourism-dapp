import { auth } from '@/auth'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HeaderNav } from '../menus/HeaderNav';
import { HeaderNavMobile } from '../menus/HeaderNavMobile';
import { UserMenu } from '../menus/UserMenu';
import { WalletButton } from '../buttons/WalletButton';


export async function Header() {
    const session = await auth();

    console.log(session);

    const isLogged = Boolean(session?.user);
    const username = session?.user?.name ?? '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (session?.user as any)?.role as 'USER' | 'ADMIN' | undefined;

    const nav = [
        { href: '/', label: 'Explorar' },
        { href: '/tokens', label: 'Tokens' },
    ];

    if (session?.user?.role === 'ADMIN') nav.push({ href: '/admin', label: 'Administrador' });

    return (
        <header className='sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container mx-auto flex h-16 items-center justify-between px-4'>
                <div className='flex items-center gap-3'>
                    <Link href='/' className='font-bold tracking-tight'>
                        Tourism<span className='text-primary'>DApp</span>
                    </Link>

                    <HeaderNav nav={nav} />
                </div>

                <div className='hidden items-center gap-2 lg:flex'>
                    {!session?.user ? (
                        <>
                            <Button asChild variant='ghost'>
                                <Link href='/login'>Entrar</Link>
                            </Button>

                            <Button asChild>
                                <Link href='/signup'>Criar conta</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <WalletButton />
                            <UserMenu username={session.user.name} />
                        </>
                    )}
                </div>

                <HeaderNavMobile
                    nav={nav}
                    isLogged={isLogged}
                    username={username}
                    role={role}
                />
            </div>
        </header>
    );
}
