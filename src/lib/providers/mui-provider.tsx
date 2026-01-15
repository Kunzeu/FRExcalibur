'use client';

import * as React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { muiTheme, muiDarkTheme } from '@/lib/theme/mui-theme';
import { useTheme } from '@/lib/contexts/theme-context';

export function MuiProvider({ children }: { children: React.ReactNode }) {
    const { mode } = useTheme();
    const theme = mode === 'dark' ? muiDarkTheme : muiTheme;

    return (
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </AppRouterCacheProvider>
    );
}
