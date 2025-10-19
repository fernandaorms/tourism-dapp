// config/wagmi.ts
import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export const wagmiConfig = createConfig({
    chains: [sepolia],
    transports: {
        [sepolia.id]: http(), // endpoint público; suficiente para conectar carteira
    },
})
