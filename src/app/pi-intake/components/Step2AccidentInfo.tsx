
import { Box, Typography, Grid, FormControlLabel, RadioGroup, Radio, Button, FormHelperText } from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';
import { CustomInput } from '@/components/forms/CustomInput';
import { PIIntakeFormData, PIIntakeValidationErrors } from '@/lib/types/pi-intake';
import { useGoogleAddressAutocomplete } from '@/hooks/useGoogleAddressAutocomplete';

interface Step2AccidentInfoProps {
    formData: PIIntakeFormData;
    handleChange: (field: keyof PIIntakeFormData, value: any) => void;
    validationErrors: PIIntakeValidationErrors;
    isLoaded: boolean;
    nextStep: () => void;
    prevStep: () => void;
    activePerson: number;
    setActivePerson: (person: number) => void;
    handlePersonChange: (personId: number, field: any, value: any) => void;
}

export default function Step2AccidentInfo({
    formData,
    handleChange,
    validationErrors,
    isLoaded,
    nextStep,
    prevStep,
    activePerson,
    setActivePerson: _setActivePerson,
    handlePersonChange
}: Step2AccidentInfoProps) {
    // const [activePerson, setActivePerson] = useState(1); - State lifted to parent

    // Helper to get current person data for person-specific fields
    const getPersonData = () => {
        if (activePerson === 1) return formData;
        return formData.persons?.[activePerson] || {};
    };

    const personData: any = getPersonData();

    // Helper to handle changes - routes to global handleChange or handlePersonChange based on field type or person
    const handleLocalChange = (field: string, value: any, isPersonSpecific: boolean = false) => {
        if (isPersonSpecific) {
            if (activePerson === 1) {
                // For Person 1, we still save to root fields for backward compatibility
                // but also rely on handlePersonChange to sync if needed.
                // Or simply use handleChange since it updates root.
                handleChange(field as keyof PIIntakeFormData, value);

                // Special logic: If Person 1 marks "Were you Driving the Vehicle?" as "yes",
                // automatically set "no" for all other persons
                if (field === 'drivingVehicle' && value === 'yes') {
                    const numPersons = parseInt(formData.numberOfPersonsInAccident || '1');
                    for (let i = 2; i <= numPersons; i++) {
                        handlePersonChange(i, 'drivingVehicle', 'no');
                    }
                }
            } else {
                handlePersonChange(activePerson, field, value);
            }
        } else {
            // Global field - always update root
            handleChange(field as keyof PIIntakeFormData, value);
        }
    };

    // Address Autocomplete Hook
    const { onLoad: onLoadAccidentLocation, onPlaceChanged: onPlaceChangedAccidentLocation } = useGoogleAddressAutocomplete((address) => {
        handleChange('accidentLocation', address);
    });

    // Open Google Maps Helper
    const openGoogleMaps = () => {
        if (!formData.accidentLocation) return;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.accidentLocation)}`;
        window.open(url, '_blank');
    };

    return (
        <>
            {/* Person Navigation Tabs - Handled in parent page.tsx */}

            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-8 md:mb-12 text-xl md:text-2xl">
                General Accident - Type of Accident
            </Typography>



            <Box className="max-w-4xl mx-auto">
                <Grid container spacing={4} className="mb-8">
                    {/* Question 1: Auto Accident */}
                    {/* Question 1: Auto Accident */}
                    <Grid item xs={12}>
                        <label id="auto-accident-label" className={`block text-sm font-bold ${validationErrors.involvedInAutoAccident ? 'text-red-500' : 'text-gray-900 dark:text-white'} mb-3`}>
                            Were you involved in an Automobile Accident? {validationErrors.involvedInAutoAccident && '*'}
                        </label>
                        <RadioGroup
                            aria-labelledby="auto-accident-label"
                            row
                            value={formData.involvedInAutoAccident || ''}
                            onChange={(e) => {
                                handleChange('involvedInAutoAccident', e.target.value);
                                if (e.target.value === 'no') {
                                    handleChange('numberOfPersonsInAccident', '1');
                                }
                            }}
                        >
                            <FormControlLabel
                                value="yes"
                                control={
                                    <Radio
                                        icon={
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="4" y="4" width="16" height="16" rx="2" stroke={validationErrors.involvedInAutoAccident ? '#ef4444' : '#D1D5DB'} strokeWidth="2" />
                                            </svg>
                                        }
                                        checkedIcon={
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        }
                                        sx={{ padding: '9px' }}
                                    />
                                }
                                label={<span className={`text-sm font-bold ${validationErrors.involvedInAutoAccident ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>Yes</span>}
                                className="mr-4 md:mr-8"
                            />
                            <FormControlLabel
                                value="no"
                                control={
                                    <Radio
                                        icon={
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="4" y="4" width="16" height="16" rx="2" stroke={validationErrors.involvedInAutoAccident ? '#ef4444' : '#D1D5DB'} strokeWidth="2" />
                                            </svg>
                                        }
                                        checkedIcon={
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        }
                                        sx={{ padding: '9px' }}
                                    />
                                }
                                label={<span className={`text-sm font-bold ${validationErrors.involvedInAutoAccident ? 'text-red-500' : 'text-gray-700 dark:text-gray-200'}`}>No</span>}
                            />
                        </RadioGroup>
                        {validationErrors.involvedInAutoAccident && <FormHelperText error>Please select an option</FormHelperText>}
                    </Grid>

                    {/* Script Card - Shown when Auto Accident is Yes */}
                    {formData.involvedInAutoAccident === 'yes' && (
                        <Grid item xs={12}>
                            <Box className="bg-white dark:bg-black rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-red-500 w-full">
                                <Typography className="text-red-500 font-extrabold text-2xl mb-4 uppercase tracking-wide">
                                    OH MY GOD!
                                </Typography>
                                <Typography className="text-red-500 text-xl font-semibold leading-relaxed">
                                    &quot;Mr./Ms. {formData.lastName || '[Last Name]'}, I’m truly sorry you went through such an accident. Our priority is to assist you by connecting you with one of our experienced lawyers who can help with your case. In order to proceed, I’ll need to ask you a few questions about the accident so that we can provide you with the best possible assistance. Would that be okay?&quot;
                                </Typography>
                            </Box>
                        </Grid>
                    )}

                    {/* Question: Accident at Work - Shown ONLY if Auto Accident is 'no' */}
                    {formData.involvedInAutoAccident === 'no' && (
                        <Grid item xs={12}>
                            <label id="accident-work-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                Did you have an Accident at Work?
                            </label>
                            <RadioGroup
                                aria-labelledby="accident-work-label"
                                row
                                value={formData.accidentAtWork || ''}
                                onChange={(e) => handleChange('accidentAtWork', e.target.value)}
                            >
                                <FormControlLabel
                                    value="yes"
                                    control={
                                        <Radio
                                            icon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                </svg>
                                            }
                                            checkedIcon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }
                                            sx={{ padding: '9px' }}
                                        />
                                    }
                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                    className="mr-8"
                                />
                                <FormControlLabel
                                    value="no"
                                    control={
                                        <Radio
                                            icon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                </svg>
                                            }
                                            checkedIcon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }
                                            sx={{ padding: '9px' }}
                                        />
                                    }
                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                />
                            </RadioGroup>
                        </Grid>
                    )}

                    {/* Question 3: Malpractice - Shown ONLY if Auto Accident is 'no' AND Work Accident is 'no' */}

                    {formData.involvedInAutoAccident === 'no' && formData.accidentAtWork === 'no' && (
                        <Grid item xs={12}>
                            <label id="malpractice-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                Were you Affected by possible Malpractice?
                            </label>
                            <RadioGroup
                                aria-labelledby="malpractice-label"
                                row
                                value={formData.affectedByMalpractice || ''}
                                onChange={(e) => handleChange('affectedByMalpractice', e.target.value)}
                            >
                                <FormControlLabel
                                    value="yes"
                                    control={
                                        <Radio
                                            icon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                </svg>
                                            }
                                            checkedIcon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }
                                            sx={{ padding: '9px' }}
                                        />
                                    }
                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                    className="mr-8"
                                />
                                <FormControlLabel
                                    value="no"
                                    control={
                                        <Radio
                                            icon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                </svg>
                                            }
                                            checkedIcon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }
                                            sx={{ padding: '9px' }}
                                        />
                                    }
                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                />
                            </RadioGroup>
                        </Grid>
                    )}

                    {/* Question 2: Slip or Fall - Shown ONLY if Malpractice is 'no' */}
                    {formData.involvedInAutoAccident === 'no' && formData.accidentAtWork === 'no' && formData.affectedByMalpractice === 'no' && (
                        <Grid item xs={12}>
                            <label id="slip-fall-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                Did you get Injured by a Slip or Fall Accident?
                            </label>
                            <RadioGroup
                                aria-labelledby="slip-fall-label"
                                row
                                value={formData.injuredBySlipFall || ''}
                                onChange={(e) => handleChange('injuredBySlipFall', e.target.value)}
                            >
                                <FormControlLabel
                                    value="yes"
                                    control={
                                        <Radio
                                            icon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                </svg>
                                            }
                                            checkedIcon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }
                                            sx={{ padding: '9px' }}
                                        />
                                    }
                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                    className="mr-8"
                                />
                                <FormControlLabel
                                    value="no"
                                    control={
                                        <Radio
                                            icon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                </svg>
                                            }
                                            checkedIcon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }
                                            sx={{ padding: '9px' }}
                                        />
                                    }
                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                />
                            </RadioGroup>
                        </Grid>
                    )}

                    {/* Question 4: Other - Shown ONLY if Slip/Fall is 'no' */}
                    {formData.involvedInAutoAccident === 'no' && formData.accidentAtWork === 'no' && formData.affectedByMalpractice === 'no' && formData.injuredBySlipFall === 'no' && (
                        <Grid item xs={12}>
                            <label id="other-accident-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                Other type of accident?
                            </label>
                            <RadioGroup
                                aria-labelledby="other-accident-label"
                                row
                                value={formData.otherAccidentType || ''}
                                onChange={(e) => handleChange('otherAccidentType', e.target.value)}
                            >
                                <FormControlLabel
                                    value="yes"
                                    control={
                                        <Radio
                                            icon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                </svg>
                                            }
                                            checkedIcon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }
                                            sx={{ padding: '9px' }}
                                        />
                                    }
                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                    className="mr-8"
                                />
                                <FormControlLabel
                                    value="no"
                                    control={
                                        <Radio
                                            icon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                </svg>
                                            }
                                            checkedIcon={
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }
                                            sx={{ padding: '9px' }}
                                        />
                                    }
                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                />
                            </RadioGroup>
                        </Grid>
                    )}

                    {/* How Can I Help You - Shown ONLY if ALL previous are 'no' */}
                    {formData.involvedInAutoAccident === 'no' &&
                        formData.accidentAtWork === 'no' &&
                        formData.affectedByMalpractice === 'no' &&
                        formData.injuredBySlipFall === 'no' &&
                        formData.otherAccidentType === 'no' && (
                            <Grid item xs={12}>
                                <CustomInput
                                    label="How Can I Help you Today?"
                                    multiline
                                    rows={4}
                                    value={formData.howCanIHelpDescription || ''}
                                    onChange={(e: any) => handleChange('howCanIHelpDescription', e.target.value)}
                                />
                            </Grid>
                        )}
                </Grid>
            </Box>

            {/* Auto Accident Specific Details (and Work Accident Details) */}
            {(formData.involvedInAutoAccident === 'yes' || formData.accidentAtWork === 'yes') && (
                <>
                    <Box className="max-w-4xl mx-auto">
                        {/* Date/Time Card */}
                        <Box className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 mb-8 shadow-sm border border-gray-100 dark:border-gray-700">
                            <Typography variant="h6" className="font-extrabold text-[#EAB308] text-lg mb-4">
                                General Accident - Date/Time
                            </Typography>
                            <Typography className="text-black dark:text-white font-semibold mb-6 text-lg">
                                <span className="text-[#EAB308]">ASK:</span> What is the EXACT Date of the Accident, starting with the Month, Day and Year?
                            </Typography>
                            <Box className="max-w-md">
                                <CustomInput
                                    label=""
                                    type="date"
                                    value={formData.accidentDate || ''}
                                    disabled={activePerson > 1}
                                    onChange={(e: any) => {
                                        const newValue = e.target.value;
                                        handleChange('accidentDate', newValue);

                                        if (newValue) {
                                            const parts = newValue.split('-');
                                            // Use UTC to avoid DST issues and timezone weirdness for just calculating day difference
                                            const selectedDate = Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                                            const today = new Date();
                                            const todayMidnight = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

                                            const diffTime = todayMidnight - selectedDate;
                                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                                            handleChange('daysSinceAccident', (diffDays >= 0 ? diffDays : 0).toString());
                                        } else {
                                            handleChange('daysSinceAccident', '');
                                        }
                                    }}
                                    onClick={(e: any) => {
                                        if (activePerson > 1) return;
                                        try {
                                            if (e.currentTarget.showPicker) {
                                                e.currentTarget.showPicker();
                                            }
                                        } catch (error) {
                                            console.error('Error opening date picker:', error);
                                        }
                                    }}
                                    max={new Date().toISOString().split('T')[0]}
                                    error={!!validationErrors.accidentDate}
                                    helperText={validationErrors.accidentDate ? "Accident Date is required" : ""}
                                />
                            </Box>
                        </Box>

                        <Grid container spacing={6} className="mb-12">
                            <Grid item xs={12} md={6}>
                                <CustomInput
                                    label="Days since accident"
                                    type="number"
                                    value={formData.daysSinceAccident || ''}
                                    disabled
                                    onChange={() => { }} // No-op as it is disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <CustomInput
                                    label="In Which State did the Accident Occur?"
                                    select
                                    value={formData.accidentState || ''}
                                    disabled={activePerson > 1}
                                    onChange={(e: any) => handleChange('accidentState', e.target.value)}
                                >
                                    <option value="NY">New York</option>
                                    <option value="NJ">New Jersey</option>
                                    {/* Add more states as needed */}
                                </CustomInput>
                            </Grid>
                        </Grid>

                        {/* Vehicle Accident Questions - Only for Auto Accident */}
                        {formData.involvedInAutoAccident === 'yes' && (
                            <>
                                <Typography variant="h5" className="font-extrabold text-black dark:text-white mb-6 uppercase text-base sm:text-lg">
                                    General Accident - Vehicle Accident Questions
                                </Typography>

                                <Grid container spacing={6}>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="How many persons in the Accident?"
                                            select
                                            value={formData.numberOfPersonsInAccident || ''}
                                            disabled={activePerson > 1}
                                            onChange={(e: any) => handleChange('numberOfPersonsInAccident', e.target.value)}
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                        </CustomInput>
                                    </Grid>
                                </Grid>

                                {/* Determine Role Card */}
                                <Box className="bg-white dark:bg-gray-800 rounded-3xl p-8 my-8 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <Typography variant="h6" className="font-extrabold text-[#EAB308] dark:text-[#EAB308] text-lg mb-4">
                                        Determine the Role of the Person in the Auto Accident
                                    </Typography>
                                    <Typography className="text-black dark:text-white font-medium text-lg">
                                        <span className="text-[#EAB308]">ASK:</span> Were you Driving the Vehicle?
                                    </Typography>
                                </Box>

                                <Grid container spacing={4} className="mb-8">
                                    {/* Driving Vehicle */}
                                    <Grid item xs={12} md={6}>
                                        <label id="driving-vehicle-label" className={`block text-sm font-bold ${validationErrors.drivingVehicle ? 'text-red-500' : 'text-gray-900 dark:text-white'} mb-3`}>
                                            Were you Driving the Vehicle? {validationErrors.drivingVehicle && '*'}
                                        </label>
                                        <RadioGroup
                                            aria-labelledby="driving-vehicle-label"
                                            row
                                            value={personData.drivingVehicle || ''}
                                            onChange={(e) => handleLocalChange('drivingVehicle', e.target.value, true)}
                                        >
                                            <FormControlLabel
                                                value="yes"
                                                control={
                                                    <Radio
                                                        disabled={activePerson > 1 && formData.drivingVehicle === 'yes'}
                                                        icon={
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                            </svg>
                                                        }
                                                        checkedIcon={
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        }
                                                        sx={{ padding: '9px' }}
                                                    />
                                                }
                                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                className="mr-8"
                                            />
                                            <FormControlLabel
                                                value="no"
                                                control={
                                                    <Radio
                                                        disabled={activePerson > 1 && formData.drivingVehicle === 'yes'}
                                                        icon={
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                            </svg>
                                                        }
                                                        checkedIcon={
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        }
                                                        sx={{ padding: '9px' }}
                                                    />
                                                }
                                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                            />
                                        </RadioGroup>
                                        {validationErrors.drivingVehicle && <FormHelperText error>Please select an option</FormHelperText>}
                                    </Grid>

                                    {/* Working at time - Person Specific */}
                                    <Grid item xs={12} md={6}>
                                        <label id="working-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                            Were You Working at the time of the Accident?
                                        </label>
                                        <RadioGroup
                                            aria-labelledby="working-label"
                                            row
                                            value={personData.workingAtTime || ''}
                                            onChange={(e) => handleLocalChange('workingAtTime', e.target.value, true)}
                                        >
                                            <FormControlLabel
                                                value="yes"
                                                control={
                                                    <Radio
                                                        icon={
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                            </svg>
                                                        }
                                                        checkedIcon={
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        }
                                                        sx={{ padding: '9px' }}
                                                    />
                                                }
                                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                className="mr-8"
                                            />
                                            <FormControlLabel
                                                value="no"
                                                control={
                                                    <Radio
                                                        icon={
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" />
                                                            </svg>
                                                        }
                                                        checkedIcon={
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" />
                                                                <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        }
                                                        sx={{ padding: '9px' }}
                                                    />
                                                }
                                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                            />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                            </>
                        )}

                        {/* Description Card */}
                        <Box className="bg-white dark:bg-gray-800 rounded-3xl p-8 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <Typography className="text-black dark:text-white font-medium text-lg">
                                <span className="text-[#EAB308]">ASK:</span> Can you BRIEFLY Describe how the Accident Ocurred?
                            </Typography>
                        </Box>

                        <Box className="mb-8">
                            <CustomInput
                                label={formData.involvedInAutoAccident === 'yes' ? 'Description' : (formData.accidentAtWork === 'yes' ? 'Description of the accident' : 'Description')}
                                multiline
                                rows={4}
                                value={formData.accidentDescription || ''}
                                onChange={(e: any) => handleChange('accidentDescription', e.target.value)}
                            />
                        </Box>

                        {/* Script for Workplace Accident */}
                        {formData.accidentAtWork === 'yes' && (
                            <Box className="bg-white dark:bg-black rounded-3xl p-10 mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-red-400 max-w-4xl mx-auto">
                                <Typography className="text-red-500 text-xl font-semibold leading-relaxed">
                                    &quot;I’m very sorry to hear about your accident. From what you’ve described, I understand how you must be feeling right now. But please don’t worry—here at (Firm Name) we have an extensive network of attorneys with over 30 years of experience handling cases just like yours. We will assign the attorney who best specializes in your case.&quot;
                                </Typography>
                            </Box>
                        )}

                        {/* Location Card */}
                        <Box className="bg-white dark:bg-gray-800 rounded-3xl p-8 mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <Typography className="text-black dark:text-white font-medium text-lg">
                                <span className="text-[#EAB308]">ASK:</span> What is the CLOSEST Intersection or cross-streets to where the Accident happened?
                            </Typography>
                        </Box>

                        <Box className="mb-8">
                            <label className={`block text-sm font-bold mb-2 ${validationErrors.accidentLocation ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                Accident Address
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            {isLoaded && (
                                <Autocomplete onLoad={onLoadAccidentLocation} onPlaceChanged={onPlaceChangedAccidentLocation}>
                                    <input
                                        type="text"
                                        value={formData.accidentLocation || ''}
                                        onChange={(e) => {
                                            handleChange('accidentLocation', e.target.value);
                                        }}
                                        placeholder=""
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-base !text-gray-900 !bg-white
                                                ${validationErrors.accidentLocation ? 'border-red-500 focus:border-red-600' : 'border-gray-200 dark:border-gray-700 focus:border-primary-main'}
                                                focus:outline-none focus:ring-2 focus:ring-primary-main/20
                                                disabled:bg-gray-100 dark:disabled:bg-gray-900 placeholder:text-gray-400`}
                                    />
                                </Autocomplete>
                            )}
                            {validationErrors.accidentLocation && (
                                <Typography variant="caption" className="text-red-500 mt-2 block">
                                    This field is required
                                </Typography>
                            )}

                            {formData.accidentLocation && (
                                <Box className="mt-3 flex justify-end">
                                    <Button
                                        variant="contained"
                                        onClick={openGoogleMaps}
                                        size="medium"
                                        startIcon={
                                            <svg className="w-5 h-5" fill="none" stroke="#FFFFFF" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        }
                                        sx={{
                                            minWidth: '180px',
                                            height: '40px',
                                            backgroundColor: '#6D6D6D !important',
                                            color: '#FFFFFF !important',
                                            border: '2px solid #4A4A4A',
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            paddingLeft: '24px !important',
                                            paddingRight: '24px !important',
                                            paddingTop: '12px !important',
                                            paddingBottom: '12px !important',
                                            fontSize: '0.95rem',
                                            fontWeight: 600,
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                            transition: 'all 0.3s ease',
                                            '& .MuiButton-startIcon': {
                                                color: '#FFFFFF !important',
                                            },
                                            '&:hover': {
                                                backgroundColor: '#4A4A4A !important',
                                                borderColor: '#2D2D2D',
                                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:active': {
                                                transform: 'translateY(0)',
                                                boxShadow: '0 2px 8px rgba(199, 157, 157, 0.3), inset 0 1px 0 rgba(255, 252, 252, 0.1)',
                                            },
                                        }}
                                    >
                                        Google Maps
                                    </Button>
                                </Box>
                            )}
                        </Box>

                    </Box>

                    {/* Police & Ambulance Information - For Workplace OR Auto Accident */}

                    {(formData.accidentAtWork === 'yes' || formData.involvedInAutoAccident === 'yes') && (
                        <>
                            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-8 text-2xl">
                                Police information
                            </Typography>
                            <Box className="max-w-4xl mx-auto mb-12">
                                <Box className="mb-8">
                                    <label id="police-called-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                        Were the Police Called?
                                    </label>
                                    <RadioGroup
                                        aria-labelledby="police-called-label"
                                        row
                                        value={formData.policeCalled || ''}
                                        onChange={(e) => handleChange('policeCalled', e.target.value)}
                                    >
                                        <FormControlLabel
                                            value="yes"
                                            control={
                                                <Radio
                                                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                    checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                    sx={{ padding: '9px' }}
                                                />
                                            }
                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                            className="mr-8"
                                        />
                                        <FormControlLabel
                                            value="no"
                                            control={
                                                <Radio
                                                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                    checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                    sx={{ padding: '9px' }}
                                                />
                                            }
                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                        />
                                    </RadioGroup>
                                    {formData.policeCalled === 'yes' && (
                                        <Box className="mt-4">
                                            <label id="police-arrived-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                Did the Police Arrive at the Scene?
                                            </label>
                                            <RadioGroup
                                                aria-labelledby="police-arrived-label"
                                                row
                                                value={formData.policeArrivedAtScene || ''}
                                                onChange={(e) => handleChange('policeArrivedAtScene', e.target.value)}
                                            >
                                                <FormControlLabel
                                                    value="yes"
                                                    control={
                                                        <Radio
                                                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                            checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                            sx={{ padding: '9px' }}
                                                        />
                                                    }
                                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                    className="mr-8"
                                                />
                                                <FormControlLabel
                                                    value="no"
                                                    control={
                                                        <Radio
                                                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                            checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                            sx={{ padding: '9px' }}
                                                        />
                                                    }
                                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                                />
                                            </RadioGroup>
                                            {formData.policeArrivedAtScene === 'yes' && (
                                                <Box className="mt-4">
                                                    <label id="police-report-filed-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                        Did the Police file a Police Report (MV104S)?
                                                    </label>
                                                    <RadioGroup
                                                        aria-labelledby="police-report-filed-label"
                                                        row
                                                        value={formData.policeReportFiled || ''}
                                                        onChange={(e) => handleChange('policeReportFiled', e.target.value)}
                                                    >
                                                        <FormControlLabel
                                                            value="yes"
                                                            control={
                                                                <Radio
                                                                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                                    checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                    sx={{ padding: '9px' }}
                                                                />
                                                            }
                                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                            className="mr-8"
                                                        />
                                                        <FormControlLabel
                                                            value="no"
                                                            control={
                                                                <Radio
                                                                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                                    checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                    sx={{ padding: '9px' }}
                                                                />
                                                            }
                                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                                        />
                                                    </RadioGroup>

                                                    {formData.policeReportFiled === 'yes' && (
                                                        <Box className="mt-4">
                                                            <label id="police-copy-obtained-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                                Did you get a copy of the Police report?
                                                            </label>
                                                            <RadioGroup
                                                                aria-labelledby="police-copy-obtained-label"
                                                                row
                                                                value={formData.policeReportCopyObtained || ''}
                                                                onChange={(e) => handleChange('policeReportCopyObtained', e.target.value)}
                                                            >
                                                                <FormControlLabel
                                                                    value="yes"
                                                                    control={
                                                                        <Radio
                                                                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                                            checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                            sx={{ padding: '9px' }}
                                                                        />
                                                                    }
                                                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                                    className="mr-8"
                                                                />
                                                                <FormControlLabel
                                                                    value="no"
                                                                    control={
                                                                        <Radio
                                                                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                                            checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                            sx={{ padding: '9px' }}
                                                                        />
                                                                    }
                                                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                                                />
                                                            </RadioGroup>
                                                            {formData.policeReportCopyObtained === 'yes' && (
                                                                <Box className="mt-4">
                                                                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                                        Attach File Police Report
                                                                    </label>
                                                                    <Button
                                                                        component="label"
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        sx={{
                                                                            justifyContent: 'flex-start',
                                                                            textTransform: 'none',
                                                                            color: formData.policeReportFile ? '#111827' : '#6B7280',
                                                                            borderColor: '#D1D5DB',
                                                                            backgroundColor: 'white',
                                                                            padding: '12px 16px',
                                                                            borderRadius: '0.5rem',
                                                                            fontWeight: 400,
                                                                            fontSize: '0.875rem',
                                                                            '&:hover': {
                                                                                backgroundColor: '#F9FAFB',
                                                                                borderColor: '#D1D5DB',
                                                                            },
                                                                            '.dark &': {
                                                                                backgroundColor: '#374151',
                                                                                borderColor: '#4B5563',
                                                                                color: formData.policeReportFile ? '#F9FAFB' : '#9CA3AF',
                                                                            }
                                                                        }}
                                                                        startIcon={<span className="text-xl leading-none mr-2 font-light text-gray-400">+</span>}
                                                                    >
                                                                        {formData.policeReportFile ? formData.policeReportFile : 'Choose a file'}
                                                                        <input
                                                                            type="file"
                                                                            hidden
                                                                            onChange={(e) => {
                                                                                const file = e.target.files?.[0];
                                                                                if (file) {
                                                                                    handleChange('policeReportFile', file.name);
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Button>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    )}

                                                    {formData.policeReportFiled === 'no' && (
                                                        <Box className="mt-4">
                                                            <label id="police-filed-precinct-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                                Did you file a Police report at the Precinct (MV104)?
                                                            </label>
                                                            <RadioGroup
                                                                aria-labelledby="police-filed-precinct-label"
                                                                row
                                                                value={formData.policeReportFiledAtPrecinct || ''}
                                                                onChange={(e) => handleChange('policeReportFiledAtPrecinct', e.target.value)}
                                                            >
                                                                <FormControlLabel
                                                                    value="yes"
                                                                    control={
                                                                        <Radio
                                                                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                                            checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                            sx={{ padding: '9px' }}
                                                                        />
                                                                    }
                                                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                                    className="mr-8"
                                                                />
                                                                <FormControlLabel
                                                                    value="no"
                                                                    control={
                                                                        <Radio
                                                                            icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                                            checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                                            sx={{ padding: '9px' }}
                                                                        />
                                                                    }
                                                                    label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                                                />
                                                            </RadioGroup>
                                                        </Box>
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-8 text-xl md:text-2xl">
                                Ambulance information
                            </Typography>
                            <Box className="max-w-4xl mx-auto mb-12">
                                <Box className="mb-8">
                                    <label id="ambulance-called-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                        Was the Ambulance Called?
                                    </label>
                                    <RadioGroup
                                        aria-labelledby="ambulance-called-label"
                                        row
                                        value={formData.ambulanceCalled || ''}
                                        onChange={(e) => handleChange('ambulanceCalled', e.target.value)}
                                    >
                                        <FormControlLabel
                                            value="yes"
                                            control={
                                                <Radio
                                                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                    checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                    sx={{ padding: '9px' }}
                                                />
                                            }
                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                            className="mr-8"
                                        />
                                        <FormControlLabel
                                            value="no"
                                            control={
                                                <Radio
                                                    icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#D1D5DB" strokeWidth="2" /></svg>}
                                                    checkedIcon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="2" fill="#EAB308" /><path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                                    sx={{ padding: '9px' }}
                                                />
                                            }
                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                        />
                                    </RadioGroup>
                                </Box>
                            </Box>
                        </>
                    )}

                </>
            )}

            <Box className="max-w-4xl mx-auto">
                <Box className="mt-12 mb-24 flex justify-between items-center">
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
            </Box>
        </>
    );
}
