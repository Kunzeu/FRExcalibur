import { NextRequest, NextResponse } from 'next/server';
import { CognitoAuthService } from '@/lib/services/cognito.service';
import { registerSchema } from '@/lib/validations/auth';

/**
 * POST /api/auth/register
 * Registers a new user
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input data
        const validation = registerSchema.safeParse(body);

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

        const { email, password, name } = validation.data;

        // Mock Registration for Demo
        if (email.endsWith('@demo.com')) {
            return NextResponse.json({
                success: true,
                data: {
                    message: 'Mock User registered. Please verify your email (use code 123456).',
                    userSub: 'mock-user-sub',
                },
            });
        }

        // Register user in Cognito
        const result = await CognitoAuthService.signUp(email, password, name);

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
                message: 'User registered. Please verify your email.',
                userSub: result.data?.userSub,
            },
        });
    } catch (error: any) {
        console.error('Registration error:', error);
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
