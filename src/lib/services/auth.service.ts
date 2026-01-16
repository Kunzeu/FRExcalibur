import axiosInstance from '@/lib/axios';
import axios from 'axios';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ResetPasswordRequest,
    ConfirmEmailRequest,
    UserResponse
} from '@/lib/types/intake-api';

// Base URL para la API v2
const getApiV2Config = () => {
    if (process.env.NEXT_PUBLIC_API_V2_URL) {
        const url = process.env.NEXT_PUBLIC_API_V2_URL;
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return {
                isAbsolute: true,
                baseUrl: url,
                instance: axios.create({
                    baseURL: url,
                    timeout: 30000,
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                })
            };
        }
        return {
            isAbsolute: false,
            baseUrl: url,
            instance: axiosInstance
        };
    }
    return {
        isAbsolute: false,
        baseUrl: '/v2',
        instance: axiosInstance
    };
};

class AuthService {
    /**
     * Login user - Authenticates user and sets HttpOnly cookies
     */
    async login(data: LoginRequest): Promise<UserResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/auth/login`;
        const response = await config.instance.post<UserResponse>(url, data);
        return response.data;
    }

    /**
     * Register new user
     */
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/auth/register`;
        const response = await config.instance.post<AuthResponse>(url, data);
        return response.data;
    }

    /**
     * Logout user
     */
    async logout(): Promise<AuthResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/auth/logout`;
        const response = await config.instance.post<AuthResponse>(url);
        return response.data;
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken?: string): Promise<AuthResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/auth/refresh`;
        const response = await config.instance.post<AuthResponse>(url, {}, {
            params: refreshToken ? { refresh_token: refreshToken } : {}
        });
        return response.data;
    }

    /**
     * Initiate password reset
     */
    async forgotPassword(email: string): Promise<AuthResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/auth/forgot-password`;
        const response = await config.instance.post<AuthResponse>(url, {}, {
            params: { email }
        });
        return response.data;
    }

    /**
     * Reset password with confirmation code
     */
    async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/auth/reset-password`;
        const response = await config.instance.post<AuthResponse>(url, data);
        return response.data;
    }

    /**
     * Resend confirmation code
     */
    async resendCode(email: string): Promise<AuthResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/auth/resend-code`;
        const response = await config.instance.post<AuthResponse>(url, {}, {
            params: { email }
        });
        return response.data;
    }

    /**
     * Confirm email address
     */
    async confirmEmail(data: ConfirmEmailRequest): Promise<AuthResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/auth/confirm-email`;
        const response = await config.instance.post<AuthResponse>(url, data);
        return response.data;
    }

    /**
     * Get current session - Validates session cookie and returns user profile
     */
    async getSession(accessToken?: string): Promise<UserResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/auth/session`;
        const response = await config.instance.get<UserResponse>(url, {
            params: accessToken ? { access_token: accessToken } : {}
        });
        return response.data;
    }
}

export const authService = new AuthService();

