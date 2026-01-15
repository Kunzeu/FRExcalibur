/**
 * Refresh Token Service
 * Manages refresh tokens in memory (can be migrated to database later)
 * 
 * In production, this should be stored in a database with:
 * - userId
 * - token hash
 * - expiresAt
 * - createdAt
 * - device/browser info (optional)
 */

interface RefreshTokenRecord {
    userId: string;
    token: string;
    expiresAt: number;
    createdAt: number;
}

// In-memory storage for refresh tokens
// In production, this should be replaced with a database
const refreshTokenStore = new Map<string, RefreshTokenRecord>();

/**
 * Store a refresh token
 */
export function storeRefreshToken(
    userId: string,
    token: string,
    expiresIn: number
): void {
    const expiresAt = Date.now() + expiresIn * 1000;
    refreshTokenStore.set(token, {
        userId,
        token,
        expiresAt,
        createdAt: Date.now(),
    });
}

/**
 * Verify if a refresh token exists and is valid
 */
export function verifyRefreshToken(token: string): RefreshTokenRecord | null {
    const record = refreshTokenStore.get(token);
    
    if (!record) {
        return null;
    }

    // Check if token has expired
    if (Date.now() > record.expiresAt) {
        refreshTokenStore.delete(token);
        return null;
    }

    return record;
}

/**
 * Revoke a refresh token (logout)
 */
export function revokeRefreshToken(token: string): void {
    refreshTokenStore.delete(token);
}

/**
 * Revoke all refresh tokens for a user
 */
export function revokeAllUserTokens(userId: string): void {
    for (const [token, record] of refreshTokenStore.entries()) {
        if (record.userId === userId) {
            refreshTokenStore.delete(token);
        }
    }
}

/**
 * Clean up expired tokens (should be called periodically)
 */
export function cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, record] of refreshTokenStore.entries()) {
        if (now > record.expiresAt) {
            refreshTokenStore.delete(token);
        }
    }
}

/**
 * Get all active tokens for a user (for admin/debugging)
 */
export function getUserTokens(userId: string): RefreshTokenRecord[] {
    return Array.from(refreshTokenStore.values()).filter(
        (record) => record.userId === userId && Date.now() <= record.expiresAt
    );
}

// Clean up expired tokens every hour
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        cleanupExpiredTokens();
    }, 60 * 60 * 1000); // 1 hour
}

