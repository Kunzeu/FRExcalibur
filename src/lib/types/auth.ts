/**
 * Authentication and user data types
 */

export interface User {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    attributes?: Record<string, string>;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    idToken: string;
    expiresIn: number;
}

export interface AuthChallenge {
    challengeName: string;
    session: string;
    challengeParameters?: Record<string, string>;
}

export type SignInResult = AuthTokens | AuthChallenge;

export interface AuthSession {
    user: User;
    isAuthenticated: boolean;
    expiresAt: number;
}

export interface CognitoUserAttributes {
    sub: string;
    email: string;
    email_verified: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    phone_number?: string;
    [key: string]: string | boolean | undefined;
}

export interface AuthError {
    code: string;
    message: string;
    name: string;
}

export interface AuthResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: AuthError;
}

// Types for Cognito responses
export interface CognitoSignInResponse {
    AccessToken: string;
    RefreshToken: string;
    IdToken: string;
    ExpiresIn: number;
}

export interface CognitoRefreshResponse {
    AccessToken: string;
    IdToken: string;
    ExpiresIn: number;
}
