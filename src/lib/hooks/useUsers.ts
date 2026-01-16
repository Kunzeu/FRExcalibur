import { useState, useCallback } from 'react';
import { userService } from '@/lib/services/user.service';
import type { 
    UserResponse, 
    CreateUserRequest, 
    UpdateUserRequest 
} from '@/lib/types/intake-api';

export const useUsers = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<UserResponse[]>([]);

    const listUsers = useCallback(async (userType?: string, roleId?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await userService.listUsers(userType, roleId);
            setUsers(response);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al cargar usuarios';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getUserById = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            return await userService.getUserById(id);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al cargar usuario';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = useCallback(async (data: CreateUserRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await userService.createUser(data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al crear usuario';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUser = useCallback(async (id: string, data: UpdateUserRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await userService.updateUser(id, data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar usuario';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await userService.deleteUser(id);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar usuario';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const inviteUser = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            return await userService.inviteUser(id);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al invitar usuario';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const enableUser = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            return await userService.enableUser(id);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al habilitar usuario';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const disableUser = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            return await userService.disableUser(id);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al deshabilitar usuario';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        users,
        loading,
        error,
        listUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        inviteUser,
        enableUser,
        disableUser,
        clearError: () => setError(null)
    };
};

