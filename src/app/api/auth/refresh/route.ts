import { NextRequest, NextResponse } from 'next/server';
import { ServerAuthService } from '@/lib/services/server-auth.service';

/**
 * POST /api/auth/refresh
 * Refreshes access token using refresh token
 */
export async function POST(request: NextRequest) {
    try {
        const success = await ServerAuthService.refreshAccessToken();

        if (!success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'REFRESH_FAILED',
                        message: 'Could not refresh token',
                    },
                },
                { status: 401 }
            );
        }

        // Get updated session
        const session = await ServerAuthService.getSession();

        return NextResponse.json({
            success: true,
            data: session,
        });
    } catch (error: any) {
        console.error('Error refreshing token:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Error refreshing token',
                },
            },
            { status: 500 }
        );
    }
}
