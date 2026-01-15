import { NextRequest, NextResponse } from 'next/server';
import { ServerAuthService } from '@/lib/services/server-auth.service';

/**
 * POST /api/auth/logout
 * Sign out user
 */
export async function POST(request: NextRequest) {
    try {
        await ServerAuthService.signOut();

        return NextResponse.json({
            success: true,
            data: {
                message: 'Successfully logged out',
            },
        });
    } catch (error: any) {
        console.error('Logout error:', error);

        // Even if there is an error, clear local cookies
        await ServerAuthService.clearAuthCookies();

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Error logging out',
                },
            },
            { status: 500 }
        );
    }
}
