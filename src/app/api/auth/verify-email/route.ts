import { NextRequest, NextResponse } from 'next/server';
import { CognitoAuthService } from '@/lib/services/cognito.service';
import { verifyEmailSchema } from '@/lib/validations/auth';

/**
 * POST /api/auth/verify-email
 * Verifies email with sent code
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input data
        const validation = verifyEmailSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid data',
                        details: validation.error.errors,
                    },
                },
                { status: 400 }
            );
        }

        const { email, code } = validation.data;

        // Mock Verification for Demo
        if (email.endsWith('@demo.com') && code === '123456') {
            return NextResponse.json({
                success: true,
                data: {
                    message: 'Email verified successfully (Mock)',
                },
            });
        }

        // Confirm email in Cognito
        const result = await CognitoAuthService.confirmSignUp(email, code);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error,
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                message: 'Email verified successfully',
            },
        });
    } catch (error: any) {
        console.error('Error verifying email:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Internal server error',
                },
            },
            { status: 500 }
        );
    }
}
