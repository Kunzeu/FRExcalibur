'use client';

import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Drawer } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Dashboard as DashboardIcon,
    Description as IntakeIcon,
    LocalHospital as MedicalIcon,
    Business as BusinessIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTheme } from '@/lib/contexts/theme-context';

const MENU_ITEMS = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { label: 'PI Intake', path: '/pi-intake', icon: <IntakeIcon /> },
    { label: 'L2L', path: '/l2l', icon: <BusinessIcon /> },
    { label: 'Medical Offices', path: '/medical-offices', icon: <MedicalIcon /> },
];

interface SidebarProps {
    mobileOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    const drawerContent = (
        <>
            {/* Logo Area */}
            <Box className="p-6 flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
                <Typography variant="h5" className="font-bold tracking-widest" sx={{ color: '#EAB308' }}>
                    EXCALIBUR
                </Typography>
            </Box>

            {/* Navigation Menu */}
            <Box className="flex-1 overflow-y-auto py-6 px-4">
                <List component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.path;

                        return (
                            <ListItem key={item.path} disablePadding>
                                <ListItemButton
                                    component={Link}
                                    href={item.path}
                                    selected={isActive}
                                    onClick={onClose} // Close drawer on mobile click if applicable
                                    sx={{
                                        borderRadius: '12px',
                                        mb: 1,
                                        py: 1.5,
                                        color: isActive
                                            ? '#EAB308'
                                            : isDark ? '#9CA3AF' : '#4B5563',
                                        backgroundColor: isActive
                                            ? (isDark ? 'rgba(234, 179, 8, 0.1)' : 'rgba(234, 179, 8, 0.05)')
                                            : 'transparent',
                                        '&:hover': {
                                            backgroundColor: isActive
                                                ? (isDark ? 'rgba(234, 179, 8, 0.15)' : 'rgba(234, 179, 8, 0.1)')
                                                : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'),
                                            color: isActive ? '#EAB308' : (isDark ? '#FFFFFF' : '#000000'),
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'inherit',
                                            minWidth: '40px'
                                        }
                                    }}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 700 : 500,
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* Footer / Settings link */}
            <Box className="p-4 border-t border-gray-100 dark:border-gray-800">
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            sx={{
                                borderRadius: '12px',
                                color: isDark ? '#9CA3AF' : '#4B5563',
                                '&:hover': {
                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                                    color: isDark ? '#FFFFFF' : '#000000',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { lg: 280 }, flexShrink: { lg: 0 } }}
        >
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 280,
                        backgroundColor: isDark ? '#000000' : '#FFFFFF',
                        borderRight: isDark ? '1px solid #1F2937' : '1px solid #F3F4F6'
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop Persistent Sidebar */}
            <Box
                className="hidden lg:flex flex-col h-screen sticky top-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-black transition-colors duration-300"
                sx={{
                    width: '280px',
                    flexShrink: 0,
                    zIndex: 50,
                    display: { xs: 'none', lg: 'flex' }
                }}
            >
                {drawerContent}
            </Box>
        </Box>
    );
}
