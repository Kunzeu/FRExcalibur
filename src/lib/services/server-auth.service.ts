import { cookies } from 'next/headers';
import { CognitoAuthService } from '@/lib/services/cognito.service';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    extractUserFromPayload,
} from '@/lib/services/jwt.service';
import {
    storeRefreshToken,
    verifyRefreshToken as verifyStoredRefreshToken,
    revokeRefreshToken,
    revokeAllUserTokens,
} from '@/lib/services/refresh-token.service';
import {
    getAccessTokenCookieOptions,
    getRefreshTokenCookieOptions,
    getUserInfoCookieOptions,
    getDeleteCookieOptions,
    serializeUserData,
    deserializeUserData,
    getCookieName,
} from '@/lib/utils/cookies';
import { cookieConfig } from '@/lib/config';
import type { User, AuthSession } from '@/lib/types/auth';

// Server-side authentication handling
export class ServerAuthService {
    /**
     * Save JWT tokens in httpOnly cookies
     * This method generates our own JWT tokens after Cognito authentication
     */
    static async setAuthCookies(
        cognitoAccessToken: string,
        cognitoRefreshToken: string,
        cognitoIdToken: string,
        user?: User
    ): Promise<void> {
        const cookieStore = await cookies();

        // Get user data from Cognito if not provided
        let userData: User;
        if (user) {
            userData = user;
        } else {
            const userResponse = await CognitoAuthService.getUser(cognitoAccessToken);
            if (!userResponse.success || !userResponse.data) {
                throw new Error('Could not get user information');
            }
            userData = userResponse.data;
        }

        // Generate our own JWT tokens
        const jwtAccessToken = await generateAccessToken(userData);
        const jwtRefreshToken = await generateRefreshToken(userData);

        // Store refresh token in our service
        storeRefreshToken(
            userData.id,
            jwtRefreshToken,
            cookieConfig.refreshTokenDuration
        );

        // Save JWT tokens in cookies (not Cognito tokens)
        cookieStore.set(
            getCookieName('ACCESS_TOKEN'),
            jwtAccessToken,
            getAccessTokenCookieOptions()
        );

        cookieStore.set(
            getCookieName('REFRESH_TOKEN'),
            jwtRefreshToken,
            getRefreshTokenCookieOptions()
        );

        cookieStore.set(
            getCookieName('USER_INFO'),
            serializeUserData(userData),
            getUserInfoCookieOptions()
        );
    }

    static async clearAuthCookies(): Promise<void> {
        const cookieStore = await cookies();
        const deleteOptions = getDeleteCookieOptions();

        // Revoke refresh token before clearing cookies
        const refreshToken = await this.getRefreshToken();
        if (refreshToken) {
            revokeRefreshToken(refreshToken);
        }

        cookieStore.set(getCookieName('ACCESS_TOKEN'), '', deleteOptions);
        cookieStore.set(getCookieName('REFRESH_TOKEN'), '', deleteOptions);
        cookieStore.set(getCookieName('USER_INFO'), '', deleteOptions);
    }

    static async getAccessToken(): Promise<string | null> {
        const cookieStore = await cookies();
        const token = cookieStore.get(getCookieName('ACCESS_TOKEN'));
        return token?.value || null;
    }

    static async getRefreshToken(): Promise<string | null> {
        const cookieStore = await cookies();
        const token = cookieStore.get(getCookieName('REFRESH_TOKEN'));
        return token?.value || null;
    }

    static async getUserInfo(): Promise<User | null> {
        const cookieStore = await cookies();
        const userInfo = cookieStore.get(getCookieName('USER_INFO'));

        if (!userInfo?.value) return null;

        const userData = deserializeUserData(userInfo.value);
        if (!userData) return null;

        return {
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    }

    /**
     * Get session using JWT tokens
     * Automatically refreshes access token if expired
     */
    static async getSession(): Promise<AuthSession | null> {
        try {
            const accessToken = await this.getAccessToken();
            const refreshToken = await this.getRefreshToken();

            // Mock Bypass for demo accounts
            if (accessToken === 'mock-access-token' || refreshToken === 'mock-refresh-token') {
                const userInfo = await this.getUserInfo();
                if (userInfo) {
                    return {
                        user: userInfo,
                        isAuthenticated: true,
                        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
                    };
                }
            }

            // Verify access token
            if (accessToken) {
                const payload = await verifyAccessToken(accessToken);
                if (payload) {
                    // Token is valid, extract user data
                    const user = extractUserFromPayload(payload);
                    return {
                        user,
                        isAuthenticated: true,
                        expiresAt: (payload.exp || 0) * 1000,
                    };
                }
            }

            // Access token is invalid or expired, try to refresh
            if (refreshToken) {
                const refreshPayload = await verifyRefreshToken(refreshToken);
                if (refreshPayload) {
                    // Verify refresh token is stored in our service
                    const storedToken = verifyStoredRefreshToken(refreshToken);
                    if (storedToken) {
                        // Generate new access token
                        const user = extractUserFromPayload(refreshPayload);
                        const newAccessToken = await generateAccessToken(user);

                        // Save new access token
                        const cookieStore = await cookies();
                        cookieStore.set(
                            getCookieName('ACCESS_TOKEN'),
                            newAccessToken,
                            getAccessTokenCookieOptions()
                        );

                        return {
                            user,
                            isAuthenticated: true,
                            expiresAt: Date.now() + cookieConfig.accessTokenDuration * 1000,
                        };
                    }
                }
            }

            // No valid tokens, clear cookies
            await this.clearAuthCookies();
            return null;
        } catch (error) {
            console.error('Error getting session:', error);
            await this.clearAuthCookies();
            return null;
        }
    }

    static async isAuthenticated(): Promise<boolean> {
        const session = await this.getSession();
        return session?.isAuthenticated || false;
    }

    /**
     * Refresh access token using JWT refresh token
     */
    static async refreshAccessToken(): Promise<boolean> {
        try {
            const refreshToken = await this.getRefreshToken();
            if (!refreshToken) return false;

            // Mock bypass
            if (refreshToken === 'mock-refresh-token') return true;

            // Verify JWT refresh token
            const refreshPayload = await verifyRefreshToken(refreshToken);
            if (!refreshPayload) {
                await this.clearAuthCookies();
                return false;
            }

            // Verify refresh token is stored in our service
            const storedToken = verifyStoredRefreshToken(refreshToken);
            if (!storedToken) {
                await this.clearAuthCookies();
                return false;
            }

            // Generate new access token
            const user = extractUserFromPayload(refreshPayload);
            const newAccessToken = await generateAccessToken(user);

            // Save new access token
            const cookieStore = await cookies();
            cookieStore.set(
                getCookieName('ACCESS_TOKEN'),
                newAccessToken,
                getAccessTokenCookieOptions()
            );

            return true;
        } catch (error) {
            console.error('Error refreshing token:', error);
            await this.clearAuthCookies();
            return false;
        }
    }

    /**
     * Sign out user
     * Revokes refresh tokens and clears cookies
     */
    static async signOut(): Promise<void> {
        try {
            const refreshToken = await this.getRefreshToken();
            if (refreshToken && refreshToken !== 'mock-refresh-token') {
                // Revoke refresh token
                revokeRefreshToken(refreshToken);

                // Optionally, sign out from Cognito if we have the Cognito access token stored
                // For now, we only revoke our JWT tokens
            }
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            await this.clearAuthCookies();
        }
    }
}
