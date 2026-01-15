
import { useState, useEffect } from 'react';
import { initialPIIntakeFormData, PIIntakeFormData, PIIntakeValidationErrors } from '@/lib/types/pi-intake';

export const usePIIntakeForm = () => {
    const [formData, setFormData] = useState<PIIntakeFormData>(initialPIIntakeFormData);
    const [validationErrors, setValidationErrors] = useState<PIIntakeValidationErrors>({});

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('pi-intake-form-data');
        if (savedData) {
            try {
                setFormData(JSON.parse(savedData));
            } catch (error) {
                console.error('Error parsing saved form data:', error);
            }
        }
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        localStorage.setItem('pi-intake-form-data', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (field: keyof PIIntakeFormData, value: any) => {
        setFormData((prev: PIIntakeFormData) => ({ ...prev, [field]: value }));

        // Clear error when user types
        if (validationErrors[field]) {
            setValidationErrors((prev: PIIntakeValidationErrors) => ({ ...prev, [field]: false }));
        }
    };

    const handlePersonChange = (personId: number, field: any, value: any) => {
        setFormData((prev: PIIntakeFormData) => {
            const currentPersonData = prev.persons?.[personId] || {};
            const updatedPersonData = { ...currentPersonData, [field]: value };

            const extraUpdates: any = {};
            // If Person 1, update root fields too for backward compatibility
            if (personId === 1) {
                extraUpdates[field] = value;
            }

            return {
                ...prev,
                ...extraUpdates,
                persons: {
                    ...(prev.persons || {}),
                    [personId]: updatedPersonData
                }
            };
        });
    };

    const clearFormData = () => {
        setFormData(initialPIIntakeFormData);
        localStorage.removeItem('pi-intake-form-data');
    };

    return {
        formData,
        setFormData,
        validationErrors,
        setValidationErrors,
        handleChange,
        handlePersonChange,
        clearFormData
    };
};
