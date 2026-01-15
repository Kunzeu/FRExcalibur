'use client';

import { Box } from '@mui/material';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <Box
            className="flex min-h-screen bg-gray-50 dark:bg-black"
            sx={{
                width: '100vw',
                maxWidth: '100%',
                flexDirection: 'column',
            }}
        >
            {/* Main Content Wrapper */}
            <Box className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Header />

                <Box
                    component="main"
                    className="flex-1 pb-8"
                    sx={{
                        px: {
                            xs: 4,      // Mobile: 16px
                            sm: 5,      // Small tablet: 20px
                            md: 6,      // Tablet: 24px
                            lg: 8,      // 720p/1080p: 32px
                            xl: 10,     // 2K: 40px
                            '2xl': 12   // 4K: 48px
                        },
                        pb: {
                            xs: 6,      // Mobile
                            sm: 7,      // Small tablet
                            md: 8,      // Tablet
                            lg: 8,      // Desktop
                            xl: 9,      // 2K
                            '2xl': 10   // 4K
                        },
                        maxWidth: {
                            xs: '100%',
                            sm: '100%',
                            md: '100%',
                            lg: '1920px',
                            xl: '2560px',
                            '2xl': '3840px'
                        },
                        mx: 'auto',
                        width: '100%'
                    }}
                >
                    {children}
                </Box>

                <Footer />
            </Box>
        </Box>
    );
}
