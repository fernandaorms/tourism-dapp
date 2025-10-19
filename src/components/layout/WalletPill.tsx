'use client';

import { useAccount, useChainId } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Wallet, Copy, Check } from 'lucide-react';
import { useState } from 'react';

function short(addr?: string) {
    return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : '';
}

export function WalletPill() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId();
    const [copied, setCopied] = useState(false);

    if (!isConnected) return null;

    async function copy() {
        if (!address) return;
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    }

    // const networkLabel = chainId === 11155111 ? 'Sepolia' : `Chain ${chainId}`;

    return (
        <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-[5px] text-sm">
                <Wallet className="h-3.5 w-3.5" />
                {short(address)}
            </span>

            {/* <span className="rounded-full border px-2 py-1 text-xs text-muted-foreground">
                {networkLabel}
            </span> */}

            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={copy} aria-label="Copiar endereço">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
        </div>
    );
}
