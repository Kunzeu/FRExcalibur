'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store/useAppStore';

export function RouteTracker() {
    const pathname = usePathname();
    const setLastVisitedRoute = useAppStore((state) => state.setLastVisitedRoute);

    useEffect(() => {
        if (pathname) {
            setLastVisitedRoute(pathname);
        }
    }, [pathname, setLastVisitedRoute]);

    return null;
}
