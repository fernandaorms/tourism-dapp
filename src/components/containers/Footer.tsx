import { LogoFeORms } from '../logos/LogoFeORms';

export function Footer() {
    return (
        <footer className='border-t bg-muted/10'>
            <div className='container mx-auto px-4 py-8 text-sm text-muted-foreground'>
                <div className='flex flex-col items-center gap-2 md:flex-row'>
                    <span>© {new Date().getFullYear()} TourismDApp — Transparência em avaliações.</span>

                    <LogoFeORms heightClass='h-[16px]' />
                </div>
            </div>
        </footer>
    );
}
