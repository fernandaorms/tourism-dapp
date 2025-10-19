import type { Metadata } from 'next';
import Providers from "./providers";
import { Header } from '@/components/containers/Header';
import './globals.css';
import { Footer } from '@/components/containers/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
    title: 'TourismDApp',
    description: 'Transparência em avaliações.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body
                className={`min-h-screen bg-background text-foreground antialiased`}
            >
                <Providers>
                    <div className='flex min-h-screen flex-col'>
                        <Header />

                        <main className='flex-1'>{children}</main>

                        <Footer />
                    </div>

                    <Toaster richColors closeButton />
                </Providers>
            </body>
        </html>
    );
}
