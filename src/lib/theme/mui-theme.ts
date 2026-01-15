'use client';

import { createTheme } from '@mui/material/styles';

/**
 * Custom Material UI Theme
 * Compatible with Tailwind CSS
 */
export const muiTheme = createTheme({
    palette: {
        mode: 'light',
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
        error: {
            main: '#ef4444', // red-500
            light: '#f87171', // red-400
            dark: '#dc2626', // red-600
        },
        warning: {
            main: '#f59e0b', // amber-500
            light: '#fbbf24', // amber-400
            dark: '#d97706', // amber-600
        },
        info: {
            main: '#06b6d4', // cyan-500
            light: '#22d3ee', // cyan-400
            dark: '#0891b2', // cyan-600
        },
        success: {
            main: '#10b981', // emerald-500
            light: '#34d399', // emerald-400
            dark: '#059669', // emerald-600
        },
        background: {
            default: '#F6F6F6', // Light Gray/White
            paper: '#ffffff',
        },
        text: {
            primary: '#000000', // Black
            secondary: '#6D6D6D', // Dark Gray
        },
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.25rem', // text-4xl
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '1.875rem', // text-3xl
            fontWeight: 700,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.5rem', // text-2xl
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.25rem', // text-xl
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.125rem', // text-lg
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '1rem', // text-base
            fontWeight: 600,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem', // text-sm
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none', // No automatic uppercase
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8, // rounded-lg
    },
    shadows: [
        'none',
        '0 1px 2px 0 rgb(0 0 0 / 0.05)', // shadow-sm
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', // shadow
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', // shadow-md
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // shadow-lg
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', // shadow-xl
        '0 25px 50px -12px rgb(0 0 0 / 0.25)', // shadow-2xl
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem', // rounded-lg
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '0.5rem',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '0.75rem', // rounded-xl
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                },
                elevation1: {
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                },
                elevation2: {
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                },
                elevation3: {
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '0.375rem', // rounded-md
                },
            },
        },
    },
});

/**
 * Material UI Dark Theme
 * True dark mode: black background, white text
 */
export const muiDarkTheme = createTheme({
    ...muiTheme,
    palette: {
        mode: 'dark',
        primary: {
            main: '#EAB308', // Gold (same as light mode for consistency)
            light: '#FEE28A', // Light Gold
            dark: '#CA8A04', // Darker Gold
            contrastText: '#000000',
        },
        secondary: {
            main: '#9CA3AF', // Medium Gray
            light: '#D1D1D1', // Light Gray
            dark: '#6B7280', // Dark Gray
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#000000', // Pure Black
            paper: '#1F1F1F', // Dark Gray (slightly lighter than black for cards)
        },
        text: {
            primary: '#FFFFFF', // Pure White
            secondary: '#D1D5DB', // Light Gray
        },
        divider: '#374151', // Dark Gray for borders
    },
    components: {
        ...muiTheme.components,
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1F1F1F',
                    color: '#FFFFFF',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1F1F1F',
                    color: '#FFFFFF',
                },
            },
        },
    },
});
