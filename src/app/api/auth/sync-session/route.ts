import { NextRequest, NextResponse } from 'next/server';
import { ServerAuthService } from '@/lib/services/server-auth.service';
import { z } from 'zod';

const syncSessionSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    idToken: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = syncSessionSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Invalid tokens' },
                { status: 400 }
            );
        }

        const { accessToken, refreshToken, idToken } = validation.data;

        // Verify tokens by fetching user info from Cognito (implicit validation in setAuthCookies)
        await ServerAuthService.setAuthCookies(
            accessToken,
            refreshToken,
            idToken
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Session sync error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to sync session' },
            { status: 401 }
        );
    }
}
