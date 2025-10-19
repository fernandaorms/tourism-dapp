'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WalletPill } from '@/components/layout/WalletPill';
import { Wallet } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useMounted } from '@/hooks/useMounted';

type Props = {
    compact?: boolean;
    className?: string;
};

export function WalletConnectButton({
    compact = false,
    className,
}: Props) {
    const mounted = useMounted();

    const { status, isConnected } = useAccount(); // 'connected' | 'connecting' | 'reconnecting' | 'disconnected'
    const { connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();

    const isBusy = isPending || status === 'connecting' || status === 'reconnecting';

    if (!mounted) {
        if (compact) {
            return (
                <div className={`flex items-center gap-2 ${className ?? ''}`}>
                    <Skeleton className='h-8 w-28 rounded-full' />
                    <Skeleton className='h-8 w-24 rounded-md' />
                </div>
            );
        }
        return <Skeleton className={`h-10 w-full rounded-md ${className ?? ''}`} />;
    }

    if (!isConnected) {
        return (
            <Button
                onClick={() => connect({ connector: injected() })}
                disabled={isBusy}
                className={`gap-2 bg-emerald-500 hover:bg-emerald-600 text-white ${className ?? ''}`}
            >
                <Wallet className='h-4 w-4' />
                {isBusy ? 'Conectando…' : 'Conectar carteira'}
            </Button>
        );
    }

    if (compact) {
        return (
            <div className={`flex items-center gap-2 ${className ?? ''}`}>
                <WalletPill />

                <Button variant='ghost' size='sm' onClick={() => disconnect()}>
                    Desconectar
                </Button>
            </div>
        );
    }
    
    return (
        <div className={`flex flex-wrap items-center gap-3 ${className ?? ''}`}>
            <WalletPill />

            <Button variant='ghost' onClick={() => disconnect()}>
                Desconectar
            </Button>
        </div>
    );
}
