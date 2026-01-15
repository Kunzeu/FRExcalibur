
import { Box, Typography, Grid, FormControlLabel, Checkbox, Button, Autocomplete, TextField, Tooltip } from '@mui/material';
import { CustomInput } from '@/components/forms/CustomInput';
import { PIIntakeFormData, PIIntakeValidationErrors } from '@/lib/types/pi-intake';
import { BEHALF_OPTIONS } from '@/lib/constants/pi-intake-options';

interface Step1LeadInfoProps {
    formData: PIIntakeFormData;
    handleChange: (field: keyof PIIntakeFormData, value: any) => void;
    nextStep: () => void;
    validationErrors: PIIntakeValidationErrors;
    activePerson?: number;
    handlePersonChange?: (personId: number, field: any, value: any) => void;
}

export default function Step1LeadInfo({ 
    formData: globalFormData, 
    handleChange: globalHandleChange, 
    nextStep, 
    validationErrors,
    activePerson = 1,
    handlePersonChange
}: Step1LeadInfoProps) {
    // Helper to get current person data
    const getPersonData = () => {
        if (activePerson === 1) return globalFormData;
        // For Person 2+, merge with globalFormData to have access to all fields
        const personData = globalFormData.persons?.[activePerson] || {};
        return { ...globalFormData, ...personData };
    };

    const formData: any = getPersonData();

    const handleChange = (field: string, value: any) => {
        if (activePerson === 1) {
            globalHandleChange(field as keyof PIIntakeFormData, value);
        } else {
            // For Person 2+, always use handlePersonChange
            if (handlePersonChange) {
                handlePersonChange(activePerson, field, value);
            } else {
                console.warn("handlePersonChange is missing for activePerson > 1");
            }
        }
    };

    const isPerson2OrMore = activePerson > 1;
    return (
        <>
            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-8 md:mb-12 text-xl md:text-2xl">
                {isPerson2OrMore ? 'Client information' : 'Lead information'}
            </Typography>
            <Box className="max-w-4xl mx-auto">
                <Grid container spacing={6}>
                    {/* Row 1: Call Source & Sub-source - Only show for Person 1 */}
                    {!isPerson2OrMore && (
                        <>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    freeSolo
                                    options={['911', 'Cantaso', 'Accident', 'Other']}
                                    value={formData.callSource || ''}
                                    onInputChange={(_: React.SyntheticEvent, newInputValue: string) => handleChange('callSource', newInputValue || '')}
                                    onChange={(_: React.SyntheticEvent, newValue: string | null) => handleChange('callSource', newValue || '')}
                                    renderInput={(params: any) => (
                                        <TextField
                                            {...params}
                                            label="Call Source"
                                            required
                                            placeholder="Select Source"
                                            variant="outlined"
                                            error={!!validationErrors.callSource}
                                            helperText={validationErrors.callSource ? "This field is required" : ""}
                                            InputLabelProps={{
                                                shrink: true,
                                                className: `block text-sm font-medium ${validationErrors.callSource ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'} mb-2 relative transform-none top-auto left-auto`
                                            }}
                                            InputProps={{
                                                ...params.InputProps,
                                                className: `w-full px-4 py-1 rounded-xl transition-all duration-200 !bg-white !text-gray-900 border-2 ${validationErrors.callSource ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} focus-within:border-primary-main focus-within:ring-2 focus-within:ring-primary-main/20`,
                                                style: { padding: '9px 16px' }
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                                '& .MuiInputLabel-root': { position: 'static', marginBottom: '8px', pointerEvents: 'auto', userSelect: 'text' },
                                                '& .MuiFormLabel-asterisk': { color: '#ef4444' },
                                                '& .MuiInputBase-input': {
                                                    backgroundColor: 'white !important',
                                                    color: '#111827 !important',
                                                    WebkitTextFillColor: '#111827 !important'
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CustomInput
                                    label="Call Sub-source"
                                    select
                                    value={formData.callSubSource}
                                    onChange={(e: any) => handleChange('callSubSource', e.target.value)}
                                    placeholder="Select Sub-source"
                                    required
                                >
                                    <option value="TEST">PRUEBA</option>
                                    <option value="TEST2">TEST</option>
                                </CustomInput>
                            </Grid>
                        </>
                    )}

                    {/* Row 2: First Name & Last Name */}
                    <Grid item xs={12} md={6}>
                        <Tooltip title="Hi, how are you? My name is _____ What is your first name?" placement="top">
                            <Box>
                                <CustomInput
                                    label="First Name"
                                    placeholder="First Name"
                                    value={isPerson2OrMore ? (globalFormData.persons?.[activePerson]?.firstName || '') : (formData.firstName || '')}
                                    onChange={(e: any) => handleChange('firstName', e.target.value)}
                                    required
                                    error={!!validationErrors.firstName}
                                    helperText={validationErrors.firstName ? "First Name is required" : ""}
                                />
                            </Box>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Tooltip title="And what is your last name?" placement="top">
                            <Box>
                                <CustomInput
                                    label="Last Name"
                                    placeholder="Last Name"
                                    value={isPerson2OrMore ? (globalFormData.persons?.[activePerson]?.lastName || '') : (formData.lastName || '')}
                                    onChange={(e: any) => handleChange('lastName', e.target.value)}
                                    required
                                    error={!!validationErrors.lastName}
                                    helperText={validationErrors.lastName ? "Last Name is required" : ""}
                                />
                            </Box>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <CustomInput
                            label="Phone Number"
                            placeholder="(123) 456-7890"
                            value={isPerson2OrMore ? (globalFormData.persons?.[activePerson]?.phoneNumber || '') : (formData.phoneNumber || '')}
                            onChange={(e: any) => handleChange('phoneNumber', e.target.value)}
                            required
                            error={!!validationErrors.phoneNumber}
                            helperText={validationErrors.phoneNumber ? "Phone Number is required" : ""}
                        />
                    </Grid>

                    {/* Row 3: On Behalf Of - Only show for Person 1 */}
                    {!isPerson2OrMore && (
                        <Grid item xs={12}>
                            <label id="on-behalf-label" className={`block text-sm font-bold ${validationErrors.onBehalfOf ? 'text-red-500' : 'text-gray-900 dark:text-white'} mb-4`}>
                                Are you Calling on behalf of? <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div role="group" aria-labelledby="on-behalf-label" className={`grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl ${validationErrors.onBehalfOf ? 'border-2 border-red-100 bg-red-50' : ''}`}>
                                {BEHALF_OPTIONS.map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        control={
                                            <Checkbox
                                                checked={(formData.onBehalfOf || []).includes(option)}
                                                onChange={(e) => {
                                                    const currentOnBehalfOf = formData.onBehalfOf || [];
                                                    const newSelection = e.target.checked
                                                        ? [...currentOnBehalfOf, option]
                                                        : currentOnBehalfOf.filter((item: string) => item !== option);
                                                    handleChange('onBehalfOf', newSelection);
                                                }}
                                                icon={
                                                    <div className="w-5 h-5 border-[3px] border-[#EAB308] rounded-none bg-transparent" />
                                                }
                                                checkedIcon={
                                                    <div className="w-5 h-5 bg-[#EAB308] border-[3px] border-[#EAB308] rounded-none flex items-center justify-center">
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M2 6L4.5 8.5L9.5 3.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                }
                                                sx={{ padding: 0.5 }}
                                            />
                                        }
                                        label={<span className={`text-sm font-bold ${validationErrors.onBehalfOf ? 'text-red-700' : 'text-gray-700 dark:text-gray-200'}`}>{option}</span>}
                                        className="m-0"
                                    />
                                ))}
                            </div>
                            {validationErrors.onBehalfOf && (
                                <Typography variant="caption" className="text-red-500 mt-2 block">
                                    Please select at least one option
                                </Typography>
                            )}
                        </Grid>
                    )}

                    {/* Row 4: Minors - Only show for Person 1 */}
                    {!isPerson2OrMore && (formData.onBehalfOf || []).includes('Son/Daughter(Minor)') && (
                        <Grid item xs={12} md={6}>
                            <CustomInput
                                label="How many minors in the accident?"
                                type="number"
                                value={formData.minorsInAccident || ''}
                                onChange={(e: any) => handleChange('minorsInAccident', e.target.value)}
                            />
                        </Grid>
                    )}
                </Grid>
            </Box>

            {/* Row 5: Client Information (Conditional) - Only show for Person 1 */}
            {!isPerson2OrMore && (formData.onBehalfOf || []).some((r: string) => ['Legal Spouse', 'Son/Daughter', 'Son/Daughter(Minor)', 'Parent', 'Sibling', 'Friend', 'Other'].includes(r)) && (
                <>
                    <Typography variant="h2" className="font-extrabold text-black dark:text-white mt-12 md:mt-16 mb-8 md:mb-12 text-xl md:text-2xl">
                        Client information
                    </Typography>
                    <Box className="max-w-4xl mx-auto">
                        <Grid container spacing={6}>
                            <Grid item xs={12} md={6}>
                                <CustomInput
                                    label="Client First Name"
                                    value={formData.clientFirstName || ''}
                                    onChange={(e: any) => handleChange('clientFirstName', e.target.value)}
                                    required
                                    error={!!validationErrors.clientFirstName}
                                    helperText={validationErrors.clientFirstName ? "Client First Name is required" : ""}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CustomInput
                                    label="Client Last Name"
                                    value={formData.clientLastName || ''}
                                    onChange={(e: any) => handleChange('clientLastName', e.target.value)}
                                    required
                                    error={!!validationErrors.clientLastName}
                                    helperText={validationErrors.clientLastName ? "Client Last Name is required" : ""}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CustomInput
                                    label="Client Phone Number"
                                    value={formData.clientPhone || ''}
                                    onChange={(e: any) => handleChange('clientPhone', e.target.value)}
                                    required
                                    placeholder="(123) 456-7890"
                                    error={!!validationErrors.clientPhone}
                                    helperText={validationErrors.clientPhone ? "Client Phone Number is required" : ""}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}

            <Box className="max-w-4xl mx-auto">
                <Grid container spacing={6}>
                    {/* Navigation Buttons */}
                    <Grid item xs={12}>
                        <Box className="mt-12 mb-24 flex justify-end">
                            <Button
                                variant="contained"
                                onClick={nextStep}
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
                                    minWidth: '120px',
                                    height: '40px',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    '&:hover': {
                                        backgroundColor: '#FCD34D !important',
                                        boxShadow: '0 4px 8px rgba(234, 179, 8, 0.4)',
                                    },
                                    '&.MuiButton-contained': {
                                        backgroundColor: '#EAB308 !important',
                                    },
                                    '&.MuiButton-root': {
                                        backgroundColor: '#EAB308 !important',
                                    }
                                }}
                            >
                                Continue
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
