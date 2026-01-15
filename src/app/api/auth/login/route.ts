import { NextRequest, NextResponse } from 'next/server';
import { CognitoAuthService } from '@/lib/services/cognito.service';
import { ServerAuthService } from '@/lib/services/server-auth.service';
import { loginSchema } from '@/lib/validations/auth';
import { isCognitoConfigured } from '@/lib/config';

/**
 * POST /api/auth/login
 * Authenticates user with email and password
 */
export async function POST(request: NextRequest) {
    try {
        // Check if Cognito is configured
        if (!isCognitoConfigured()) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'COGNITO_NOT_CONFIGURED',
                        message: 'AWS Cognito is not configured',
                        name: 'ConfigurationError',
                    },
                },
                { status: 500 }
            );
        }

        const body = await request.json();

        // Validate input data
        const validation = loginSchema.safeParse(body);

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

        const { email, password } = validation.data;

        // Mock Login for Demo
        if (email.endsWith('@demo.com')) {
            await ServerAuthService.setAuthCookies(
                'mock-access-token',
                'mock-refresh-token',
                'mock-id-token',
                {
                    id: 'mock-user-id',
                    email: email,
                    name: email.split('@')[0],
                    emailVerified: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    attributes: {},
                }
            );

            return NextResponse.json({
                success: true,
                data: {
                    message: 'Mock login successful',
                },
            });
        }

        // Sign in with Cognito
        const result = await CognitoAuthService.signIn(email, password);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error,
                },
                { status: 401 }
            );
        }

        // Handle challenges (e.g., NEW_PASSWORD_REQUIRED)
        if (result.data && 'challengeName' in result.data) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'CHALLENGE_REQUIRED',
                        message: 'Password change required',
                        name: 'ChallengeError',
                    },
                    challenge: {
                        name: result.data.challengeName,
                        session: result.data.session,
                        parameters: result.data.challengeParameters,
                    },
                },
                { status: 200 }
            );
        }

        // Login successful - save tokens in cookies
        if (result.data && 'accessToken' in result.data) {
            await ServerAuthService.setAuthCookies(
                result.data.accessToken,
                result.data.refreshToken,
                result.data.idToken
            );

            return NextResponse.json({
                success: true,
                data: {
                    message: 'Login successful',
                },
            });
        }

        // Unexpected response format
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'UNEXPECTED_ERROR',
                    message: 'Unexpected authentication response',
                    name: 'AuthenticationError',
                },
            },
            { status: 500 }
        );
    } catch (error: any) {
        console.error('Login error:', error);
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

