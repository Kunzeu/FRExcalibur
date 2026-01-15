
import { useState } from 'react';

export const useIntakeStepper = (initialStep: number = 1, totalSteps: number = 3) => {
    const [currentStep, setCurrentStep] = useState(initialStep);

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const goToStep = (step: number) => {
        const safeStep = Math.max(1, Math.min(step, totalSteps));
        setCurrentStep(safeStep);
    };

    return {
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep,
        goToStep
    };
};
