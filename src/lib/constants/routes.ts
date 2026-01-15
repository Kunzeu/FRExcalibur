export const PUBLIC_ROUTES = [
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
    '/accident-form',
    '/medical-offices',
    '/l2l',
    '/pi-intake',
];

export const AUTH_ROUTES = [
    '/login',
    '/register',
];

export const PROTECTED_ROUTES = [
    '/dashboard',
    '/profile',
    // Any route not in PUBLIC_ROUTES is implicitly protected by middleware
];
