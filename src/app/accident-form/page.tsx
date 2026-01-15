'use client';

import { useState, useCallback, useRef } from 'react';
import {
    Container,
    Box,
    Card,
    CardContent,
    Button,
    Typography,
    Alert,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Checkbox,
    Grid,
} from '@mui/material';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

// Organized imports
import { CustomInput } from '@/components/forms/CustomInput';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES, ACCIDENT_TYPES, BOROUGHS } from '@/lib/constants/accident-form';
import { AccidentFormData, ValidationErrors } from '@/lib/types/accident-form';
import { validateAccidentForm, getInitialFormData } from '@/lib/utils/form-validation';

export default function AccidentFormPage() {
    const [formData, setFormData] = useState<AccidentFormData>(getInitialFormData());
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;

        // Configure autocomplete to search for all types of places
        autocomplete.setOptions({
            types: ['establishment', 'geocode'], // Search for businesses AND addresses
            fields: ['formatted_address', 'name', 'place_id', 'geometry'], // Get detailed info
        });
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();

            // Prefer formatted_address, but include name if it's an establishment
            let addressText = '';
            if (place.name && place.formatted_address) {
                // If it's a business/establishment, include the name
                addressText = `${place.name}, ${place.formatted_address}`;
            } else if (place.formatted_address) {
                addressText = place.formatted_address;
            } else if (place.name) {
                addressText = place.name;
            }

            if (addressText) {
                setFormData(prev => ({ ...prev, address: addressText }));
                // Clear address validation error when a valid address is selected
                setValidationErrors(prev => ({ ...prev, address: false }));
            }
        }
    }, []);

    const handlePersonsChange = (value: string) => {
        setFormData(prev => {
            const newPersons = prev.numberOfPersons.includes(value)
                ? prev.numberOfPersons.filter(p => p !== value)
                : [...prev.numberOfPersons, value];
            return { ...prev, numberOfPersons: newPersons };
        });
    };

    const openGoogleMaps = () => {
        if (formData.address) {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`;
            window.open(url, '_blank');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Reset validation errors
        const errors: { [key: string]: boolean } = {};

        // Validación de campos requeridos
        if (!formData.firstName) {
            errors.firstName = true;
        }
        if (!formData.lastName) {
            errors.lastName = true;
        }
        if (!formData.accidentType) {
            errors.accidentType = true;
        }
        if (!formData.dateOfBirth) {
            errors.dateOfBirth = true;
        }
        if (!formData.hasEmergencyContact) {
            errors.hasEmergencyContact = true;
        }
        if (!formData.address) {
            errors.address = true;
        }

        // Si hay errores, mostrarlos y detener el envío
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/accident-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setError('');
                setValidationErrors({});
                console.log('Form submitted successfully:', data);

                // Limpiar el formulario después de 2 segundos
                setTimeout(() => {
                    setFormData({
                        firstName: '',
                        lastName: '',
                        accidentType: '',
                        dateOfBirth: '',
                        hasEmergencyContact: '',
                        numberOfPersons: [],
                        address: '',
                        description: '',
                        borough: '',
                        year: '',
                    });
                    setSuccess(false);
                }, 2000);
            } else {
                setError(data.error?.message || 'Failed to submit form');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
            console.error('Error submitting form:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 py-6 sm:py-8 lg:py-12">
                <Container maxWidth="lg" className="px-4 sm:px-6">
                    <Card className="shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden bg-white border-0">
                        <CardContent className="p-4 sm:p-6 lg:p-10">
                            {error && (
                                <Alert
                                    severity="error"
                                    className="mb-8 rounded-2xl border-2 border-red-200"
                                    sx={{
                                        backgroundColor: '#FEE2E2',
                                        '& .MuiAlert-icon': { color: '#DC2626' }
                                    }}
                                >
                                    <strong>Error:</strong> {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert
                                    severity="success"
                                    className="mb-8 rounded-2xl border-2 border-green-200"
                                    sx={{
                                        backgroundColor: '#D1FAE5',
                                        '& .MuiAlert-icon': { color: '#059669' }
                                    }}
                                >
                                    <strong>Success!</strong> Form submitted successfully!
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                                {/* First Name & Last Name */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="First name"
                                            value={formData.firstName}
                                            onChange={(e: any) => {
                                                setFormData({ ...formData, firstName: e.target.value });
                                                setValidationErrors(prev => ({ ...prev, firstName: false }));
                                            }}
                                            required
                                            error={validationErrors.firstName}
                                            helperText={validationErrors.firstName ? 'This field is required' : ''}
                                            placeholder="First name"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="Last name"
                                            value={formData.lastName}
                                            onChange={(e: any) => {
                                                setFormData({ ...formData, lastName: e.target.value });
                                                setValidationErrors(prev => ({ ...prev, lastName: false }));
                                            }}
                                            required
                                            error={validationErrors.lastName}
                                            helperText={validationErrors.lastName ? 'This field is required' : ''}
                                            placeholder="Last name"
                                        />
                                    </Grid>
                                </Grid>

                                {/* Type of Accident & Date of Birth */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="Type of accident"
                                            value={formData.accidentType}
                                            onChange={(e: any) => {
                                                setFormData({ ...formData, accidentType: e.target.value });
                                                setValidationErrors(prev => ({ ...prev, accidentType: false }));
                                            }}
                                            required
                                            error={validationErrors.accidentType}
                                            helperText={validationErrors.accidentType ? 'This field is required' : ''}
                                            select
                                        >
                                            {ACCIDENT_TYPES.map((type: string) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </CustomInput>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="What is your date of birth?"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e: any) => {
                                                setFormData({ ...formData, dateOfBirth: e.target.value });
                                                setValidationErrors(prev => ({ ...prev, dateOfBirth: false }));
                                            }}
                                            required
                                            error={validationErrors.dateOfBirth}
                                            helperText={validationErrors.dateOfBirth ? 'This field is required' : ''}
                                        />
                                    </Grid>
                                </Grid>

                                {/* Emergency Contact & Number of Persons */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <FormControl component="fieldset" className="w-full" error={validationErrors.hasEmergencyContact}>
                                            <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-3">
                                                Do you have an emergency contact that you would like to share?
                                                <span className="text-red-500 ml-1">*</span>
                                            </FormLabel>
                                            <RadioGroup
                                                row
                                                value={formData.hasEmergencyContact}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, hasEmergencyContact: e.target.value });
                                                    setValidationErrors(prev => ({ ...prev, hasEmergencyContact: false }));
                                                }}
                                                className="gap-4"
                                            >
                                                <FormControlLabel
                                                    value="yes"
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                color: validationErrors.hasEmergencyContact ? '#EF4444' : '#D1D1D1',
                                                                '&.Mui-checked': { color: '#6D6D6D' },
                                                                '& .MuiSvgIcon-root': { fontSize: 24 }
                                                            }}
                                                        />
                                                    }
                                                    label={<span className="text-base font-medium">Yes</span>}
                                                    sx={{
                                                        border: validationErrors.hasEmergencyContact ? '2px solid #EF4444' : '2px solid #E5E7EB',
                                                        borderRadius: '12px',
                                                        px: 3,
                                                        py: 1,
                                                        m: 0,
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            borderColor: validationErrors.hasEmergencyContact ? '#DC2626' : '#6D6D6D',
                                                            backgroundColor: '#F9FAFB'
                                                        }
                                                    }}
                                                />
                                                <FormControlLabel
                                                    value="no"
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                color: validationErrors.hasEmergencyContact ? '#EF4444' : '#D1D1D1',
                                                                '&.Mui-checked': { color: '#6D6D6D' },
                                                                '& .MuiSvgIcon-root': { fontSize: 24 }
                                                            }}
                                                        />
                                                    }
                                                    label={<span className="text-base font-medium">No</span>}
                                                    sx={{
                                                        border: validationErrors.hasEmergencyContact ? '2px solid #EF4444' : '2px solid #E5E7EB',
                                                        borderRadius: '12px',
                                                        px: 3,
                                                        py: 1,
                                                        m: 0,
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            borderColor: validationErrors.hasEmergencyContact ? '#DC2626' : '#6D6D6D',
                                                            backgroundColor: '#F9FAFB'
                                                        }
                                                    }}
                                                />
                                            </RadioGroup>
                                            {validationErrors.hasEmergencyContact && (
                                                <p className="mt-1 text-sm text-red-500">This field is required</p>
                                            )}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <FormControl component="fieldset" className="w-full">
                                            <FormLabel component="legend" className="text-sm font-medium text-gray-700 mb-3">
                                                How many persons in the Accident?<span className="text-red-500 ml-1">*</span>
                                            </FormLabel>
                                            <Box className="flex gap-4">
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formData.numberOfPersons.includes('1')}
                                                            onChange={() => handlePersonsChange('1')}
                                                            sx={{
                                                                color: '#EAB308',
                                                                '&.Mui-checked': { color: '#EAB308' },
                                                                '& .MuiSvgIcon-root': { fontSize: 24 },
                                                            }}
                                                        />
                                                    }
                                                    label={<span className="text-base font-medium">Type of accident</span>}
                                                    sx={{
                                                        border: '2px solid #EAB308',
                                                        borderRadius: '12px',
                                                        px: 3,
                                                        py: 1,
                                                        m: 0,
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            backgroundColor: '#FEF9E8'
                                                        }
                                                    }}
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formData.numberOfPersons.includes('2+')}
                                                            onChange={() => handlePersonsChange('2+')}
                                                            sx={{
                                                                color: '#EAB308',
                                                                '&.Mui-checked': { color: '#EAB308' },
                                                                '& .MuiSvgIcon-root': { fontSize: 24 },
                                                            }}
                                                        />
                                                    }
                                                    label={<span className="text-base font-medium">Type of accident</span>}
                                                    sx={{
                                                        border: '2px solid #EAB308',
                                                        borderRadius: '12px',
                                                        px: 3,
                                                        py: 1,
                                                        m: 0,
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            backgroundColor: '#FEF9E8'
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                {/* Address with Google Maps */}
                                <Box>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address<span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={GOOGLE_MAPS_LIBRARIES}>
                                        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, address: e.target.value });
                                                    setValidationErrors(prev => ({ ...prev, address: false }));
                                                }}
                                                placeholder="Address"
                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${validationErrors.address
                                                    ? 'border-red-500 focus:border-red-600 focus:ring-red-500/20'
                                                    : 'border-gray-200 focus:border-primary-main focus:ring-primary-main/20'
                                                    }`}
                                            />
                                        </Autocomplete>
                                    </LoadScript>
                                    {validationErrors.address && (
                                        <p className="mt-1 text-sm text-red-500">This field is required</p>
                                    )}
                                    {formData.address && (
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

                                {/* Description */}
                                <CustomInput
                                    label="Description"
                                    value={formData.description}
                                    onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                                    multiline
                                    rows={5}
                                    placeholder="Describe the accident in detail..."
                                />

                                {/* Borough & Year */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="Borough"
                                            value={formData.borough}
                                            onChange={(e: any) => setFormData({ ...formData, borough: e.target.value })}
                                            select
                                        >
                                            {BOROUGHS.map((borough: string) => (
                                                <option key={borough} value={borough}>
                                                    {borough}
                                                </option>
                                            ))}
                                        </CustomInput>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="Año"
                                            type="number"
                                            value={formData.year}
                                            onChange={(e: any) => setFormData({ ...formData, year: e.target.value })}
                                            placeholder="Año"
                                        />
                                    </Grid>
                                </Grid>

                                {/* Submit Button */}
                                <Box className="flex justify-end mt-4">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="medium"
                                        disabled={loading}
                                        fullWidth
                                        sx={{
                                            minWidth: { xs: '100%', sm: '180px' },
                                            height: { xs: '44px', sm: '40px' },
                                            backgroundColor: '#EAB308 !important',
                                            color: '#FFFFFF !important',
                                            fontWeight: 700,
                                            fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                            paddingLeft: { xs: '16px !important', sm: '24px !important' },
                                            paddingRight: { xs: '16px !important', sm: '24px !important' },
                                            paddingTop: { xs: '10px !important', sm: '12px !important' },
                                            paddingBottom: { xs: '10px !important', sm: '12px !important' },
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            boxShadow: '0 8px 24px rgba(234, 179, 8, 0.4)',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                backgroundColor: '#D97706 !important',
                                                boxShadow: '0 12px 32px rgba(234, 179, 8, 0.5)',
                                                transform: 'translateY(-2px)',
                                            },
                                            '&:disabled': {
                                                background: '#D1D1D1 !important',
                                                color: '#6D6D6D',
                                            },
                                        }}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Submitting...
                                            </span>
                                        ) : (
                                            'Submit Form'
                                        )}
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>

                    <Typography variant="caption" className="text-center block mt-8 text-white dark:text-gray-500">
                        © {new Date().getFullYear()} FR EXCALIBUR. All rights reserved.
                    </Typography>
                </Container>
            </div>
        </>
    );
}
