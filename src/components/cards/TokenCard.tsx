'use client';

import Link from 'next/link';
import { Award, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

type TokenCardProps = {
    tokenId: string;     // ex.: 'SBT-002'
    placeName: string;   // ex.: 'Torre Eiffel'
    mintedLabel: string; // ex.: 'Conquistado em 03 de out. de 2025'
    txUrl: string;       // link do explorer
    className?: string;
};

export function TokenCard({
    tokenId,
    placeName,
    mintedLabel,
    txUrl,
    className,
}: TokenCardProps) {
    return (
        <div
            data-slot='card'
            className={cn(
                'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm overflow-hidden hover:shadow-md transition-shadow',
                className
            )}
        >
            <div data-slot='card-content' className='p-6'>
                {/* topo */}
                <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                        <div className='h-12 w-12 rounded-full bg-sky-500 flex items-center justify-center'>
                            <Award className='h-6 w-6 text-primary-foreground' />
                        </div>

                        <div>
                            <span
                                data-slot='badge'
                                className='inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden border-transparent bg-secondary text-secondary-foreground mb-2'
                            >
                                Soulbound Token
                            </span>
                            <p className='font-mono text-xs text-muted-foreground'>{tokenId}</p>
                        </div>
                    </div>
                </div>

                {/* título + meta */}
                <h4 className='font-semibold mb-2 text-balance'>{placeName}</h4>
                <p className='text-sm text-muted-foreground mb-4'>{mintedLabel}</p>

                {/* link tx */}
                <Link
                    href={txUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-1 text-xs text-primary hover:underline'
                >
                    Ver na blockchain
                    <ExternalLink className='h-3 w-3' />
                </Link>
            </div>
        </div>
    );
}
