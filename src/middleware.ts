import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ServerAuthService } from '@/lib/services/server-auth.service';
import { PUBLIC_ROUTES, AUTH_ROUTES } from '@/lib/constants/routes';

// Rutas públicas
const publicRoutes = PUBLIC_ROUTES;

// Rutas de auth (redirigir si ya está logueado)
const authRoutes = AUTH_ROUTES;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow auth API routes (login, register, refresh, etc.)
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    // Allow public assets
    if (pathname.includes('/_next') || pathname.includes('/favicon.ico') || pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)) {
        return NextResponse.next();
    }

    // Check authentication using our JWT system
    const isAuthenticated = await ServerAuthService.isAuthenticated();

    // Si ya está logueado y va a login/register, redirigir a home
    if (authRoutes.includes(pathname) && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Si no está logueado y va a ruta protegida (no pública), redirigir a login
    // Check if path is exactly in publicRoutes or effectively public
    const isPublic = publicRoutes.some(route => pathname.startsWith(route));

    if (!isPublic && !isAuthenticated) {
        // Redirect to login page
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // Headers de seguridad
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
