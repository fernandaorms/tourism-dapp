'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Wallet } from 'lucide-react';

type Props = {
    className?: string;
};

export function WalletButton({ className }: Props) {
    return (
        <Button
            variant='default'
            className={cn('gap-2', className)}
        >
            <Wallet className='h-4 w-4' />
            Conectar carteira
        </Button>
    );

    // To Do:
    // onClick={() => /* abrir modal wagmi/rainbowkit ou metamask */ }
}
