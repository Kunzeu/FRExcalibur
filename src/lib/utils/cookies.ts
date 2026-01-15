import { cookieConfig, COOKIE_NAMES } from '@/lib/config';

interface CookieOptions {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
    domain?: string;
    expires?: Date;
}

const getBaseCookieOptions = (maxAge?: number): CookieOptions => {
    const options: CookieOptions = {
        httpOnly: true,
        secure: cookieConfig.secure,
        sameSite: 'strict',
        path: '/',
        maxAge: maxAge || cookieConfig.accessTokenDuration,
    };

    // En desarrollo podemos usar domain, en producción __Host- no lo permite
    if (!cookieConfig.secure) {
        options.domain = cookieConfig.domain;
    }

    return options;
};

export const getAccessTokenCookieOptions = (): CookieOptions => {
    return getBaseCookieOptions(cookieConfig.accessTokenDuration);
};

export const getRefreshTokenCookieOptions = (): CookieOptions => {
    return getBaseCookieOptions(cookieConfig.refreshTokenDuration);
};

export const getUserInfoCookieOptions = (): CookieOptions => {
    return getBaseCookieOptions(cookieConfig.accessTokenDuration);
};

export const getDeleteCookieOptions = (): CookieOptions => {
    return {
        ...getBaseCookieOptions(0),
        maxAge: 0,
        expires: new Date(0),
    };
};

// Serializa info del usuario para guardar en cookie
export const serializeUserData = (user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
}): string => {
    return JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
    });
};

export const deserializeUserData = (data: string): {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
} | null => {
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
};

export const isValidCookieValue = (value: string | undefined): boolean => {
    if (!value || value.trim() === '') {
        return false;
    }
    return true;
};

export const getCookieName = (baseName: keyof typeof COOKIE_NAMES): string => {
    return COOKIE_NAMES[baseName];
};
