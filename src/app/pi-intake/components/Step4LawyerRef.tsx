import { Box, Typography, Grid, Button, RadioGroup, FormControlLabel, Radio, Tooltip, FormHelperText } from '@mui/material';
import { CustomInput } from '@/components/forms/CustomInput';
import { PIIntakeFormData, PIIntakeValidationErrors } from '@/lib/types/pi-intake';
import { useTheme } from '@/lib/contexts/theme-context';

interface Step4LawyerRefProps {
    formData: PIIntakeFormData;
    handleChange: (field: keyof PIIntakeFormData, value: any) => void;
    nextStep: () => void;
    prevStep: () => void;
    handleSave: () => void;
    validationErrors: PIIntakeValidationErrors;
}

const STATUS_TOOLTIPS: { [key: string]: string } = {
    'Lawyer Assigned - Pending sign-up': "The case has been assigned to a handling lawyer, but the client has yet to sign the necessary documents to formalize the agreement.",
    'Lawyer Assigned - Under evaluation': "The case has been assigned to a handling lawyer, who is currently evaluating the details of the case.",
    'Retained': "The case has been retained by the client.",
    'Pending to present': "The case is waiting for some additional information to be completed or presented, before it can be further evaluated or assigned.",
    'Retained Dropped':'Retained Dropped',
    'Pending Full Intake': 'Some information has yet to be entered in the intake',
    'Rejected - No case': 'The case is rejected. Specify the reason in the Legal Status Note field.',
    'Retained Decided NOT to Pursue': 'The customer desisted from pursuing the case. Indicate the reason in the Legal Status Note field.',
    'Client non-compliant': 'The client has not complied with the necessary requirements or requests, leading to this status.',
    'Pending info to present': 'The case is waiting for some additional information to be completed or presented, before it can be further evaluated or assigned.',
    'Rejected - Not accident related': 'The case was rejected because it does not meet the criteria for processing',
    'Client decided not to pursue': 'The client has decided not to proceed with the case.',
    'Retained Subbed': 'Retained Subbed',
};

const STATUS_COLUMNS = [
    [
        'Lawyer Assigned - Pending sign-up',
        'Pending to present',
        'Rejected - No case',
        'Client non-compliant',
        'Client decided not to pursue'
    ],
    [
        'Retained',
        'Retained Dropped',
        'Retained Decided NOT to Pursue',
        'Lawyer Assigned - Under evaluation',
        'Retained Subbed'
    ],
    [
        'Lawyer Assigned - Under evaluation',
        'Pending Full Intake',
        'Pending info to present',
        'Rejected - Not accident related'
    ]
];

export default function Step4LawyerRef({ formData, handleChange, nextStep, prevStep, handleSave: _handleSave, validationErrors }: Step4LawyerRefProps) {
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    return (
        <>
            {/* Lawyer Status Section */}
            <Box className="max-w-4xl mx-auto mb-12">
                <Box className="bg-white dark:bg-black rounded-3xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-red-400">
                    <Typography className="text-red-500 text-xl font-semibold leading-relaxed">
                        I will now place you on a brief hold to present the case to the lawyer. I’d like to let you know that we’re a large team, and if you try to reach me and I’m unavailable, you can ask for my colleague (name)—we all have your information updated in our system.
                        <br /><br />
                        You may also receive follow-up calls about your case; please always verify that they come from () or the law firm we assign you. I mention this because there are individuals who pretend to be legal representatives and offer you money in exchange for your information, which is illegal and could be a scam. No attorney can offer you money to retain their services; from now on, the only people you should speak with about your accident are us and your attorneys.
                    </Typography>
                </Box>
            </Box>
            {/* Lawyer Assign Section */}
            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-8 md:mb-12 text-xl md:text-2xl">
                Lawyer Assign
            </Typography>

            <Box className="max-w-4xl mx-auto">
                <Grid container spacing={6} className="mb-12">
                    <Grid item xs={12} md={6}>
                        <CustomInput
                            label="Selected Lawyer"
                            select
                            value={formData.selectedLawyer || ''}
                            onChange={(e: any) => handleChange('selectedLawyer', e.target.value)}
                            placeholder="Select Lawyer"
                        >
                            <option value="Lawyer 1">Lawyer 1</option>
                            <option value="Lawyer 2">Lawyer 2</option>
                        </CustomInput>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <label className="block text-sm font-bold text-transparent mb-2 hidden md:block select-none">
                            Spacer
                        </label>
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
                    </Grid>
                </Grid>
            </Box>
            <Typography id="lawyer-status-header" variant="h2" className={`font-extrabold ${validationErrors.lawyerStatus ? 'text-red-500' : 'text-black dark:text-white'} mb-8 md:mb-12 text-xl md:text-2xl`}>
                Lawyer Status {validationErrors.lawyerStatus && '*'}
            </Typography>

            <Box role="radiogroup" aria-labelledby="lawyer-status-header" className="max-w-4xl mx-auto">
                <Box className={`mb-12 relative ${validationErrors.lawyerStatus ? 'p-4 border-2 border-red-100 bg-red-50 rounded-2xl' : ''}`}>
                    <Grid container spacing={4}>
                        {STATUS_COLUMNS.map((column, colIndex) => (
                            <Grid item xs={12} md={4} key={colIndex}>
                                <div className="flex flex-col gap-4">
                                    {column.map((status, index) => (
                                        <Tooltip
                                            key={`${colIndex}-${index}`}
                                            title={STATUS_TOOLTIPS[status] || "No text available"}
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
                                                        checked={formData.lawyerStatus === status}
                                                        onChange={() => handleChange('lawyerStatus', status)}
                                                        sx={{
                                                            color: validationErrors.lawyerStatus ? '#ef4444' : '#D1D5DB',
                                                            '&.Mui-checked': {
                                                                color: '#ebb207'
                                                            },
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <span className={`text-sm font-bold ${validationErrors.lawyerStatus ? 'text-red-700' : 'text-gray-700 dark:text-gray-200'}`}>
                                                        {status}
                                                    </span>
                                                }
                                                className="m-0 w-full hover:bg-yellow-50 dark:hover:bg-gray-800/50 rounded-lg pr-2 transition-colors ml-[-8px] pl-[8px]"
                                            />
                                        </Tooltip>
                                    ))}
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                {validationErrors.lawyerStatus && (
                    <FormHelperText error className="text-center mb-4">
                        Please select a Lawyer Status
                    </FormHelperText>
                )}

                {/* Note */}
                <Typography variant="h6" className="font-bold text-black dark:text-white mb-4 text-sm">
                    Legal Status Note
                </Typography>
                <div className="mb-12">
                    <CustomInput
                        label=""
                        placeholder=""
                        multiline
                        rows={6}
                        value={formData.legalStatusNote || ''}
                        onChange={(e: any) => handleChange('legalStatusNote', e.target.value)}
                    />
                </div>
            </Box>

            {/* Sign Up Section */}
            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-8 md:mb-12 text-xl md:text-2xl">
                Sign up
            </Typography>

            <Box className="max-w-4xl mx-auto mb-12">
                <Grid container spacing={6}>
                    <Grid item xs={12} md={6}>
                        <CustomInput
                            label="Sign-Up Method"
                            select
                            value={formData.signUpMethod || ''}
                            onChange={(e: any) => handleChange('signUpMethod', e.target.value)}
                            placeholder="Select Method"
                        >
                            <option value="Email">Email</option>
                            <option value="In Person">In Person</option>
                            <option value="Phone">Phone</option>
                        </CustomInput>
                    </Grid>
                    <Grid item xs={12}>
                        <CustomInput
                            label="Sign-Up Notes"
                            multiline
                            rows={4}
                            value={formData.signUpNotes || ''}
                            onChange={(e: any) => handleChange('signUpNotes', e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* LIVE LEAD Section */}
            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-8 md:mb-12 text-xl md:text-2xl">
                Live Lead
            </Typography>

            <Box className="max-w-4xl mx-auto">
                <Grid container spacing={6} className="mb-8">
                    <Grid item xs={12}>
                        <label id="live-lead-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                            Live Lead Done?
                        </label>
                        <RadioGroup
                            aria-labelledby="live-lead-label"
                            row
                            value={formData.liveLeadDone || ''}
                            onChange={(e) => handleChange('liveLeadDone', e.target.value)}
                        >
                            <FormControlLabel
                                value="yes"
                                control={
                                    <Radio
                                        sx={{
                                            color: '#D1D5DB',
                                            '&.Mui-checked': {
                                                color: '#E8B007',
                                            },
                                        }}
                                    />
                                }
                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                className="mr-12"
                            />
                            <FormControlLabel
                                value="no"
                                control={
                                    <Radio
                                        sx={{
                                            color: '#D1D5DB',
                                            '&.Mui-checked': {
                                                color: '#E8B007',
                                            },
                                        }}
                                    />
                                }
                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                            />
                        </RadioGroup>
                    </Grid>

                    {formData.liveLeadDone === 'yes' && (
                        <Grid item xs={12} md={12}>
                            <CustomInput
                                label="Who did the Live Lead?"
                                multiline
                                maxLength={1000}
                                value={formData.liveLeadPerformedBy || ''}
                                onChange={(e: any) => handleChange('liveLeadPerformedBy', e.target.value)}
                            />
                        </Grid>
                    )}

                    {formData.liveLeadDone === 'no' && (
                        <Grid item xs={12} md={12}>
                            <CustomInput
                                label="Why is the Live Lead not Done?"
                                multiline
                                maxLength={1000}
                                value={formData.liveLeadNotDoneReason || ''}
                                onChange={(e: any) => handleChange('liveLeadNotDoneReason', e.target.value)}
                            />
                        </Grid>
                    )}
                </Grid>

                {/* Navigation Buttons */}
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
                        }}
                    >
                        Continue
                    </Button>
                </Box>
            </Box>
        </>
    );
}
