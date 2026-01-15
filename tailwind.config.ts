import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    main: '#EAB308', // Gold
                    light: '#FEE28A', // Light Gold
                    dark: '#423306', // Dark Gold/Brown
                    contrastText: '#000000',
                },
                secondary: {
                    main: '#6D6D6D', // Dark Gray
                    light: '#D1D1D1', // Light Gray
                    dark: '#000000', // Black
                    contrastText: '#ffffff',
                },
                gold: {
                    50: '#FEF9E8',
                    300: '#FEE28A',
                    500: '#EAB308',
                    900: '#423306',
                },
                neutral: {
                    50: '#F6F6F6',
                    300: '#D1D1D1',
                    500: '#6D6D6D',
                    900: '#000000',
                },
                error: {
                    main: '#ef4444',
                    light: '#f87171',
                    dark: '#dc2626',
                },
                warning: {
                    main: '#f59e0b',
                    light: '#fbbf24',
                    dark: '#d97706',
                },
                info: {
                    main: '#06b6d4',
                    light: '#22d3ee',
                    dark: '#0891b2',
                },
                success: {
                    main: '#10b981',
                    light: '#34d399',
                    dark: '#059669',
                },
            },
        },
    },
    plugins: [],
};

export default config;
