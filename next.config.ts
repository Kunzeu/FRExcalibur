import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,

    eslint: {
        ignoreDuringBuilds: false,
    },

    typescript: {
        ignoreBuildErrors: false,
    },

    experimental: {
        optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    },

    // Especificar el directorio raíz para Turbopack
    turbopack: {
        root: __dirname,
    },

    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on"
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload"
                    },
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN"
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff"
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block"
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin"
                    },
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=()"
                    }
                ]
            }
        ];
    }
};

export default nextConfig;
