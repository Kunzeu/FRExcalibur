'use client';

import { useState } from 'react';

import { useTheme } from '@/lib/contexts/theme-context';
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Button
} from '@mui/material';
import { useJsApiLoader } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from '@/lib/constants/accident-form';
import { usePIIntakeForm } from '@/hooks/usePIIntakeForm';
import { useIntakeStepper } from '@/hooks/useIntakeStepper';
import Step1LeadInfo from './components/Step1LeadInfo';
import Step2AccidentInfo from './components/Step2AccidentInfo';
import Step3ClientInjuryComplaints from './components/Step3ClientInjuryComplaints';
import Step4LawyerRef from './components/Step4LawyerRef';
import Step5Medical from './components/Step5Medical';
import { PersonNavigation } from './components/PersonNavigation';
import { validateStep1, validateStep2 } from '@/lib/utils/pi-intake-validation';
import IntakeListTab from './components/IntakeListTab';

// Top Nav Tabs
const NAV_TABS = ['PI Intake Form', 'Intake List', 'Dashboard'];


// Stepper Steps
const STEPS = [
    { number: 1, label: 'Lead/Client information' },
    { number: 2, label: 'Accident information' },
    { number: 3, label: 'Client injury complaints' },
    { number: 4, label: 'Lawyer' },
    { number: 5, label: 'Medical' }
];



export default function PIIntakePage() {
    const {
        formData,
        setFormData,
        validationErrors,
        setValidationErrors,

        handleChange,
        handlePersonChange,
        clearFormData
    } = usePIIntakeForm();

    // Import validation functions locally (assuming they are exported)
    // Note: In a real environment, I would add the import at the top. 
    // Since I can't easily add top-level imports without context, I'll assume they are available or I'll implement a wrapper.
    // Ideally I'd use multi_replace to add import. 
    // But for now let's just use the logic inline or add import at top.


    const {
        currentStep,
        setCurrentStep,
        nextStep,
        prevStep
    } = useIntakeStepper(1, 5);

    const [activeTab, setActiveTab] = useState(0); // For top nav
    const [step3ShowSource, setStep3ShowSource] = useState(false);
    const [activePerson, setActivePerson] = useState(1);

    const { mode } = useTheme();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES
    });

    const handleNextStep = () => {
        let errors = {};
        // Validate based on current Step
        if (currentStep === 1) {
            errors = validateStep1(formData, activePerson);
        } else if (currentStep === 2) {
            errors = validateStep2(formData, activePerson);
            // Optionally check ALL persons if moving to Step 3?
            // For now, let's validate the current active person to allow fluid navigation
            // or we could loop through all persons if we wanted strict enforcement.
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setValidationErrors({});
            // Special handling for Step 2 transitions or Step 3 Source
            if (currentStep === 2) {
                setStep3ShowSource(false);
            }
            nextStep();
        }
    };




    return (
        <Box className="min-h-screen bg-gray-50 dark:bg-black flex flex-col font-sans" >
            <Box className="bg-white dark:bg-gray-900 shadow-sm">


                {/* Custom Header Bar for PI Intake */}
                <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-black dark:border-gray-700">
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => setActiveTab(v)}
                        sx={{
                            '& .MuiTabs-indicator': { backgroundColor: '#EAB308', height: '4px' },
                            '& .MuiTabs-flexContainer': {
                                gap: '80px'
                            },
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: '400 !important',
                                fontSize: '1rem',
                                minWidth: 'auto',
                                padding: '12px 0',
                                color: mode === 'dark' ? '#FFFFFF !important' : '#000000 !important',
                                fontFamily: 'inherit',
                                '&.Mui-selected': {
                                    color: mode === 'dark' ? '#FFFFFF !important' : '#000000 !important',
                                    fontWeight: '700 !important',
                                    fontFamily: 'inherit',
                                }
                            }
                        }}
                    >
                        {NAV_TABS.map((tab, index) => (
                            <Tab
                                key={tab}
                                label={tab}
                                sx={{
                                    fontWeight: `${activeTab === index ? 700 : 400} !important`,
                                }}
                            />
                        ))}
                    </Tabs>
                </Box>
            </Box>

            <Container 
                maxWidth={activeTab === 1 ? false : "lg"} 
                className="flex-2 pt-12 pb-18"
                sx={activeTab === 1 ? { 
                    maxWidth: '100%',
                    paddingX: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 }
                } : {}}
            >
                {/* Intake List Tab Content */}
                {activeTab === 1 && (
                    <IntakeListTab />
                )}

                {/* PI Intake Form Tab Content */}
                {activeTab === 0 && (
                    <>
                        {/* Client Searcher */}
                        {currentStep === 1 && (
                    <Box className="flex flex-col md:flex-row gap-6 justify-start mb-12">
                        <Box className="relative w-full max-w-xl">
                            <input
                                type="text"
                                placeholder="Search client..."
                                aria-label="Search client"
                                className="w-full h-14 pl-14 pr-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-lg outline-none focus:border-[#EAB308] focus:ring-1 focus:ring-[#EAB308] dark:text-white transition-all shadow-[0_4px_20px_rgba(0,0,0,0.05)] placeholder:text-gray-400"
                            />
                            <svg
                                className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </Box>

                        <Box className="w-full md:w-auto">
                            <Button
                                variant="outlined"
                                className="w-full md:w-auto h-14 px-8 rounded-full text-lg normal-case text-gray-500 dark:text-gray-300 hover:text-[#EAB308] dark:hover:text-[#EAB308] bg-white dark:bg-gray-800 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
                                sx={{
                                    borderColor: '#EAB308 !important',
                                    borderWidth: '2px !important',
                                    '&:hover': {
                                        borderColor: '#EAB308 !important',
                                    }
                                }}
                                startIcon={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                }
                            >
                                Edit Email
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Stepper */}
                <Box className="flex flex-col items-center justify-center mb-16">
                    <Box className="flex items-start justify-center w-full relative">

                        {STEPS.map((step, index) => {
                            const isActive = step.number === currentStep;
                            const isCompleted = step.number < currentStep;
                            const _isFirst = index === 0;
                            const isLast = index === STEPS.length - 1;

                            return (
                                <Box
                                    key={step.number}
                                    className="flex-1 flex flex-col items-center relative px-1 md:px-4 z-10 cursor-pointer"
                                    onClick={() => setCurrentStep(step.number)}
                                >
                                    {/* Line segment - only for first and middle steps */}
                                    {!isLast && (
                                        <Box
                                            className="absolute top-5 md:top-6 h-[2px] bg-gray-300 z-0"
                                            sx={{
                                                left: '50%',
                                                width: '100%',
                                            }}
                                        />
                                    )}
                                    <Box
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-base md:text-xl font-bold mb-2 md:mb-4 z-10 transition-all duration-200
                                            ${isActive
                                                ? 'bg-[#EAB308] text-white shadow-lg scale-110'
                                                : isCompleted
                                                    ? 'bg-[#F5E6D3] text-black'
                                                    : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {step.number}
                                    </Box>
                                    <Typography className={`text-[10px] md:text-sm font-bold tracking-wide text-center leading-3 md:leading-normal mt-1 md:mt-0
                                        ${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'}
                                    `}>
                                        {step.label}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* Person Navigation - Visible across all steps if multiple people */}
                <PersonNavigation
                    formData={formData}
                    activePerson={activePerson}
                    setActivePerson={(id) => {
                        setActivePerson(id);
                        if (id > 1) {
                            setCurrentStep(1);
                        }
                    }}
                />

                {/* Step 1 Content: Lead Isnformation */}
                {currentStep === 1 && (
                    <Step1LeadInfo
                        formData={formData}
                        handleChange={handleChange}
                        nextStep={handleNextStep}
                        validationErrors={validationErrors}
                        activePerson={activePerson}
                        handlePersonChange={handlePersonChange}
                    />
                )}

                {/* Step 2 Content: Accident Information */}
                {currentStep === 2 && (
                    <Step2AccidentInfo
                        formData={formData}
                        handleChange={handleChange}
                        validationErrors={validationErrors}
                        isLoaded={isLoaded}
                        nextStep={handleNextStep}
                        prevStep={prevStep}
                        activePerson={activePerson}
                        setActivePerson={setActivePerson}
                        handlePersonChange={handlePersonChange}
                    />
                )}

                {/* Step 3 Content: Client Injury Complaints */}
                {currentStep === 3 && (
                    <Step3ClientInjuryComplaints
                        formData={formData}
                        handleChange={handleChange}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        isLoaded={isLoaded}
                        showSourceSection={step3ShowSource}
                        setShowSourceSection={setStep3ShowSource}
                        activePerson={activePerson}
                        setActivePerson={setActivePerson}
                        handlePersonChange={handlePersonChange}
                    />
                )}

                {/* Step 4 Content: Lawyer & Sign Up */}
                {currentStep === 4 && (
                    <Step4LawyerRef
                        formData={formData}
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={() => {
                            setStep3ShowSource(true);
                            prevStep();
                        }}
                        handleSave={() => {
                            // Proceed to Medical step
                        }}
                        validationErrors={validationErrors}
                    />
                )}

                {currentStep === 5 && (
                    <Step5Medical
                        formData={formData}
                        handleChange={handleChange}
                        prevStep={prevStep}
                        handleSave={() => {
                            // Here you would typically make an API call to save the data
                            // api.save(formData).then(() => { ... })

                            // Clear local storage and reset form
                            clearFormData();
                            setCurrentStep(1);
                            // Optionally show a success message or redirect
                            alert("Intake Submitted Successfully!");
                        }}
                        goToStep={setCurrentStep}
                        setValidationErrors={setValidationErrors}
                    />
                )}
                    </>
                )}

            </Container >
        </Box >
    );
}
