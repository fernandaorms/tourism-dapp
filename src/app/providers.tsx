'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '@/config/wagmi'
import { SessionProvider } from 'next-auth/react'
import { ReactNode, useState } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
    const [client] = useState(() => new QueryClient())

    return (
        <SessionProvider>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={client}>
                    {children}
                </QueryClientProvider>
            </WagmiProvider>
        </SessionProvider>
    )
}
