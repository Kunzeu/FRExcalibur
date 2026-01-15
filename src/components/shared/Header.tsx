'use client';

import { useSession } from 'next-auth/react';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Avatar,
} from '@mui/material';
import {
    Search as SearchIcon,
    Notifications as NotificationsIcon,
    Email as EmailIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useTheme } from '@/lib/contexts/theme-context';

export default function Header() {
    const { data: session } = useSession();
    const userName = session?.user?.name || '';
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const { mode, toggleTheme } = useTheme();

    const handleMobileSearchToggle = useCallback(() => {
        setShowMobileSearch(prev => !prev);
    }, []);

    return (
        <Box
            className="bg-white dark:bg-black py-3 sm:py-4 mb-6 sm:mb-8 sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800"
            sx={{
                width: '100%',
                maxWidth: '100%',
                marginLeft: 0,
                marginRight: 0,
                paddingLeft: { xs: '16px', sm: '32px', lg: '32px', xl: '40px', '2xl': '48px' },
                paddingRight: { xs: '16px', sm: '32px', lg: '32px', xl: '40px', '2xl': '48px' }
            }}
        >
            <Box className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full"
                sx={{
                    maxWidth: {
                        lg: '1920px',
                        xl: '100%',
                        '2xl': '100%'
                    },
                    mx: 'auto',
                    width: '100%',
                    px: { xl: 4, '2xl': 6 }
                }}
            >

                {/* MOBILE HEADER: Logo + Icons */}
                <Box className="flex items-center justify-between w-full lg:hidden">
                    <Box className="flex items-center gap-3">
                        <Box className="bg-black px-3 py-1.5 rounded">
                            <Typography variant="h6" className="font-bold text-white leading-none tracking-widest text-sm">
                                EXCALIBUR
                            </Typography>
                        </Box>
                    </Box>

                    {/* Mobile Icons */}
                    <Box className="flex items-center gap-1.5">
                        <IconButton
                            size="small"
                            onClick={toggleTheme}
                            className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                            aria-label="Toggle theme"
                            sx={{
                                WebkitTapHighlightColor: 'transparent',
                                touchAction: 'manipulation'
                            }}
                        >
                            {mode === 'dark' ? (
                                <LightModeIcon className="text-yellow-500" sx={{ fontSize: 20 }} />
                            ) : (
                                <DarkModeIcon className="text-gray-600 dark:text-gray-300" sx={{ fontSize: 20 }} />
                            )}
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={handleMobileSearchToggle}
                            className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                            aria-label="Toggle search"
                            sx={{
                                WebkitTapHighlightColor: 'transparent',
                                touchAction: 'manipulation'
                            }}
                        >
                            <SearchIcon className="text-yellow-500" sx={{ fontSize: 20 }} />
                        </IconButton>

                        <IconButton
                            size="small"
                            className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                            aria-label="Calendar"
                            sx={{
                                WebkitTapHighlightColor: 'transparent',
                                touchAction: 'manipulation',
                                position: 'relative'
                            }}
                        >
                            <Box className="relative flex items-center justify-center">
                                <Image
                                    src="/icons/iconos-svg/calendar.svg"
                                    alt=""
                                    aria-hidden="true"
                                    width={20}
                                    height={20}
                                    className="opacity-60 dark:invert"
                                />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-900"></span>
                            </Box>
                        </IconButton>

                        <IconButton
                            size="small"
                            className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                            aria-label="Emails"
                            sx={{
                                WebkitTapHighlightColor: 'transparent',
                                touchAction: 'manipulation',
                                position: 'relative'
                            }}
                        >
                            <Box className="relative flex items-center justify-center">
                                <EmailIcon className="text-gray-400 dark:text-gray-300" sx={{ fontSize: 20 }} />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-900"></span>
                            </Box>
                        </IconButton>

                        <IconButton
                            size="small"
                            className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-2"
                            aria-label="Notifications"
                            sx={{
                                WebkitTapHighlightColor: 'transparent',
                                touchAction: 'manipulation',
                                position: 'relative'
                            }}
                        >
                            <Box className="relative flex items-center justify-center">
                                <NotificationsIcon className="text-gray-400 dark:text-gray-300" sx={{ fontSize: 20 }} />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-900"></span>
                            </Box>
                        </IconButton>

                        <Box className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ml-1 relative">
                            <Image
                                src="/icons/iconos-svg/user.svg"
                                alt="User"
                                width={16}
                                height={16}
                                className="opacity-60 dark:invert"
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Mobile Search Bar */}
                {showMobileSearch && (
                    <Box className="w-full sm:hidden">
                        <Paper
                            elevation={0}
                            className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                            sx={{
                                boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.05)'
                            }}
                        >
                            <SearchIcon className="text-yellow-500" sx={{ fontSize: 20 }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 w-full placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                            />
                        </Paper>
                    </Box>
                )}


                {/* DESKTOP SPACER */}
                <Box className="hidden lg:block flex-1" />

                {/* Desktop Search and Profile Container - Pill Shape */}
                <Paper
                    elevation={0}
                    className="hidden sm:flex items-center gap-4 lg:gap-6 px-3 lg:px-4 py-2 lg:py-3 rounded-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 w-full sm:w-auto sm:flex-1 lg:flex-initial"
                    sx={{
                        maxWidth: { sm: '100%', lg: '900px', xl: '1100px', '2xl': '1400px' },
                        paddingRight: { sm: '15px', lg: '30px', xl: '35px', '2xl': '45px' },
                        boxShadow: '0px 4px 25px rgba(0, 0, 0, 0.05)'
                    }}
                >
                    {/* Search Input Area */}
                    <Box className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-full px-4 lg:px-8 py-2 lg:py-3 flex items-center gap-2 lg:gap-4">
                        <SearchIcon className="text-yellow-500" sx={{ fontSize: { sm: 20, lg: 28, xl: 30, '2xl': 34 } }} />
                        <input
                            type="text"
                            placeholder="Search something..."
                            aria-label="Search"
                            className="bg-transparent border-none outline-none text-sm lg:text-base text-gray-700 dark:text-gray-200 w-full placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                        />
                    </Box>

                    {/* Icons - Hidden on small screens, show on medium+ */}
                    <Box className="hidden md:flex items-center gap-1 lg:gap-2">
                        {/* Theme Toggle */}
                        <IconButton
                            size="small"
                            onClick={toggleTheme}
                            className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 lg:p-2.5 rounded-full"
                            aria-label="Toggle theme"
                            sx={{
                                backgroundColor: 'rgb(249, 250, 251) !important',
                                '&:hover': {
                                    backgroundColor: 'rgb(243, 244, 246) !important'
                                },
                                '.dark &': {
                                    backgroundColor: 'rgb(31, 41, 55) !important',
                                    '&:hover': {
                                        backgroundColor: 'rgb(55, 65, 81) !important'
                                    }
                                }
                            }}
                        >
                            {mode === 'dark' ? (
                                <LightModeIcon className="text-yellow-500" sx={{ fontSize: { md: 18, lg: 22, xl: 24, '2xl': 28 } }} />
                            ) : (
                                <DarkModeIcon className="text-gray-600 dark:text-gray-300" sx={{ fontSize: { md: 18, lg: 22, xl: 24, '2xl': 28 } }} />
                            )}
                        </IconButton>
                        <IconButton
                            size="small"
                            className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 lg:p-2.5 rounded-full"
                            aria-label="Calendar"
                            sx={{
                                backgroundColor: 'rgb(249, 250, 251) !important',
                                '&:hover': {
                                    backgroundColor: 'rgb(243, 244, 246) !important'
                                },
                                '.dark &': {
                                    backgroundColor: 'rgb(31, 41, 55) !important',
                                    '&:hover': {
                                        backgroundColor: 'rgb(55, 65, 81) !important'
                                    }
                                }
                            }}
                        >
                            <Box className="relative flex items-center justify-center">
                                <Image
                                    src="/icons/iconos-svg/calendar.svg"
                                    alt=""
                                    aria-hidden="true"
                                    width={18}
                                    height={18}
                                    className="opacity-60 lg:w-5 lg:h-5 dark:invert"
                                    style={{
                                        width: 'clamp(18px, 1.2vw, 24px)',
                                        height: 'clamp(18px, 1.2vw, 24px)'
                                    }}
                                />
                                <span className="absolute -top-1 -right-1 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-900"></span>
                            </Box>
                        </IconButton>
                        <IconButton
                            size="small"
                            className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 lg:p-2.5 rounded-full"
                            aria-label="Emails"
                            sx={{
                                backgroundColor: 'rgb(249, 250, 251) !important',
                                '&:hover': {
                                    backgroundColor: 'rgb(243, 244, 246) !important'
                                },
                                '.dark &': {
                                    backgroundColor: 'rgb(31, 41, 55) !important',
                                    '&:hover': {
                                        backgroundColor: 'rgb(55, 65, 81) !important'
                                    }
                                }
                            }}
                        >
                            <Box className="relative flex items-center justify-center">
                                <EmailIcon className="text-gray-400 dark:text-gray-300" sx={{ fontSize: { md: 18, lg: 22, xl: 24, '2xl': 28 } }} />
                                <span className="absolute -top-1 -right-1 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-900"></span>
                            </Box>
                        </IconButton>
                        <IconButton
                            size="small"
                            className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 lg:p-2.5 rounded-full"
                            aria-label="Notifications"
                            sx={{
                                backgroundColor: 'rgb(249, 250, 251) !important',
                                '&:hover': {
                                    backgroundColor: 'rgb(243, 244, 246) !important'
                                },
                                '.dark &': {
                                    backgroundColor: 'rgb(31, 41, 55) !important',
                                    '&:hover': {
                                        backgroundColor: 'rgb(55, 65, 81) !important'
                                    }
                                }
                            }}
                        >
                            <Box className="relative flex items-center justify-center">
                                <NotificationsIcon className="text-gray-400 dark:text-gray-300" sx={{ fontSize: { md: 18, lg: 22, xl: 24, '2xl': 28 } }} />
                                <span className="absolute -top-1 -right-1 w-2 h-2 lg:w-2.5 lg:h-2.5 bg-yellow-400 rounded-full border-2 border-white dark:border-gray-900"></span>
                            </Box>
                        </IconButton>
                    </Box>

                    {/* Profile */}
                    <Box className="flex items-center gap-2 lg:gap-3 pl-1 lg:pl-2 border-l border-gray-200 dark:border-gray-700 ml-1 lg:ml-2">
                        <Box className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                            sx={{
                                width: { lg: '36px', xl: '40px', '2xl': '48px' },
                                height: { lg: '36px', xl: '40px', '2xl': '48px' }
                            }}
                        >
                            <Image
                                src="/icons/iconos-svg/user.svg"
                                alt="User"
                                width={16}
                                height={16}
                                className="opacity-60 lg:w-[18px] lg:h-[18px] dark:invert"
                                style={{
                                    width: 'clamp(16px, 1vw, 20px)',
                                    height: 'clamp(16px, 1vw, 20px)'
                                }}
                            />
                        </Box>
                        <Typography variant="body2" className="font-bold text-gray-700 dark:text-gray-200 text-xs lg:text-sm hidden lg:block"
                            sx={{
                                fontSize: { lg: '0.875rem', xl: '0.95rem', '2xl': '1.125rem' }
                            }}
                        >
                            {userName}
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}
