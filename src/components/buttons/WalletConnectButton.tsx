'use client';

import { Button } from '@/components/ui/button';
import { WalletPill } from '@/components/layout/WalletPill';
import { Wallet } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function WalletConnectButton({
    compact = false,          // Header: compacto (pill + pequeno botão de sair opcional)
    showDisconnect = true,    // Mostrar/ocultar botão “Desconectar”
}: {
    compact?: boolean;
    showDisconnect?: boolean;
}) {
    const { isConnected } = useAccount();
    const { connect, isPending } = useConnect();
    const { disconnect } = useDisconnect();

    if (!isConnected) {
        return (
            <Button
                onClick={() => connect({ connector: injected() })}
                disabled={isPending}
                className='gap-2 bg-emerald-500 hover:bg-emerald-600 text-white'
            >
                <Wallet className='h-4 w-4' />
                {isPending ? 'Conectando…' : 'Conectar carteira'}
            </Button>
        );
    }

    // Estado conectado
    if (compact) {
        return (
            <div className='flex items-center gap-2'>
                <WalletPill />
                {showDisconnect && (
                    <Button variant='ghost' size='sm' onClick={() => disconnect()}>
                        Desconectar
                    </Button>
                )}
            </div>
        );
    }

    // Versão “padrão” (ex.: sidebar do ponto)
    return (
        <div className='flex flex-wrap items-center gap-3'>
            <WalletPill />

            {showDisconnect && (
                <Button variant='ghost' onClick={() => disconnect()}>
                    Desconectar
                </Button>
            )}
        </div>
    );
}
