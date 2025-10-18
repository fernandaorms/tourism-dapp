'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@/components/ui/navigation-menu';

type NavLink = {
    href: string;
    label: string;
};

type Props = {
    nav: NavLink[];
};

export function HeaderNav({ nav }: Props) {
    const pathname = usePathname();

    return (
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
    );
}
