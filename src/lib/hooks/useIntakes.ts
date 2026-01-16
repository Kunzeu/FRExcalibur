import { useState, useCallback } from 'react';
import { intakeService } from '@/lib/services/intake.service';
import type { 
    IntakeResponse, 
    IntakeCreateRequest, 
    IntakeUpdateRequest, 
    Pageable, 
    PageIntakeResponse 
} from '@/lib/types/intake-api';

export const useIntakes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [intakes, setIntakes] = useState<PageIntakeResponse | null>(null);

    const getAllIntakes = useCallback(async (pageable: Pageable) => {
        setLoading(true);
        setError(null);
        try {
            const response = await intakeService.getAllIntakes(pageable);
            setIntakes(response);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al cargar intakes';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getIntakeById = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            return await intakeService.getIntakeById(id);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al cargar intake';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getIntakesByStatus = useCallback(async (status: string, pageable: Pageable) => {
        setLoading(true);
        setError(null);
        try {
            const response = await intakeService.getIntakesByStatus(status, pageable);
            setIntakes(response);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al cargar intakes por estado';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createIntake = useCallback(async (data: IntakeCreateRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await intakeService.createIntake(data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al crear intake';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateIntake = useCallback(async (id: string, data: IntakeUpdateRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await intakeService.updateIntake(id, data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar intake';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteIntake = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await intakeService.deleteIntake(id);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar intake';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const generateIntakeNumber = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            return await intakeService.generateIntakeNumber();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al generar número de intake';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        intakes,
        loading,
        error,
        getAllIntakes,
        getIntakeById,
        getIntakesByStatus,
        createIntake,
        updateIntake,
        deleteIntake,
        generateIntakeNumber,
        clearError: () => setError(null)
    };
};

