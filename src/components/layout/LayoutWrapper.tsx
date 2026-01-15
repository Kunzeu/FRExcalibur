'use client';

import { usePathname } from 'next/navigation';
import MainLayout from './MainLayout';

const NO_LAYOUT_ROUTES = [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if current route demands no layout (auth pages)
    const isNoLayoutRoute = NO_LAYOUT_ROUTES.some(route => pathname.startsWith(route));

    if (isNoLayoutRoute) {
        return <>{children}</>;
    }

    return <MainLayout>{children}</MainLayout>;
}
