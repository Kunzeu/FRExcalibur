import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    SignUpCommand,
    ConfirmSignUpCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand,
    ChangePasswordCommand,
    GetUserCommand,
    GlobalSignOutCommand,
    ResendConfirmationCodeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoConfig } from '@/lib/config';
import type {
    AuthTokens,
    User,
    CognitoUserAttributes,
    AuthResponse,
    SignInResult,
} from '@/lib/types/auth';

/**
 * Configured AWS Cognito Client
 */
const cognitoClient = new CognitoIdentityProviderClient({
    region: cognitoConfig.region,
});

/**
 * AWS Cognito Authentication Service
 * Implements all authentication operations securely
 */
export class CognitoAuthService {
    /**
     * Sign in with email and password
     */
    /**
     * Sign in with email and password
     */
    static async signIn(
        email: string,
        password: string
    ): Promise<AuthResponse<SignInResult>> {
        try {
            const command = new InitiateAuthCommand({
                AuthFlow: 'USER_PASSWORD_AUTH',
                ClientId: cognitoConfig.clientId,
                AuthParameters: {
                    USERNAME: email,
                    PASSWORD: password,
                },
            });

            const response = await cognitoClient.send(command);

            // Handle NEW_PASSWORD_REQUIRED and other challenges
            if (response.ChallengeName) {
                return {
                    success: true,
                    data: {
                        challengeName: response.ChallengeName,
                        session: response.Session!,
                        challengeParameters: response.ChallengeParameters,
                    },
                };
            }

            if (!response.AuthenticationResult) {
                return {
                    success: false,
                    error: {
                        code: 'AUTH_FAILED',
                        message: 'Authentication error',
                        name: 'AuthenticationError',
                    },
                };
            }

            const tokens: AuthTokens = {
                accessToken: response.AuthenticationResult.AccessToken!,
                refreshToken: response.AuthenticationResult.RefreshToken!,
                idToken: response.AuthenticationResult.IdToken!,
                expiresIn: response.AuthenticationResult.ExpiresIn || 3600,
            };

            return {
                success: true,
                data: tokens,
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    code: error.name || 'UNKNOWN_ERROR',
                    message: this.getErrorMessage(error),
                    name: error.name || 'Error',
                },
            };
        }
    }

    /**
     * Registers a new user
     */
    static async signUp(
        email: string,
        password: string,
        name: string
    ): Promise<AuthResponse<{ userSub: string }>> {
        try {
            const command = new SignUpCommand({
                ClientId: cognitoConfig.clientId,
                Username: email,
                Password: password,
                UserAttributes: [
                    {
                        Name: 'email',
                        Value: email,
                    },
                    {
                        Name: 'name',
                        Value: name,
                    },
                ],
            });

            const response = await cognitoClient.send(command);

            return {
                success: true,
                data: {
                    userSub: response.UserSub!,
                },
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    code: error.name || 'UNKNOWN_ERROR',
                    message: this.getErrorMessage(error),
                    name: error.name || 'Error',
                },
            };
        }
    }

    /**
     * Confirms email with sent code
     */
    static async confirmSignUp(
        email: string,
        code: string
    ): Promise<AuthResponse<void>> {
        try {
            const command = new ConfirmSignUpCommand({
                ClientId: cognitoConfig.clientId,
                Username: email,
                ConfirmationCode: code,
            });

            await cognitoClient.send(command);

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    code: error.name || 'UNKNOWN_ERROR',
                    message: this.getErrorMessage(error),
                    name: error.name || 'Error',
                },
            };
        }
    }

    /**
     * Resends confirmation code
     */
    static async resendConfirmationCode(
        email: string
    ): Promise<AuthResponse<void>> {
        try {
            const command = new ResendConfirmationCodeCommand({
                ClientId: cognitoConfig.clientId,
                Username: email,
            });

            await cognitoClient.send(command);

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    code: error.name || 'UNKNOWN_ERROR',
                    message: this.getErrorMessage(error),
                    name: error.name || 'Error',
                },
            };
        }
    }

    /**
     * Initiates password recovery process
     */
    static async forgotPassword(email: string): Promise<AuthResponse<void>> {
        try {
            const command = new ForgotPasswordCommand({
                ClientId: cognitoConfig.clientId,
                Username: email,
            });

            await cognitoClient.send(command);

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    code: error.name || 'UNKNOWN_ERROR',
                    message: this.getErrorMessage(error),
                    name: error.name || 'Error',
                },
            };
        }
    }

    /**
     * Confirms password change with code
     */
    static async confirmForgotPassword(
        email: string,
        code: string,
        newPassword: string
    ): Promise<AuthResponse<void>> {
        try {
            const command = new ConfirmForgotPasswordCommand({
                ClientId: cognitoConfig.clientId,
                Username: email,
                ConfirmationCode: code,
                Password: newPassword,
            });

            await cognitoClient.send(command);

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    code: error.name || 'UNKNOWN_ERROR',
                    message: this.getErrorMessage(error),
                    name: error.name || 'Error',
                },
            };
        }
    }

    /**
     * Changes authenticated user password
     */
    static async changePassword(
        accessToken: string,
        oldPassword: string,
        newPassword: string
    ): Promise<AuthResponse<void>> {
        try {
            const command = new ChangePasswordCommand({
                AccessToken: accessToken,
                PreviousPassword: oldPassword,
                ProposedPassword: newPassword,
            });

            await cognitoClient.send(command);

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    code: error.name || 'UNKNOWN_ERROR',
                    message: this.getErrorMessage(error),
                    name: error.name || 'Error',
                },
            };
        }
    }

    /**
     * Gets authenticated user information
     */
    static async getUser(accessToken: string): Promise<AuthResponse<User>> {
        try {
            const command = new GetUserCommand({
                AccessToken: accessToken,
            });

            const response = await cognitoClient.send(command);

            const attributes: CognitoUserAttributes = {
                sub: '',
                email: '',
                email_verified: false,
            };

            response.UserAttributes?.forEach((attr) => {
                if (attr.Name && attr.Value) {
                    if (attr.Name === 'email_verified') {
                        attributes[attr.Name] = attr.Value === 'true';
                    } else {
                        attributes[attr.Name] = attr.Value;
                    }
                }
            });

            const user: User = {
                id: attributes.sub,
                email: attributes.email,
                name: attributes.name || attributes.email.split('@')[0],
                emailVerified: attributes.email_verified as boolean,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                attributes: attributes as Record<string, string>,
            };

            return {
                success: true,
                data: user,
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    code: error.name || 'UNKNOWN_ERROR',
                    message: this.getErrorMessage(error),
                    name: error.name || 'Error',
                },
            };
        }
    }

    /**
     * Refreshes access token using refresh token
     */
    static async refreshToken(
        refreshToken: string
    ): Promise<AuthResponse<Omit<AuthTokens, 'refreshToken'>>> {
        try {
            const command = new InitiateAuthCommand({
                AuthFlow: 'REFRESH_TOKEN_AUTH',
                ClientId: cognitoConfig.clientId,
                AuthParameters: {
                    REFRESH_TOKEN: refreshToken,
                },
            });

            const response = await cognitoClient.send(command);

            if (!response.AuthenticationResult) {
                return {
                    success: false,
                    error: {
                        code: 'REFRESH_FAILED',
                        message: 'Error refreshing token',
                        name: 'RefreshError',
                    },
                };
            }

            const tokens = {
                accessToken: response.AuthenticationResult.AccessToken!,
                idToken: response.AuthenticationResult.IdToken!,
                expiresIn: response.AuthenticationResult.ExpiresIn || 3600,
            };

            return {
                success: true,
                data: tokens,
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    code: error.name || 'UNKNOWN_ERROR',
                    message: this.getErrorMessage(error),
                    name: error.name || 'Error',
                },
            };
        }
    }

    /**
     * Globally signs out (invalidates all tokens)
     */
    static async signOut(accessToken: string): Promise<AuthResponse<void>> {
        try {
            const command = new GlobalSignOutCommand({
                AccessToken: accessToken,
            });

            await cognitoClient.send(command);

            return {
                success: true,
            };
        } catch (error: any) {
            return {
                success: false,
                error: {
                    code: error.name || 'UNKNOWN_ERROR',
                    message: this.getErrorMessage(error),
                    name: error.name || 'Error',
                },
            };
        }
    }

    /**
     * Converts Cognito errors to friendly messages
     */
    private static getErrorMessage(error: any): string {
        const errorMessages: Record<string, string> = {
            UserNotFoundException: 'User not found',
            NotAuthorizedException: 'Invalid credentials',
            UserNotConfirmedException: 'Email not confirmed',
            CodeMismatchException: 'Invalid code',
            ExpiredCodeException: 'Code expired',
            InvalidPasswordException: 'Invalid password',
            UsernameExistsException: 'Email is already registered',
            InvalidParameterException: 'Invalid parameters',
            TooManyRequestsException: 'Too many attempts, try again later',
            LimitExceededException: 'Limit exceeded, try again later',
            TooManyFailedAttemptsException: 'Too many failed attempts',
        };

        return errorMessages[error.name] || error.message || 'Unknown error';
    }
}
