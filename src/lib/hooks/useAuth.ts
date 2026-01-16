import { useState } from 'react';
import { authService } from '@/lib/services/auth.service';
import type { LoginRequest, RegisterRequest, ResetPasswordRequest, ConfirmEmailRequest, UserResponse, AuthResponse } from '@/lib/types/intake-api';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserResponse | null>(null);

    const login = async (data: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const userResponse = await authService.login(data);
            setUser(userResponse);
            return userResponse;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar sesión';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.register(data);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al registrar usuario';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.logout();
            setUser(null);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al cerrar sesión';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getSession = async (accessToken?: string) => {
        setLoading(true);
        setError(null);
        try {
            const userResponse = await authService.getSession(accessToken);
            setUser(userResponse);
            return userResponse;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al obtener sesión';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            return await authService.forgotPassword(email);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al solicitar restablecimiento de contraseña';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (data: ResetPasswordRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await authService.resetPassword(data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al restablecer contraseña';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            return await authService.resendCode(email);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al reenviar código';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const confirmEmail = async (data: ConfirmEmailRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await authService.confirmEmail(data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al confirmar email';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const refreshToken = async (refreshToken?: string) => {
        setLoading(true);
        setError(null);
        try {
            return await authService.refreshToken(refreshToken);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al refrescar token';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        login,
        register,
        logout,
        getSession,
        forgotPassword,
        resetPassword,
        resendCode,
        confirmEmail,
        refreshToken,
        clearError: () => setError(null)
    };
};

