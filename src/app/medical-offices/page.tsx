'use client';

import { useState, useCallback, useMemo } from 'react';
import {
    Container,
    Box,
    Tabs,
    Tab,
    Typography,
} from '@mui/material';
import { useTheme } from '@/lib/contexts/theme-context';
import MedicalOfficesTab from './components/MedicalOfficesTab';
import IntakesPimmListTab from './components/IntakesPimmListTab';
import RemindersTab from './components/RemindersTab';
import HandlingLawyersTab from './components/HandlingLawyersTab';
import CalendarTab from './components/CalendarTab';

const BREADCRUMBS = [
    {
        parent: 'Intakes PIMM list medical/',
        current: 'PIMM intake form/intakes PIMM list'
    },
    {
        parent: 'Medical Offices/',
        current: 'Specialist'
    },
    {
        parent: 'Calendar',
    },
    {
        parent: 'Reminders',
    },
    {
        parent: 'Handling lawyers',
        current: 'management /H'
    }
];

export default function MedicalOfficesPage() {
    const [tabValue, setTabValue] = useState(0);
    const { mode } = useTheme();

    const handleTabChange = useCallback((index: number) => {
        setTabValue(index);
    }, []);

    const currentBreadcrumb = useMemo(() => BREADCRUMBS[tabValue] || BREADCRUMBS[0], [tabValue]);

    const backgroundColor = useMemo(() => mode === 'dark' ? '#1F2937' : '#F3F4F6', [mode]);
    const borderColor = useMemo(() => mode === 'dark' ? '#374151' : '#E5E7EB', [mode]);
    const textColor = useMemo(() => mode === 'dark' ? '#FFFFFF' : '#000000', [mode]);

    return (
        <Box className="min-h-screen bg-gray-50 dark:bg-black">

            {/* Mobile Navigation - All Tabs */}
            <Box
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    backgroundColor,
                    borderBottom: `1px solid ${borderColor}`,
                    width: '100%',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    '&::-webkit-scrollbar': {
                        display: 'none'
                    },
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: { xs: 2, sm: 3 },
                        px: { xs: 2, sm: 4 },
                        py: { xs: 2, sm: 3 },
                        minWidth: 'fit-content'
                    }}
                >
                    {BREADCRUMBS.map((breadcrumb, index) => {
                        const isActive = tabValue === index;
                        return (
                            <Box
                                key={index}
                                onClick={() => handleTabChange(index)}
                                onTouchStart={(e) => {
                                    // Optimize touch feedback
                                    e.currentTarget.style.opacity = '0.7';
                                }}
                                onTouchEnd={(e) => {
                                    e.currentTarget.style.opacity = '1';
                                }}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 0.5,
                                    cursor: 'pointer',
                                    minWidth: 'fit-content',
                                    flexShrink: 0,
                                    position: 'relative',
                                    pb: 1,
                                    userSelect: 'none',
                                    WebkitTapHighlightColor: 'transparent',
                                    transition: 'opacity 0.15s ease-out',
                                    '&:active': {
                                        opacity: 0.7
                                    }
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                        fontWeight: 400,
                                        lineHeight: 1.4,
                                        color: textColor,
                                        whiteSpace: 'nowrap',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    {breadcrumb.parent}
                                </Typography>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        width: 'fit-content',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                            fontWeight: isActive ? 500 : 400,
                                            lineHeight: 1.4,
                                            color: textColor,
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {breadcrumb.current}
                                    </Typography>
                                    {isActive && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: -8,
                                                left: 0,
                                                right: 0,
                                                height: '2px',
                                                backgroundColor: '#EAB308',
                                                borderRadius: '1px'
                                            }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Box>

            {/* Tabs Navigation - Desktop */}
            <Box className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 w-full hidden lg:block">
                <Box
                    className="w-full"
                    sx={{
                        maxWidth: {
                            lg: '1920px',
                            xl: '100%',
                            '2xl': '100%'
                        },
                        mx: 'auto',
                        px: { lg: 8, xl: 10, '2xl': 12 }
                    }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={(e, newValue) => setTabValue(newValue)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: { xs: '0.7rem', sm: '0.75rem', lg: '0.8125rem', xl: '0.875rem', '2xl': '0.9375rem' },
                                fontWeight: 500,
                                minHeight: { xs: '50px', sm: '55px', lg: '60px', xl: '65px', '2xl': '70px' },
                                minWidth: { xs: '100px', sm: '120px', lg: '140px', xl: '160px', '2xl': '180px' },
                                color: '#000',
                                paddingTop: { xs: '8px', sm: '10px', lg: '12px', xl: '14px', '2xl': '16px' },
                                paddingBottom: { xs: '8px', sm: '10px', lg: '12px', xl: '14px', '2xl': '16px' },
                                paddingLeft: { xs: '16px', sm: '24px', lg: '32px', xl: '40px', '2xl': '48px' },
                                paddingRight: { xs: '16px', sm: '24px', lg: '32px', xl: '40px', '2xl': '48px' },
                                marginRight: { xs: '20px', sm: '40px', lg: '60px', xl: '80px', '2xl': '100px' },
                                alignItems: 'flex-start',
                                textAlign: 'left',
                            },
                            '& .Mui-selected': {
                                color: '#000 !important',
                                fontWeight: 600,
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#EAB308',
                                height: { xs: '3px', lg: '3px', xl: '4px', '2xl': '4px' },
                            },
                        }}
                    >
                        <Tab
                            label={
                                <Box sx={{ lineHeight: { xs: '1.4', xl: '1.5', '2xl': '1.6' }, textAlign: 'left', width: '100%' }} className="text-black dark:text-white">
                                    <Box sx={{ mb: { xs: 0.5, xl: 0.75, '2xl': 1 }, fontSize: 'inherit' }}>Intakes PIMM list medical/</Box>
                                    <Box sx={{ fontSize: 'inherit' }}>PIMM intake form/intakes PIMM list</Box>
                                </Box>
                            }
                            sx={{
                                marginLeft: { xs: '30px !important', xl: '40px !important', '2xl': '50px !important' },
                            }}
                        />
                        <Tab
                            label={
                                <Box sx={{ lineHeight: { xs: '1.4', xl: '1.5', '2xl': '1.6' }, textAlign: 'left', width: '100%' }} className="text-black dark:text-white">
                                    <Box sx={{ mb: { xs: 0.5, xl: 0.75, '2xl': 1 }, fontSize: 'inherit' }}>Medical Offices/</Box>
                                    <Box sx={{ fontSize: 'inherit' }}>Specialist</Box>
                                </Box>
                            }
                            sx={{
                                marginLeft: { xs: '30px !important', xl: '40px !important', '2xl': '50px !important' },
                            }}
                        />
                        <Tab
                            label={
                                <Box sx={{ lineHeight: { xs: '1.4', xl: '1.5', '2xl': '1.6' }, textAlign: 'left', width: '100%' }} className="text-black dark:text-white">
                                    <Box sx={{ mb: { xs: 0.5, xl: 0.75, '2xl': 1 }, fontSize: 'inherit' }}>Calendar</Box>
                                    <Box sx={{ fontSize: 'inherit' }}></Box>
                                </Box>
                            }
                            sx={{
                                marginLeft: { xs: '30px !important', xl: '40px !important', '2xl': '50px !important' },
                            }}
                        />
                        <Tab
                            label={
                                <Box sx={{ lineHeight: { xs: '1.4', xl: '1.5', '2xl': '1.6' }, textAlign: 'left', width: '100%' }} className="text-black dark:text-white">
                                    <Box sx={{ mb: { xs: 0.5, xl: 0.75, '2xl': 1 }, fontSize: 'inherit' }}>Reminders</Box>
                                    <Box sx={{ fontSize: 'inherit' }}></Box>
                                </Box>
                            }
                            sx={{
                                marginLeft: { xs: '30px !important', xl: '40px !important', '2xl': '50px !important' },
                            }}
                        />
                        <Tab
                            label={
                                <Box sx={{ lineHeight: { xs: '1.4', xl: '1.5', '2xl': '1.6' }, textAlign: 'left', width: '100%' }} className="text-black dark:text-white">
                                    <Box sx={{ mb: { xs: 0.5, xl: 0.75, '2xl': 1 }, fontSize: 'inherit' }}>Handling lawyers</Box>
                                    <Box sx={{ fontSize: 'inherit' }}>management /H</Box>
                                </Box>
                            }
                            sx={{
                                marginLeft: { xs: '30px !important', xl: '40px !important', '2xl': '50px !important' },
                            }}
                        />
                    </Tabs>
                </Box>
            </Box>

            {/* Main Content */}
            <Container maxWidth={false} className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
                {tabValue === 0 && <IntakesPimmListTab />}
                {tabValue === 1 && <MedicalOfficesTab />}
                {tabValue === 2 && <CalendarTab />}
                {tabValue === 3 && <RemindersTab />}
                {tabValue === 4 && <HandlingLawyersTab />}
            </Container>
        </Box >
    );
}
