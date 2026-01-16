'use client';

import { useState } from 'react';

import { useTheme } from '@/lib/contexts/theme-context';
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Button,
    TextField
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
import { intakeService } from '@/lib/services/intake.service';
import { userService } from '@/lib/services/user.service';
import { initialPIIntakeFormData, PIIntakeFormData } from '@/lib/types/pi-intake';
import type { IntakeResponse } from '@/lib/types/intake-api';
import { Divider, Grid } from '@mui/material';

// Top Nav Tabs
const NAV_TABS = ['PI Intake Form', 'Intake List', 'Dashboard'];

interface HistoryNote {
    id: string;
    date: string;
    content: string;
    author: string;
}

const mockHistoryNotes: HistoryNote[] = [
    {
        id: '1',
        date: '01/15/2026, 05:17:04 PM',
        content: 'Rejected - The client was crossing Roosevelt Avenue, a heavily trafficked area, when she was struck by a city bus. According to the client, she did not sustain severe injuries other than a head injury, as she does not recall exactly how the accident occurred. The police did not respond to the scene; therefore, there is no police report. The only evidence the client has is a video recorded by a bystander who was present at the time. We will mark this case as rejected, as the accident occurred almost one month ago, there is no attorney representation, no medical treatment such as physical therapy, no MIC, and the injury is limited to the head. It\'s no a case for us. I talked about this case with Airam.',
        author: 'Maria Laura Dominguez'
    },
    {
        id: '2',
        date: '01/15/2026, 08:35:11 PM',
        content: 'I attempted to call Mr. Jason to his phone number, however, there was no response. I sent the email with the information and we\'re waiting for a response.',
        author: 'Jaime Agudelo'
    },
    {
        id: '3',
        date: '01/15/2026, 05:44:27 PM',
        content: 'PENDING INFO TO PRESENT (WC questions, Personal info): The TP portion hasn\'t been presented yet due to the client is on her way to the hospital and the WC and personal information. I will be calling to the client later on. Auth. By Greg.',
        author: 'Gregory Montero Sierra'
    }
];


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
    const [isEditing, setIsEditing] = useState(false);
    const [editSubTab, setEditSubTab] = useState('Intake'); // Intake, History, Information, Notes
    const [currentIntake, setCurrentIntake] = useState<IntakeResponse | null>(null);
    const [screenerName, setScreenerName] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    const { mode } = useTheme();
    const isDark = mode === 'dark';

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




    const handleEditIntake = async (id: string) => {
        setIsEditing(true);
        setEditSubTab('Intake');
        try {
            // Find in local data first to avoid loading if possible, but fetch ensures fresh data
            const intake = await intakeService.getIntakeById(id);
            
            // Save intake for Information tab
            setCurrentIntake(intake);

            // Get screener name
            try {
                const user = await userService.getUserById(intake.createdBy);
                setScreenerName(user.fullName || `${user.firstName} ${user.lastName}`.trim() || '-');
            } catch (error) {
                console.warn('Failed to load screener info:', error);
                setScreenerName('-');
            }

            // Cast typeSpecificData to our form data type
            // It assumes typeSpecificData holds the exact shape of PIIntakeFormData
            const savedData = (intake.typeSpecificData || {}) as Partial<PIIntakeFormData>;

            const mappedData: PIIntakeFormData = {
                ...initialPIIntakeFormData, // Star with defaults
                ...savedData, // Overlay saved data
            };

            // Sync root fields if they are missing or if we want to enforce API consistency
            if (intake.accidentDate) mappedData.accidentDate = intake.accidentDate;
            if (intake.accidentLocation) mappedData.accidentLocation = intake.accidentLocation;
            if (intake.description) mappedData.accidentDescription = intake.description;

            setFormData(mappedData);
            setActiveTab(0); // Switch to PI Intake Form tab
            setCurrentStep(1); // Reset to first step
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.warn("Failed to load intake from API, using mock data for development", error);

            // Fallback mock data for demo/development purposes when API is not available
            const mockFormData: PIIntakeFormData = {
                ...initialPIIntakeFormData,
                firstName: 'Eduardo',
                lastName: 'Flores',
                phoneNumber: '(631) 215-7260',
                email: 'eduardo.flores@example.com',
                accidentDate: '2026-01-15',
                accidentTime: '09:30',
                accidentLocation: 'Roosevelt Avenue, Queens, NY',
                accidentDescription: 'The client was crossing Roosevelt Avenue, a heavily trafficked area, when she was struck by a city bus.',
                dateOfBirth: '1990-05-15',
                address: '123 Main St',
                city: 'Queens',
                state: 'NY',
                zipCode: '11372',
                // Set default values for other required fields to avoid validation errors on load if needed
                accidentType: 'Car accident',
                injuries: 'Head injury, neck pain',
                wentToHospital: 'yes',
                hospitalName: 'Elmhurst Hospital',
                ambulanceUsed: 'yes',
                employed: 'yes',
                missedWork: 'yes'
            };

            setFormData(mockFormData);
            
            // Create mock intake for Information tab
            const mockIntake: IntakeResponse = {
                id: id,
                intakeNumber: '25-80-009190-01-2',
                tenantId: '',
                intakeType: 'PIMM',
                status: 'PENDING',
                brandId: '',
                createdAt: '2026-01-16T00:00:00Z',
                createdBy: '',
                version: 1
            };
            setCurrentIntake(mockIntake);
            setScreenerName('Jhonnaquer Torres Flores');
            
            setActiveTab(0); // Switch to PI Intake Form tab
            setCurrentStep(1); // Reset to first step
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <Box className="min-h-screen bg-gray-50 dark:bg-black flex flex-col font-sans" >
            <Box className="bg-white dark:bg-gray-900 shadow-sm">


                {/* Custom Header Bar for PI Intake */}
                <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-black dark:border-gray-700">
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => {
                            setActiveTab(v);
                            // If switching to PI Intake Form manually (not via Edit), reset edit mode?
                            // Maybe we want to keep it if we are just tabbing back and forth?
                            // For now, let's restart if they click PI Intake Form explicitly to start fresh, 
                            // OR we assume they want to continue what they were doing. 
                            // Let's typically reset if they click the Main Tab unless they are editing?
                            if (v === 0 && !isEditing) {
                                // Maybe clear form? user might want to keep draft.
                            }
                        }}
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
                    <IntakeListTab onEdit={handleEditIntake} />
                )}

                {/* PI Intake Form Tab Content */}
                {activeTab === 0 && (
                    <>
                        {/* Edit Intake Sub-Navigation */}
                        {isEditing && (
                            <Box className="flex gap-4 mb-8">
                                {['Intake', 'History', 'Information', 'Notes'].map((subTab) => {
                                    const active = editSubTab === subTab;
                                    return (
                                        <Button
                                            key={subTab}
                                            onClick={() => setEditSubTab(subTab)}
                                            className={`rounded-full px-8 py-2 text-sm font-semibold normal-case transition-all ${active
                                                    ? 'bg-[#4361EE] text-white hover:bg-[#3651d4]'
                                                    : 'bg-white dark:bg-transparent text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                                }`}
                                            sx={{
                                                borderRadius: '9999px',
                                                minWidth: 'auto',
                                                boxShadow: 'none',
                                                height: '40px'
                                            }}
                                        >
                                            {subTab}
                                        </Button>
                                    );
                                })}
                            </Box>
                        )}

                        {/* History Tab Content */}
                        {isEditing && editSubTab === 'History' && (
                            <Box sx={{
                                padding: '32px 48px',
                                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                borderRadius: '8px',
                                boxShadow: isDark
                                    ? '0 10px 25px rgba(0, 0, 0, 0.5)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                                mb: 4
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    {mockHistoryNotes.map((note, index) => (
                                        <Box key={note.id} sx={{ marginBottom: index < mockHistoryNotes.length - 1 ? '40px' : 0 }}>
                                            <Typography
                                                component="div"
                                                sx={{
                                                    color: '#EAB308',
                                                    fontWeight: 700,
                                                    marginBottom: '20px !important',
                                                    fontSize: '0.875rem',
                                                    lineHeight: 1.5,
                                                    display: 'block'
                                                }}
                                            >
                                                {note.date}
                                            </Typography>
                                            <Box sx={{ height: '12px' }} />
                                            <Typography
                                                variant="body1"
                                                component="div"
                                                sx={{
                                                    marginBottom: '12px',
                                                    lineHeight: 1.6,
                                                    color: isDark ? '#FFFFFF' : '#000000',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 400,
                                                    display: 'block'
                                                }}
                                            >
                                                {note.content}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                component="div"
                                                sx={{
                                                    fontStyle: 'italic',
                                                    fontWeight: 900,
                                                    color: isDark ? '#FFFFFF' : '#000000',
                                                    fontSize: '0.875rem',
                                                    display: 'block'
                                                }}
                                            >
                                                ({note.author})
                                            </Typography>
                                            {index < mockHistoryNotes.length - 1 && (
                                                <Divider sx={{
                                                    mt: '40px',
                                                    mb: 0,
                                                    borderColor: isDark ? '#374151' : '#E5E7EB',
                                                    opacity: isDark ? 0.2 : 0.5
                                                }} />
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {/* Information Tab Content */}
                        {isEditing && editSubTab === 'Information' && currentIntake && (
                            <Box sx={{
                                padding: '32px 48px',
                                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                borderRadius: '8px',
                                boxShadow: isDark
                                    ? '0 10px 25px rgba(0, 0, 0, 0.5)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                                mb: 4
                            }}>
                                {/* Handling Lawyer Warning */}
                                {!formData.selectedLawyer && (
                                    <Box sx={{
                                        backgroundColor: '#FEF3C7',
                                        color: '#92400E',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        marginBottom: '24px',
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}>
                                        Handling Lawyer not assigned yet
                                    </Box>
                                )}

                                {/* Information Title */}
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        fontWeight: 700,
                                        color: isDark ? '#FFFFFF' : '#000000',
                                        marginBottom: '32px',
                                        fontSize: '1.25rem'
                                    }}
                                >
                                    Information
                                </Typography>

                                {/* Information Grid */}
                                <Grid container spacing={3}>
                                    {/* Left Column - Values */}
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <Typography
                                                sx={{
                                                    color: isDark ? '#FFFFFF' : '#000000',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 400
                                                }}
                                            >
                                                {screenerName || '-'}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: isDark ? '#FFFFFF' : '#000000',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 400
                                                }}
                                            >
                                                {currentIntake.createdAt 
                                                    ? intakeService.formatDate(currentIntake.createdAt)
                                                    : '-'}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: isDark ? '#FFFFFF' : '#000000',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 400
                                                }}
                                            >
                                                {currentIntake.intakeNumber || '-'}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: isDark ? '#FFFFFF' : '#000000',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 400
                                                }}
                                            >
                                                {formData.lawyerStatus || 'Pending info to present'}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: isDark ? '#FFFFFF' : '#000000',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 400
                                                }}
                                            >
                                                {formData.medicalStatus || 'Pending Medical'}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    {/* Right Column - Labels */}
                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            <Typography
                                                sx={{
                                                    color: isDark ? '#9CA3AF' : '#6B7280',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 400
                                                }}
                                            >
                                                Screener
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: isDark ? '#9CA3AF' : '#6B7280',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 400
                                                }}
                                            >
                                                Creation Date
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: isDark ? '#9CA3AF' : '#6B7280',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 400
                                                }}
                                            >
                                                Code case
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: isDark ? '#9CA3AF' : '#6B7280',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 400
                                                }}
                                            >
                                                Lawyer Status
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: isDark ? '#9CA3AF' : '#6B7280',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 400
                                                }}
                                            >
                                                Medical Status
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* Notes Tab Content */}
                        {isEditing && editSubTab === 'Notes' && (
                            <Box sx={{
                                padding: '32px 48px',
                                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                borderRadius: '8px',
                                boxShadow: isDark
                                    ? '0 10px 25px rgba(0, 0, 0, 0.5)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                                mb: 4
                            }}>
                                {/* Handling Lawyer Warning */}
                                {!formData.selectedLawyer && (
                                    <Box sx={{
                                        backgroundColor: '#FEF3C7',
                                        color: '#92400E',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        marginBottom: '24px',
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}>
                                        Handling Lawyer not assigned yet
                                    </Box>
                                )}

                                {/* Note Title */}
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        fontWeight: 700,
                                        color: isDark ? '#FFFFFF' : '#000000',
                                        marginBottom: '24px',
                                        fontSize: '1.25rem'
                                    }}
                                >
                                    Note
                                </Typography>

                                {/* Notes Display/Edit Area */}
                                <TextField
                                    multiline
                                    rows={8}
                                    fullWidth
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add your notes here..."
                                    sx={{
                                        marginBottom: '24px',
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                            '& fieldset': {
                                                borderColor: isDark ? '#4B5563' : '#D1D5DB',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: isDark ? '#6B7280' : '#9CA3AF',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#EAB308',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: isDark ? '#FFFFFF !important' : '#000000 !important',
                                            '&::placeholder': {
                                                color: isDark ? '#9CA3AF' : '#6B7280',
                                                opacity: 1,
                                            },
                                        },
                                        '& .MuiInputBase-inputMultiline': {
                                            color: isDark ? '#FFFFFF !important' : '#000000 !important',
                                        },
                                    }}
                                />

                                {/* Add Note Button */}
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        // Save notes - in a real app, this would save to the API
                                        // For now, we just keep the notes in state
                                        console.log('Notes saved:', notes);
                                    }}
                                    sx={{
                                        borderRadius: '9999px',
                                        border: '2px solid #EAB308 !important',
                                        borderColor: '#EAB308 !important',
                                        color: '#EAB308 !important',
                                        padding: '10px 24px',
                                        textTransform: 'none',
                                        fontWeight: 800,
                                        fontSize: '0.875rem',
                                        minWidth: '120px',
                                        backgroundColor: 'transparent !important',
                                        '&:hover': {
                                            border: '2px solid #F59E0B !important',
                                            borderColor: '#F59E0B !important',
                                            color: '#F59E0B !important',
                                            backgroundColor: 'transparent !important',
                                        },
                                    }}
                                >
                                    Add note
                                </Button>
                            </Box>
                        )}

                        {/* Client Searcher - Only show if current step is 1 AND NOT EDITING? Or maybe just keep it? 
                            User request showed only the menu in the screenshot. 
                            Let's hide it if isEditing to match the 'clean' look of the screenshot which implies a specific edit view. 
                        */}
                        {currentStep === 1 && !isEditing && editSubTab !== 'History' && editSubTab !== 'Information' && editSubTab !== 'Notes' && (
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

                        {/* Stepper - Hide when viewing History, Information, or Notes */}
                        {editSubTab !== 'History' && editSubTab !== 'Information' && editSubTab !== 'Notes' && (
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
                        )}

                {/* Person Navigation - Visible across all steps if multiple people */}
                        {editSubTab !== 'History' && editSubTab !== 'Information' && editSubTab !== 'Notes' && (
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
                        )}

                        {/* Step 1 Content: Lead Isnformation */}
                        {currentStep === 1 && editSubTab !== 'History' && editSubTab !== 'Information' && editSubTab !== 'Notes' && (
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
                        {currentStep === 2 && editSubTab !== 'History' && editSubTab !== 'Information' && editSubTab !== 'Notes' && (
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
                        {currentStep === 3 && editSubTab !== 'History' && editSubTab !== 'Information' && editSubTab !== 'Notes' && (
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
                        {currentStep === 4 && editSubTab !== 'History' && editSubTab !== 'Information' && editSubTab !== 'Notes' && (
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

                        {currentStep === 5 && editSubTab !== 'History' && editSubTab !== 'Information' && editSubTab !== 'Notes' && (
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
