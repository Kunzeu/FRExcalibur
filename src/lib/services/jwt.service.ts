import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookieConfig } from '@/lib/config';
import type { User } from '@/lib/types/auth';

/**
 * JWT Service
 * Handles generation and verification of JWT tokens
 * Uses jose library for secure token operations
 */

// Get JWT secret from environment or use cookie secret as fallback
const getJWTSecret = (): Uint8Array => {
    const secret = process.env.JWT_SECRET || cookieConfig.secret;
    if (secret.length < 32) {
        throw new Error('JWT_SECRET must be at least 32 characters long');
    }
    return new TextEncoder().encode(secret);
};

const JWT_SECRET = getJWTSecret();

// Token expiration times (in seconds)
const ACCESS_TOKEN_EXPIRES_IN = cookieConfig.accessTokenDuration; // 15 minutes default
const REFRESH_TOKEN_EXPIRES_IN = cookieConfig.refreshTokenDuration; // 30 days default

export interface JWTPayloadData extends JWTPayload {
    userId: string;
    email: string;
    name: string;
    emailVerified: boolean;
    type: 'access' | 'refresh';
}

/**
 * Generate access token (short-lived)
 */
export async function generateAccessToken(user: User): Promise<string> {
    const payload: JWTPayloadData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        type: 'access',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRES_IN,
    };

    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${ACCESS_TOKEN_EXPIRES_IN}s`)
        .sign(JWT_SECRET);

    return token;
}

/**
 * Generate refresh token (long-lived)
 */
export async function generateRefreshToken(user: User): Promise<string> {
    const payload: JWTPayloadData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        type: 'refresh',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRES_IN,
    };

    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(`${REFRESH_TOKEN_EXPIRES_IN}s`)
        .sign(JWT_SECRET);

    return token;
}

/**
 * Verify and decode JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayloadData | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as JWTPayloadData;
    } catch (error) {
        // Token is invalid, expired, or malformed
        return null;
    }
}

/**
 * Verify access token specifically
 */
export async function verifyAccessToken(token: string): Promise<JWTPayloadData | null> {
    const payload = await verifyToken(token);
    if (!payload || payload.type !== 'access') {
        return null;
    }
    return payload;
}

/**
 * Verify refresh token specifically
 */
export async function verifyRefreshToken(token: string): Promise<JWTPayloadData | null> {
    const payload = await verifyToken(token);
    if (!payload || payload.type !== 'refresh') {
        return null;
    }
    return payload;
}

/**
 * Extract user data from JWT payload
 */
export function extractUserFromPayload(payload: JWTPayloadData): User {
    return {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        emailVerified: payload.emailVerified,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attributes: {},
    };
}

