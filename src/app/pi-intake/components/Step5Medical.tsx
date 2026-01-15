import { useState } from 'react';
import { Box, Typography, Grid, FormControlLabel, RadioGroup, Radio, Button, FormHelperText, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';
import { CustomInput } from '@/components/forms/CustomInput';
import { PIIntakeFormData, PIIntakeValidationErrors } from '@/lib/types/pi-intake';
import { Warning } from '@mui/icons-material';
import { useTheme } from '@/lib/contexts/theme-context';

interface Step5MedicalProps {
    formData: PIIntakeFormData;
    handleChange: (field: keyof PIIntakeFormData, value: any) => void;
    prevStep: () => void;
    handleSave: () => void;
    goToStep: (step: number) => void;
    setValidationErrors: (errors: PIIntakeValidationErrors) => void;
}

const MEDICAL_STATUS_OPTIONS = [
    { label: 'Medical Assigned', info: 'The case has been assigned to a handling lawyer, but the client has yet to sign the necessary documents to formalize the agreement.' },
    { label: 'Pending Medical', info: 'The case has been assigned to a handling lawyer, who is currently evaluating the details of the case.' },
    { label: 'Client Medical', info: 'Some information has yet to be entered in the Intake.' },
    { label: 'Lawyer\'s Medical', info: 'The case is waiting for some additional information to be completed or presented, before it can be further evaluated or assigned.' },
    { label: 'Employee\'s Medical', info: 'The case is waiting for some additional information to be completed or presented, before it can be further evaluated or assigned.' },
    { label: 'None', info: 'The case is waiting for some additional information to be completed or presented, before it can be further evaluated or assigned.' }
];

export default function Step5Medical({ formData, handleChange, prevStep, handleSave, goToStep, setValidationErrors }: Step5MedicalProps) {
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    // Validation Modal State
    const [validationModal, setValidationModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        targetStep: number | null;
        missingFields: string[];
    }>({
        open: false,
        title: '',
        message: '',
        targetStep: null,
        missingFields: []
    });

    const validateAndSubmit = () => {
        const newLocalErrors: { [key: string]: boolean } = {};
        const globalErrors: PIIntakeValidationErrors = {};
        let isValid = true;
        let hasGlobalErrors = false;

        // --- Step 5 (Current Step) Validation ---
        if (!formData.isCaseLien) {
            newLocalErrors.isCaseLien = true;
            globalErrors.isCaseLien = true;
            isValid = false;
        }
        if (!formData.medicalStatus) {
            newLocalErrors.medicalStatus = true;
            globalErrors.medicalStatus = true;
            isValid = false;
        }
        if (!formData.micStatus) {
            newLocalErrors.micStatus = true;
            globalErrors.micStatus = true;
            isValid = false;
        }
        if (formData.micStatus === 'yes' && !formData.micDetails?.trim()) {
            newLocalErrors.micDetails = true;
            globalErrors.micDetails = true;
            isValid = false;
        }

        setErrors(newLocalErrors);

        if (!isValid) {
            const firstError = document.querySelector('[aria-invalid="true"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        // --- Global Validation (Previous Steps) ---

        // Step 1: Lead Information
        const step1Missing: string[] = [];
        if (!formData.callSource) { step1Missing.push('Call Source'); globalErrors.callSource = true; hasGlobalErrors = true; }
        if (!formData.firstName) { step1Missing.push('Lead First Name'); globalErrors.firstName = true; hasGlobalErrors = true; }
        if (!formData.lastName) { step1Missing.push('Lead Last Name'); globalErrors.lastName = true; hasGlobalErrors = true; }
        if (!formData.phoneNumber) { step1Missing.push('Phone Number'); globalErrors.phoneNumber = true; hasGlobalErrors = true; }
        if (formData.onBehalfOf.length === 0) { step1Missing.push('On Behalf Of'); globalErrors.onBehalfOf = true; hasGlobalErrors = true; }

        // Client Info if applicable
        const needsClientInfo = formData.onBehalfOf.some((r: string) => ['Legal Spouse', 'Son/Daughter', 'Son/Daughter(Minor)', 'Parent', 'Sibling', 'Friend', 'Other'].includes(r));
        if (needsClientInfo) {
            if (!formData.clientFirstName) { step1Missing.push('Client First Name'); globalErrors.clientFirstName = true; hasGlobalErrors = true; }
            if (!formData.clientLastName) { step1Missing.push('Client Last Name'); globalErrors.clientLastName = true; hasGlobalErrors = true; }
            if (!formData.clientPhone) { step1Missing.push('Client Phone Number'); globalErrors.clientPhone = true; hasGlobalErrors = true; }
        }

        // Step 2: Accident Information
        const step2Missing: string[] = [];
        if (!formData.involvedInAutoAccident) { step2Missing.push('Type of Accident Selection'); globalErrors.involvedInAutoAccident = true; hasGlobalErrors = true; }

        // Additional Persons Logic
        const numPersons = parseInt(formData.numberOfPersonsInAccident || '1');
        if (numPersons >= 2 && (!formData.person2FirstName || !formData.person2LastName)) { step2Missing.push('Person 2 Details'); globalErrors.person2FirstName = true; hasGlobalErrors = true; }
        if (numPersons >= 3 && (!formData.person3FirstName || !formData.person3LastName)) { step2Missing.push('Person 3 Details'); globalErrors.person3FirstName = true; hasGlobalErrors = true; }
        if (numPersons >= 4 && (!formData.person4FirstName || !formData.person4LastName)) { step2Missing.push('Person 4 Details'); globalErrors.person4FirstName = true; hasGlobalErrors = true; }
        if (numPersons >= 5 && (!formData.person5FirstName || !formData.person5LastName)) { step2Missing.push('Person 5 Details'); globalErrors.person5FirstName = true; hasGlobalErrors = true; }
        if (numPersons >= 6 && (!formData.person6FirstName || !formData.person6LastName)) { step2Missing.push('Person 6 Details'); globalErrors.person6FirstName = true; hasGlobalErrors = true; }

        // Step 4: Lawyer
        const step4Missing: string[] = [];
        if (!formData.lawyerStatus) { step4Missing.push('Lawyer Status'); globalErrors.lawyerStatus = true; hasGlobalErrors = true; }

        // Update Global Validation Errors
        setValidationErrors(globalErrors);

        // Handle Modal Display (Priority Order)
        if (step1Missing.length > 0) {
            setValidationModal({
                open: true,
                title: 'Missing Lead Information',
                message: 'Please complete the following mandatory fields in Step 1:',
                targetStep: 1,
                missingFields: step1Missing
            });
            return;
        }

        if (step2Missing.length > 0) {
            const isPersonMissing = step2Missing.some(msg => msg.includes('Person'));
            setValidationModal({
                open: true,
                title: isPersonMissing ? 'Debes agregar los datos de los otros afectados' : 'Missing Accident Information',
                message: isPersonMissing ? 'Please fill in the details for all additional persons involved.' : 'Please complete the following mandatory fields in Step 2:',
                targetStep: 2,
                missingFields: step2Missing
            });
            return;
        }

        if (step4Missing.length > 0) {
            setValidationModal({
                open: true,
                title: 'Missing Lawyer Information',
                message: 'Please complete the following mandatory fields in Step 4:',
                targetStep: 4,
                missingFields: step4Missing
            });
            return;
        }

        if (!isValid) return; // Block on Step 5 errors

        // If all valid
        handleSave();
    };

    return (
        <>
            {/* Medical Offices Complete Header */}

            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-6 md:mb-8 text-xl md:text-2xl">
                Medical offices complete
            </Typography>

            <Box className="max-w-4xl mx-auto mb-8 md:mb-12">
                <Box className="mb-8">
                    <label id="case-lien-label" className={`block text-sm font-bold mb-3 ${errors.isCaseLien ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                        Is this case a Lien? {errors.isCaseLien && '*'}
                    </label>
                    <RadioGroup
                        aria-labelledby="case-lien-label"
                        row
                        value={formData.isCaseLien || ''}
                        onChange={(e) => {
                            handleChange('isCaseLien', e.target.value);
                            if (errors.isCaseLien) setErrors({ ...errors, isCaseLien: false });
                        }}
                        aria-invalid={errors.isCaseLien}
                    >
                        <FormControlLabel
                            value="yes"
                            control={
                                <Radio
                                    inputProps={{ 'aria-label': 'Yes' }}
                                    sx={{
                                        color: errors.isCaseLien ? '#ef4444' : '#D1D5DB',
                                        '&.Mui-checked': {
                                            color: '#E8B007',
                                        },
                                    }}
                                />
                            }
                            label={<span className={`text-sm font-bold ${errors.isCaseLien ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>Yes</span>}
                            className="mr-8 md:mr-12"
                        />
                        <FormControlLabel
                            value="no"
                            control={
                                <Radio
                                    inputProps={{ 'aria-label': 'No' }}
                                    sx={{
                                        color: errors.isCaseLien ? '#ef4444' : '#D1D5DB',
                                        '&.Mui-checked': {
                                            color: '#E8B007',
                                        },
                                    }}
                                />
                            }
                            label={<span className={`text-sm font-bold ${errors.isCaseLien ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>No</span>}
                        />
                    </RadioGroup>
                    {errors.isCaseLien && <FormHelperText error>This field is required</FormHelperText>}
                </Box>
            </Box>

            <Typography variant="h2" className={`font-extrabold mb-6 md:mb-8 text-xl md:text-2xl ${errors.medicalStatus ? 'text-red-500' : 'text-black dark:text-white'}`}>
                Medical status {errors.medicalStatus && '*'}
            </Typography>

            <Box className="max-w-4xl mx-auto mb-8 md:mb-12">
                <Grid container spacing={4} className="mb-8" role="radiogroup" aria-label="Medical Status" aria-invalid={errors.medicalStatus}>
                    {MEDICAL_STATUS_OPTIONS.map((option) => (
                        <Grid item xs={12} sm={4} key={option.label} role="radio" aria-checked={formData.medicalStatus === option.label}>
                            <Tooltip
                                title={option.info}
                                arrow
                                placement="top"
                                slotProps={{
                                    tooltip: {
                                        sx: {
                                            bgcolor: isDark ? '#374151' : '#1F2937',
                                            color: 'white',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            maxWidth: '280px',
                                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                                            '& .MuiTooltip-arrow': {
                                                color: isDark ? '#374151' : '#1F2937',
                                            }
                                        }
                                    }
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Radio
                                            checked={formData.medicalStatus === option.label}
                                            onChange={() => {
                                                handleChange('medicalStatus', option.label);
                                                if (errors.medicalStatus) setErrors({ ...errors, medicalStatus: false });
                                            }}
                                            inputProps={{ 'aria-label': option.label }}
                                            sx={{
                                                color: errors.medicalStatus ? '#ef4444' : '#D1D5DB',
                                                '&.Mui-checked': {
                                                    color: '#E8B007'
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <span className={`text-sm font-bold ${errors.medicalStatus ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>
                                            {option.label}
                                        </span>
                                    }
                                    className="m-0 w-full hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg pr-2 transition-colors ml-[-8px] pl-[8px]"
                                />
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
                {errors.medicalStatus && <FormHelperText error className="mt-[-20px] mb-4">Please select a medical status</FormHelperText>}

                <Box className="mb-8">
                    <CustomInput
                        label="Medical Status Note"
                        multiline
                        rows={4}
                        value={formData.medicalStatusNote || ''}
                        onChange={(e: any) => handleChange('medicalStatusNote', e.target.value)}
                    />
                </Box>
            </Box>

            {/* Type of Policy Section */}
            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-6 md:mb-8 text-xl md:text-2xl">
                Type of policy
            </Typography>

            <Box className="max-w-4xl mx-auto mb-12 md:mb-24">
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                        <CustomInput
                            label="Type of Policy"
                            select
                            value={formData.typeOfPolicy || ''}
                            onChange={(e: any) => handleChange('typeOfPolicy', e.target.value)}
                        >
                            <option value="Policy 1">Policy 1</option>
                            <option value="Policy 2">Policy 2</option>
                        </CustomInput>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CustomInput
                            label="Type of Commercial Policy"
                            select
                            value={formData.typeOfCommercialPolicy || ''}
                            onChange={(e: any) => handleChange('typeOfCommercialPolicy', e.target.value)}
                        >
                            <option value="Commercial Policy 1">Commercial Policy 1</option>
                            <option value="Commercial Policy 2">Commercial Policy 2</option>
                        </CustomInput>
                    </Grid>
                </Grid>
                <Box className="mt-8">
                    <CustomInput
                        label="Explain type of Policy"
                        multiline
                        rows={4}
                        value={formData.typeOfPolicyNote || ''}
                        onChange={(e: any) => handleChange('typeOfPolicyNote', e.target.value)}
                    />
                </Box>
            </Box>

            {/* Mic Information Section */}
            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-8 md:mb-12 text-xl md:text-2xl">
                Mic information
            </Typography>

            <Box className="max-w-4xl mx-auto mb-16">
                <Box className="mb-8">
                    <label id="mic-status-label" className={`block text-sm font-bold mb-3 ${errors.micStatus ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                        MIC? {errors.micStatus && '*'}
                    </label>
                    <RadioGroup
                        aria-labelledby="mic-status-label"
                        row
                        value={formData.micStatus || ''}
                        onChange={(e) => {
                            handleChange('micStatus', e.target.value);
                            if (errors.micStatus) setErrors({ ...errors, micStatus: false });
                        }}
                        aria-invalid={errors.micStatus}
                    >
                        <FormControlLabel
                            value="yes"
                            control={
                                <Radio
                                    inputProps={{ 'aria-label': 'Yes' }}
                                    sx={{
                                        color: errors.micStatus ? '#ef4444' : '#D1D5DB',
                                        '&.Mui-checked': {
                                            color: '#E8B007',
                                        },
                                    }}
                                />
                            }
                            label={<span className={`text-sm font-bold ${errors.micStatus ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>Yes</span>}
                            className="mr-12"
                        />
                        <FormControlLabel
                            value="no"
                            control={
                                <Radio
                                    inputProps={{ 'aria-label': 'No' }}
                                    sx={{
                                        color: errors.micStatus ? '#ef4444' : '#D1D5DB',
                                        '&.Mui-checked': {
                                            color: '#E8B007',
                                        },
                                    }}
                                />
                            }
                            label={<span className={`text-sm font-bold ${errors.micStatus ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>No</span>}
                        />
                    </RadioGroup>
                    {errors.micStatus && <FormHelperText error>This field is required</FormHelperText>}
                </Box>

                {formData.micStatus === 'yes' && (
                    <Box className="mb-8">
                        <CustomInput
                            label="What is the MIC?"
                            multiline
                            rows={4}
                            value={formData.micDetails || ''}
                            onChange={(e: any) => {
                                handleChange('micDetails', e.target.value);
                                if (errors.micDetails) setErrors({ ...errors, micDetails: false });
                            }}
                            error={errors.micDetails}
                            helperText={errors.micDetails ? "Please provide details about the MIC" : ""}
                            aria-invalid={errors.micDetails}
                        />
                    </Box>
                )}
            </Box>


            {/* Navigation Buttons */}
            <Box className="max-w-4xl mx-auto">
                <Box className="flex justify-between items-center">
                    <Button
                        onClick={prevStep}
                        variant="outlined"
                        sx={{
                            backgroundColor: 'white !important',
                            color: '#EAB308 !important',
                            border: '2px solid #EAB308 !important',
                            borderRadius: '50px',
                            textTransform: 'none',
                            fontWeight: '900 !important',
                            fontSize: '1rem',
                            letterSpacing: '0.5px',
                            px: 4,
                            py: 1.25,
                            minWidth: '120px',
                            height: '40px',
                            boxShadow: 'none',
                            fontFamily: 'inherit',
                            '&:hover': {
                                backgroundColor: '#FFFBEB !important',
                                color: '#EAB308 !important',
                                border: '2px solid #EAB308 !important',
                            }
                        }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={validateAndSubmit}
                        sx={{
                            backgroundColor: '#EAB308 !important',
                            color: 'white !important',
                            borderRadius: '50px',
                            textTransform: 'none',
                            fontWeight: '900 !important',
                            fontSize: '1rem',
                            letterSpacing: '0.5px',
                            px: 4,
                            py: 1.25,
                            minWidth: '140px',
                            height: '40px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            '&:hover': {
                                backgroundColor: '#FCD34D !important',
                                boxShadow: '0 4px 8px rgba(234, 179, 8, 0.4)',
                            },
                        }}
                    >
                        Submit Intake
                    </Button>
                </Box>
            </Box>
            {/* Validation Modal */}
            <Dialog
                open={validationModal.open}
                onClose={() => setValidationModal(prev => ({ ...prev, open: false }))}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '32px',
                        padding: '32px',
                        backgroundImage: 'linear-gradient(to bottom, #ffffff, #fdfbf7)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        margin: '16px'
                    }
                }}
                BackdropProps={{
                    sx: {
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)'
                    }
                }}
            >
                <Box className="flex flex-col items-center text-center">
                    <Box className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-sm ring-8 ring-red-50/50">
                        <Warning sx={{ fontSize: 44, color: '#ef4444' }} />
                    </Box>

                    <Typography variant="h5" className="font-extrabold text-gray-900 mb-3 tracking-tight">
                        {validationModal.title}
                    </Typography>

                    <Typography className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto">
                        {validationModal.message}
                    </Typography>

                    {validationModal.missingFields.length > 0 && (
                        <Box className="w-full bg-red-50 border border-red-100 rounded-2xl p-6 mb-8 text-left transition-all hover:bg-red-50/80">
                            <Typography className="text-red-900 font-bold mb-4 uppercase tracking-wider text-xs border-b border-red-200 pb-2">
                                Required Fields
                            </Typography>
                            <Box component="ul" className="space-y-3 m-0 p-0 list-none">
                                {validationModal.missingFields.map((field) => (
                                    <li key={field} className="text-red-700 text-base font-semibold flex items-center">
                                        <Box component="span" className="w-2 h-2 bg-red-500 rounded-full mr-3 shadow-sm flex-shrink-0" />
                                        {field}
                                    </li>
                                ))}
                            </Box>
                        </Box>
                    )}

                    <Box className="flex flex-col sm:flex-row gap-4 w-full">
                        <Button
                            variant="outlined"
                            onClick={() => setValidationModal(prev => ({ ...prev, open: false }))}
                            fullWidth
                            className="h-12"
                            sx={{
                                color: '#6B7280',
                                borderColor: '#E5E7EB',
                                borderRadius: '100px',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '1rem',
                                borderWidth: '2px',
                                '&:hover': {
                                    backgroundColor: '#F3F4F6',
                                    borderColor: '#D1D5DB',
                                    borderWidth: '2px'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        {validationModal.targetStep && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setValidationModal(prev => ({ ...prev, open: false }));
                                    if (validationModal.targetStep) goToStep(validationModal.targetStep);
                                }}
                                fullWidth
                                className="h-12"
                                sx={{
                                    backgroundColor: '#EAB308 !important',
                                    color: 'white !important',
                                    borderRadius: '100px',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 6px -1px rgba(234, 179, 8, 0.3), 0 2px 4px -1px rgba(234, 179, 8, 0.1)',
                                    '&:hover': {
                                        backgroundColor: '#FCD34D !important',
                                        boxShadow: '0 10px 15px -3px rgba(234, 179, 8, 0.4), 0 4px 6px -2px rgba(234, 179, 8, 0.2)',
                                        transform: 'translateY(-1px)'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Go to Step {validationModal.targetStep}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Dialog>
        </>
    );
}
