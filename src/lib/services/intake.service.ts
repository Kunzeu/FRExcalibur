import axiosInstance from '@/lib/axios';
import axios from 'axios';
import type {
    IntakeResponse,
    IntakeCreateRequest,
    IntakeUpdateRequest,
    Pageable,
    PageIntakeResponse,
    UserResponse
} from '@/lib/types/intake-api';

// Base URL para la API v2 según la documentación
// IMPORTANTE: axiosInstance ya tiene baseURL configurado, así que solo necesitamos la ruta relativa
const getApiV2Config = () => {
    // Si NEXT_PUBLIC_API_V2_URL está definida y es una URL completa, la usamos directamente
    if (process.env.NEXT_PUBLIC_API_V2_URL) {
        const url = process.env.NEXT_PUBLIC_API_V2_URL;
        // Si es una URL completa (empieza con http), creamos una instancia de axios sin baseURL
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
        // Si es una ruta relativa, la usamos con axiosInstance
        return {
            isAbsolute: false,
            baseUrl: url,
            instance: axiosInstance
        };
    }
    // Por defecto, usamos /v2 (relativo a la baseURL de axios que es /api)
    return {
        isAbsolute: false,
        baseUrl: '/v2',
        instance: axiosInstance
    };
};

class IntakeService {
    /**
     * Obtiene todos los intakes con paginación
     */
    async getAllIntakes(pageable: Pageable): Promise<PageIntakeResponse> {
        const params = new URLSearchParams({
            page: pageable.page.toString(),
            size: pageable.size.toString(),
        });
        
        if (pageable.sort && pageable.sort.length > 0) {
            pageable.sort.forEach(sort => params.append('sort', sort));
        }

        const config = getApiV2Config();
        const url = `${config.baseUrl}/intake?${params.toString()}`;
        
        try {
            const response = await config.instance.get(url);
            return response.data;
        } catch (error: any) {
            // Mejorar el mensaje de error
            if (error.request && !error.response) {
                const fullUrl = config.isAbsolute ? url : `${axiosInstance.defaults.baseURL}${url}`;
                throw new Error(
                    `No se pudo conectar con el servidor en ${fullUrl}. ` +
                    `Verifica que:\n` +
                    `1. La API esté corriendo\n` +
                    `2. La URL sea correcta (configura NEXT_PUBLIC_API_V2_URL en .env.local si es necesario)\n` +
                    `3. No haya problemas de CORS`
                );
            }
            throw error;
        }
    }

    /**
     * Obtiene un intake por ID
     */
    async getIntakeById(id: string): Promise<IntakeResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/intake/${id}`;
        const response = await config.instance.get(url);
        return response.data;
    }

    /**
     * Obtiene intakes filtrados por status
     */
    async getIntakesByStatus(status: string, pageable: Pageable): Promise<PageIntakeResponse> {
        const params = new URLSearchParams({
            page: pageable.page.toString(),
            size: pageable.size.toString(),
        });
        
        if (pageable.sort && pageable.sort.length > 0) {
            pageable.sort.forEach(sort => params.append('sort', sort));
        }

        const config = getApiV2Config();
        const url = `${config.baseUrl}/intake/status/${status}?${params.toString()}`;
        const response = await config.instance.get(url);
        return response.data;
    }

    /**
     * Crea un nuevo intake
     */
    async createIntake(data: IntakeCreateRequest): Promise<IntakeResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/intake`;
        const response = await config.instance.post(url, data);
        return response.data;
    }

    /**
     * Actualiza un intake existente
     */
    async updateIntake(id: string, data: IntakeUpdateRequest): Promise<IntakeResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/intake/${id}`;
        const response = await config.instance.put(url, data);
        return response.data;
    }

    /**
     * Elimina un intake
     */
    async deleteIntake(id: string): Promise<void> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/intake/${id}`;
        await config.instance.delete(url);
    }

    /**
     * Genera un número de intake para preview
     */
    async generateIntakeNumber(): Promise<string> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/intake/generate-number`;
        const response = await config.instance.get(url);
        return response.data;
    }

    /**
     * Obtiene información de un usuario por ID (para obtener datos del screener/cliente)
     * @deprecated Use userService.getUserById instead
     */
    async getUserById(id: string): Promise<UserResponse> {
        const config = getApiV2Config();
        const url = `${config.baseUrl}/iam/users/${id}`;
        const response = await config.instance.get(url);
        return response.data;
    }

    /**
     * Formatea una fecha ISO a formato legible
     */
    formatDateTime(isoString?: string): string {
        if (!isoString) return '-';
        try {
            const date = new Date(isoString);
            return date.toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        } catch (error) {
            return '-';
        }
    }

    /**
     * Formatea una fecha ISO a formato de fecha solamente
     */
    formatDate(isoString?: string): string {
        if (!isoString) return '-';
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            });
        } catch (error) {
            return '-';
        }
    }
}

export const intakeService = new IntakeService();

