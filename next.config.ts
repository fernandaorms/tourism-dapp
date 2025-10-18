import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '5axcxrqj15.ufs.sh',
                port: '',
                pathname: '/f/*',
            },
        ],
    },
};

export default nextConfig;
