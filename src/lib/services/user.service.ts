import axiosInstance from '@/lib/axios';
import axios from 'axios';
import type {
    UserResponse,
    CreateUserRequest,
    UpdateUserRequest,
    AuthResponse
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

class UserService {
    /**
     * List users - Retrieves a list of users filtered by the current user's permission scope
     */
    async listUsers(userType?: string, roleId?: string): Promise<UserResponse[]> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/iam/users`;
        const params: Record<string, string> = {};
        if (userType) params.userType = userType;
        if (roleId) params.roleId = roleId;
        
        const response = await config.instance.get<UserResponse[]>(url, { params });
        return response.data;
    }

    /**
     * Create new user
     */
    async createUser(data: CreateUserRequest): Promise<UserResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/iam/users`;
        const response = await config.instance.post<UserResponse>(url, data);
        return response.data;
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<UserResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/iam/users/${id}`;
        const response = await config.instance.get<UserResponse>(url);
        return response.data;
    }

    /**
     * Update user
     */
    async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/iam/users/${id}`;
        const response = await config.instance.put<UserResponse>(url, data);
        return response.data;
    }

    /**
     * Delete user (soft delete)
     */
    async deleteUser(id: string): Promise<void> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/iam/users/${id}`;
        await config.instance.delete(url);
    }

    /**
     * Invite user to portal
     */
    async inviteUser(id: string): Promise<AuthResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/iam/users/${id}/invite`;
        const response = await config.instance.post<AuthResponse>(url);
        return response.data;
    }

    /**
     * Enable user
     */
    async enableUser(id: string): Promise<AuthResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/iam/users/${id}/enable`;
        const response = await config.instance.post<AuthResponse>(url);
        return response.data;
    }

    /**
     * Disable user
     */
    async disableUser(id: string): Promise<AuthResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/iam/users/${id}/disable`;
        const response = await config.instance.post<AuthResponse>(url);
        return response.data;
    }
}

export const userService = new UserService();

