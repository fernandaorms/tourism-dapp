import Link from 'next/link';

export function Footer() {
    return (
        <footer className='border-t bg-muted/10'>
            <div className='container mx-auto px-4 py-8 text-sm text-muted-foreground'>
                <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
                    <p>
                        © {new Date().getFullYear()} TourismDApp — Transparência em avaliações.
                    </p>

                    <nav className='flex items-center gap-4'>
                        <Link href='/privacy' className='hover:text-foreground'>Privacidade</Link>

                        <Link href='/terms' className='hover:text-foreground'>Termos</Link>
                        
                        <Link href='/about' className='hover:text-foreground'>Sobre</Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
