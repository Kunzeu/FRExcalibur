import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, extractUserFromPayload } from '@/lib/services/jwt.service';
import { cookies } from 'next/headers';
import { getCookieName } from '@/lib/utils/cookies';
import type { User } from '@/lib/types/auth';

/**
 * Middleware to verify JWT access token
 * Returns the authenticated user or null
 */
export async function verifyAuth(request: NextRequest): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get(getCookieName('ACCESS_TOKEN'))?.value;

        if (!accessToken) {
            return null;
        }

        // Mock bypass for demo accounts
        if (accessToken === 'mock-access-token') {
            const userInfo = cookieStore.get(getCookieName('USER_INFO'))?.value;
            if (userInfo) {
                try {
                    const user = JSON.parse(userInfo);
                    return {
                        ...user,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        attributes: {},
                    };
                } catch {
                    return null;
                }
            }
            return null;
        }

        // Verify JWT token
        const payload = await verifyAccessToken(accessToken);
        if (!payload) {
            return null;
        }

        // Extract user from payload
        return extractUserFromPayload(payload);
    } catch (error) {
        console.error('Error verifying auth:', error);
        return null;
    }
}

/**
 * Middleware wrapper for protected API routes
 * Returns 401 if not authenticated
 */
export async function requireAuth(
    request: NextRequest,
    handler: (request: NextRequest, user: User) => Promise<NextResponse>
): Promise<NextResponse> {
    const user = await verifyAuth(request);

    if (!user) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                    name: 'UnauthorizedError',
                },
            },
            { status: 401 }
        );
    }

    return handler(request, user);
}

