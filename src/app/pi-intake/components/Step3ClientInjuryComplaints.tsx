
import { useState } from 'react';
import { Box, Typography, Grid, FormControlLabel, Checkbox, RadioGroup, Radio, Button, Tooltip } from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';
import { CustomInput } from '@/components/forms/CustomInput';
import { PIIntakeFormData } from '@/lib/types/pi-intake';
import { INJURY_OPTIONS, NATIONALITY_OPTIONS } from '@/lib/constants/pi-intake-options';
import { useGoogleAddressAutocomplete } from '@/hooks/useGoogleAddressAutocomplete';

interface Step3ClientInjuryComplaintsProps {
    formData: PIIntakeFormData;
    handleChange: (field: keyof PIIntakeFormData, value: any) => void;
    prevStep: () => void;
    nextStep: () => void; // Or onSubmit
    isLoaded: boolean;
    showSourceSection: boolean;
    setShowSourceSection: (show: boolean) => void;
    activePerson?: number; // Optional for now
    setActivePerson?: (person: number) => void; // Optional for now
    handlePersonChange?: (personId: number, field: any, value: any) => void;
}

export default function Step3ClientInjuryComplaints({
    formData: globalFormData,
    handleChange: globalHandleChange,
    prevStep,
    nextStep,
    isLoaded,
    showSourceSection,
    setShowSourceSection,
    activePerson = 1,
    setActivePerson,
    handlePersonChange
}: Step3ClientInjuryComplaintsProps) {

    // Shadowing formData and handleChange to support multi-person editing
    // If activePerson is 1, use global data/methods.
    // If activePerson > 1, use person-specific data from 'persons' map.

    // Helper to get current person data
    const getPersonData = () => {
        if (activePerson === 1) return globalFormData;
        return globalFormData.persons?.[activePerson] || {};
    };

    const formData: any = getPersonData();

    const handleChange = (field: string, value: any) => {
        if (activePerson === 1) {
            // For Person 1, use global handler (which updates root fields)
            // But we also want to ensure Sync? The hook handles basic sync if we used handlePersonChange(1).
            // But existing code uses globalHandleChange (handleChange prop).
            // Let's stick to globalHandleChange for Person 1 to match existing behavior.
            // OR better: use handlePersonChange(1) if available?
            if (handlePersonChange) {
                handlePersonChange(1, field, value);
            } else {
                globalHandleChange(field as keyof PIIntakeFormData, value);
            }
        } else {
            // For Person > 1
            if (handlePersonChange) {
                handlePersonChange(activePerson, field, value);
            } else {
                console.warn("handlePersonChange missing activePerson > 1");
            }
        }
    };

    // Home Address Autocomplete
    const { onLoad: onLoadHomeAddress, onPlaceChanged: onPlaceChangedHomeAddress } = useGoogleAddressAutocomplete((address) => {
        handleChange('address', address);
    });

    // Employer Address Autocomplete
    const { onLoad: onLoadEmployerAddress, onPlaceChanged: onPlaceChangedEmployerAddress } = useGoogleAddressAutocomplete((address) => {
        handleChange('employerAddress', address);
    });

    const openHomeAddressGoogleMaps = () => {
        if (!formData.address) return;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`;
        window.open(url, '_blank');
    };

    const openEmployerAddressGoogleMaps = () => {
        if (!formData.employerAddress) return;
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.employerAddress)}`;
        window.open(url, '_blank');
    };

    const handleContinueToSource = () => {
        setShowSourceSection(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToInjury = () => {
        setShowSourceSection(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {!showSourceSection && (
                <>
                    <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-8 md:mb-12 text-xl md:text-2xl">
                        Client injury complaints
                    </Typography>

                    <Box className="max-w-4xl mx-auto mb-12">
                        <Box className="flex flex-col gap-10">
                            {/* Script Card */}
                            <Box className="bg-white dark:bg-black rounded-3xl p-6 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-red-400">
                                <Typography className="text-red-500 text-xl font-semibold leading-relaxed mb-6">
                                    In order for you to have a case, you need to meet two very important components.
                                </Typography>
                                <Typography className="text-red-500 text-xl font-semibold leading-relaxed mb-4">
                                    1. the first component is negligence, by negligence i mean that someone else had to have caused your accident....and based on your description of how the accident happened, it is obvious that you are not at fault here!
                                </Typography>
                                <Typography className="text-red-500 text-xl font-semibold leading-relaxed">
                                    2. the second component is injuries.... substantial injuries .... such as headaches?... (pause) ...neck pain?... (pause) ... back pain?... (pause) — shoulder pain?... (pause)... arm pain?... (pause)... knee pain?... (pause)... leg pain?..
                                </Typography>
                            </Box>

                            {/* Checkboxes Grid */}
                            <Box>
                                <Grid container spacing={3}>
                                    {INJURY_OPTIONS.map((option) => (
                                        <Grid item xs={12} sm={6} md={3} key={option.key}>
                                            {option.inputLabel ? (
                                                <Tooltip title={option.inputLabel} arrow placement="top">
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={!!(formData as any)[option.key]}
                                                                onChange={(e) => handleChange(option.key as keyof PIIntakeFormData, e.target.checked)}
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
                                                        label={<span className="text-[13px] font-bold text-black dark:text-white ml-1">{option.label}</span>}
                                                        className="m-0 items-start"
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={!!(formData as any)[option.key]}
                                                            onChange={(e) => handleChange(option.key as keyof PIIntakeFormData, e.target.checked)}
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
                                                    label={<span className="text-[13px] font-bold text-black dark:text-white ml-1">{option.label}</span>}
                                                    className="m-0 items-start"
                                                />
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            {/* Conditional Inputs Section */}
                            <Box className="space-y-6">
                                {INJURY_OPTIONS
                                    .filter(opt => opt.hasInput && (formData as any)[opt.key])
                                    .filter((opt, index, self) =>
                                        index === self.findIndex(o => o.inputKey === opt.inputKey && o.key === opt.key)
                                    )
                                    .map((option, index) => (
                                        <Box key={`${option.inputKey}-${option.key}-${index}`} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                                            <label id={`injury-input-label-${option.key}`} className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                                {option.inputLabel}
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <CustomInput
                                                required={false}
                                                label=""
                                                aria-labelledby={`injury-input-label-${option.key}`}
                                                value={(formData as any)[option.inputKey!] || ''}
                                                onChange={(e: any) => handleChange(option.inputKey as keyof PIIntakeFormData, e.target.value)}
                                            />
                                        </Box>
                                    ))}
                            </Box>

                        </Box>
                    </Box>

                    {/* Worker's Compensation Information - Show if Auto, Work, or Slip/Fall accident */}
                    {(formData.accidentAtWork === 'yes' || formData.involvedInAutoAccident === 'yes' || formData.injuredBySlipFall === 'yes') && (
                        <>
                            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-6 text-xl md:text-2xl">
                                Worker&apos;s compensation information
                            </Typography>

                            <Box className="max-w-4xl mx-auto mb-12">
                                {/* Script Card */}
                                <Box className="mb-8 md:mb-12">
                                    <Box className="bg-white dark:bg-black rounded-3xl p-6 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-red-400">
                                        <Typography className="text-red-500 text-xl font-semibold leading-relaxed">
                                            &quot;I will now proceed to ask you a few personal questions about your employment. since you were injured while working, you may qualify for a benefit called worker&apos;s compensation. this benefit covers all your medical expenses, pays you for the time you take off work, and may provide final compensation if you are left with a disability. don&apos;t worry—this will not affect your job. it is part of your rights as an employee.&quot;
                                        </Typography>
                                    </Box>
                                </Box>

                                <Grid container spacing={10}>
                                    {/* Left Column */}
                                    <Grid item xs={12} md={6}>
                                        <Box className="flex flex-col gap-8">
                                            {/* Report to Employer */}
                                            <Box>
                                                <label id="report-employer-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                    Did you Report your Accident to your Employer?
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <RadioGroup
                                                    aria-labelledby="report-employer-label"
                                                    row
                                                    value={formData.reportedAccidentToEmployer || ''}
                                                    onChange={(e) => handleChange('reportedAccidentToEmployer', e.target.value)}
                                                >
                                                    <FormControlLabel
                                                        value="yes"
                                                        control={
                                                            <Radio
                                                                icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                            />
                                                        }
                                                        label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                        className="mr-6"
                                                    />
                                                    <FormControlLabel
                                                        value="no"
                                                        control={
                                                            <Radio
                                                                icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                            />
                                                        }
                                                        label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                                    />
                                                </RadioGroup>
                                            </Box>

                                            {/* Who reported to */}
                                            <CustomInput
                                                label="Who did they Report your Injury to?"
                                                value={formData.reportedInjuryTo || ''}
                                                onChange={(e: any) => handleChange('reportedInjuryTo', e.target.value)}
                                            />

                                            {/* Job Title */}
                                            <CustomInput
                                                required
                                                label="What is your Job Title?"
                                                value={formData.jobTitle || ''}
                                                onChange={(e: any) => handleChange('jobTitle', e.target.value)}
                                            />

                                            {/* Net Wage */}
                                            <CustomInput
                                                required
                                                label="How much is your net wage?"
                                                value={formData.netWage || ''}
                                                onChange={(e: any) => handleChange('netWage', e.target.value)}
                                            />

                                            {/* Pay Stubs */}
                                            {/* Conditional Questions based on Payment Method */}
                                            {formData.paymentMethod === 'Check' && (
                                                <Box>
                                                    <label id="pay-stubs-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                        Do you have pay stubs or pictures of your checks? If yes, please send a picture.
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <RadioGroup
                                                        aria-labelledby="pay-stubs-label"
                                                        row
                                                        value={formData.hasPayStubs || ''}
                                                        onChange={(e) => handleChange('hasPayStubs', e.target.value)}
                                                    >
                                                        <FormControlLabel
                                                            value="yes"
                                                            control={
                                                                <Radio
                                                                    icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                    checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                                />
                                                            }
                                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                            className="mr-6"
                                                        />
                                                        <FormControlLabel
                                                            value="no"
                                                            control={
                                                                <Radio
                                                                    icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                    checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                                />
                                                            }
                                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                                        />
                                                    </RadioGroup>
                                                </Box>
                                            )}

                                            {formData.paymentMethod === 'Cash' && (
                                                <Box>
                                                    <label id="proof-work-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                        Do you have text messages with your boss that prove you work for them?
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <RadioGroup
                                                        aria-labelledby="proof-work-label"
                                                        row
                                                        value={formData.hasProofOfWorkMessages || ''}
                                                        onChange={(e) => handleChange('hasProofOfWorkMessages', e.target.value)}
                                                    >
                                                        <FormControlLabel
                                                            value="yes"
                                                            control={
                                                                <Radio
                                                                    icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                    checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                                />
                                                            }
                                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                            className="mr-6"
                                                        />
                                                        <FormControlLabel
                                                            value="no"
                                                            control={
                                                                <Radio
                                                                    icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                    checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                                />
                                                            }
                                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                                        />
                                                    </RadioGroup>
                                                </Box>
                                            )}

                                            {/* Worked Since Accident - Moved to Left Column as per Image Layout */}
                                            <Box>
                                                <label id="worked-since-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                    Have you worked since the day of the Accident?
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <RadioGroup
                                                    aria-labelledby="worked-since-label"
                                                    row
                                                    value={formData.workedSinceAccident || ''}
                                                    onChange={(e) => handleChange('workedSinceAccident', e.target.value)}
                                                >
                                                    <FormControlLabel
                                                        value="yes"
                                                        control={
                                                            <Radio
                                                                icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                            />
                                                        }
                                                        label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                        className="mr-6"
                                                    />
                                                    <FormControlLabel
                                                        value="no"
                                                        control={
                                                            <Radio
                                                                icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                            />
                                                        }
                                                        label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                                    />
                                                </RadioGroup>
                                            </Box>
                                        </Box>
                                    </Grid>

                                    {/* Right Column */}
                                    <Grid item xs={12} md={6}>
                                        <Box className="flex flex-col gap-8">
                                            {/* Date Reported */}
                                            {formData.reportedAccidentToEmployer === 'yes' && (
                                                <CustomInput
                                                    required
                                                    label="What Date did you report your Accident to your Employer?"
                                                    type="date"
                                                    value={formData.dateReportedToEmployer || ''}
                                                    onChange={(e: any) => handleChange('dateReportedToEmployer', e.target.value)}
                                                    onClick={(e: any) => e.currentTarget.showPicker()}
                                                />
                                            )}

                                            {formData.reportedAccidentToEmployer === 'no' && (
                                                <CustomInput
                                                    required
                                                    label="Why didn't Report your Accident to your Employer?"
                                                    value={formData.reasonNotReportedToEmployer || ''}
                                                    onChange={(e: any) => handleChange('reasonNotReportedToEmployer', e.target.value)}
                                                    multiline
                                                    rows={4}
                                                    maxLength={500}
                                                />
                                            )}

                                            {/* Text messages */}
                                            <Box>
                                                <label id="text-messages-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                    Do you have text messages with your boss about reporting your accident?
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <RadioGroup
                                                    aria-labelledby="text-messages-label"
                                                    row
                                                    value={formData.textMessagesWithBoss || ''}
                                                    onChange={(e) => handleChange('textMessagesWithBoss', e.target.value)}
                                                >
                                                    <FormControlLabel
                                                        value="yes"
                                                        control={
                                                            <Radio
                                                                icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                            />
                                                        }
                                                        label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                        className="mr-6"
                                                    />
                                                    <FormControlLabel
                                                        value="no"
                                                        control={
                                                            <Radio
                                                                icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                            />
                                                        }
                                                        label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                                    />
                                                </RadioGroup>
                                            </Box>

                                            {/* Payroll Frequency */}
                                            <CustomInput
                                                required
                                                label="Do you Get Paid Weekly or Bi-weekly?"
                                                select
                                                value={formData.payrollFrequency || ''}
                                                onChange={(e: any) => handleChange('payrollFrequency', e.target.value)}
                                            >
                                                <option value="Weekly">Weekly</option>
                                                <option value="Bi-weekly">Bi-weekly</option>
                                            </CustomInput>

                                            {/* Payment Method */}
                                            <CustomInput
                                                required
                                                label="How do you Get Paid?"
                                                select
                                                value={formData.paymentMethod || ''}
                                                onChange={(e: any) => handleChange('paymentMethod', e.target.value)}
                                            >
                                                <option value="Cash">Cash</option>
                                                <option value="Check">Check</option>
                                                <option value="Direct Deposit">Direct Deposit</option>
                                            </CustomInput>

                                            {/* Employment Duration */}
                                            <CustomInput
                                                required
                                                label="How long have you worked for the Company?"
                                                value={formData.employmentDuration || ''}
                                                onChange={(e: any) => handleChange('employmentDuration', e.target.value)}
                                            />

                                            {/* Worked Since Accident - Moved to Left Column */}

                                            {/* How long worked post-accident - Matches visual row with 'Worked Since Accident' */}
                                            <CustomInput
                                                required
                                                label="How long have you worked for the Company?"
                                                value={formData.postAccidentWorkDuration || ''}
                                                onChange={(e: any) => handleChange('postAccidentWorkDuration', e.target.value)}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>

                                {/* Employer's Address & Work Material */}
                                <Box className="mt-12 space-y-10">
                                    <Box>
                                        <Typography variant="h3" className="font-extrabold text-black dark:text-white mb-6 text-xl">
                                            Worker&apos;s Comp / Employer&apos;s Address
                                        </Typography>

                                        <Box className="relative">
                                            {isLoaded ? (
                                                <Autocomplete
                                                    onLoad={onLoadEmployerAddress}
                                                    onPlaceChanged={onPlaceChangedEmployerAddress}
                                                >
                                                    <CustomInput
                                                        required
                                                        label="What is your employer's address?"
                                                        value={formData.employerAddress || ''}
                                                        onChange={(e: any) => handleChange('employerAddress', e.target.value)}
                                                    />
                                                </Autocomplete>
                                            ) : (
                                                <CustomInput
                                                    required
                                                    label="What is your employer's address?"
                                                    value={formData.employerAddress || ''}
                                                    onChange={(e: any) => handleChange('employerAddress', e.target.value)}
                                                />
                                            )}
                                            {formData.employerAddress && (
                                                <div className="flex justify-end mt-2">
                                                    <Button
                                                        variant="contained"
                                                        onClick={openEmployerAddressGoogleMaps}
                                                        disabled={!formData.employerAddress}
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
                                                            '&.Mui-disabled': {
                                                                backgroundColor: '#A0A0A0 !important',
                                                                color: '#E0E0E0 !important',
                                                                borderColor: '#808080',
                                                                boxShadow: 'none',
                                                            }
                                                        }}
                                                    >
                                                        Google Maps
                                                    </Button>
                                                </div>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box>
                                        <label id="uniform-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3 leading-relaxed">
                                            Do you have a uniform or any work-related material (e.g., badge, ID, company shirt) that shows the company name and information? -- OR ANYTHING THAT SHOWS THE COMPANY LOGO
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <RadioGroup
                                            aria-labelledby="uniform-label"
                                            row
                                            value={formData.hasWorkUniformOrMaterial || ''}
                                            onChange={(e) => handleChange('hasWorkUniformOrMaterial', e.target.value)}
                                        >
                                            <FormControlLabel
                                                value="yes"
                                                control={
                                                    <Radio
                                                        icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                        checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                    />
                                                }
                                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                className="mr-6"
                                            />
                                            <FormControlLabel
                                                value="no"
                                                control={
                                                    <Radio
                                                        icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                        checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                    />
                                                }
                                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                            />
                                        </RadioGroup>
                                    </Box>
                                </Box>

                                {/* 3rd Party Involvement */}
                                <Box className="mt-12 space-y-8">
                                    <Typography variant="h3" className="font-extrabold text-black dark:text-white mb-6 text-xl">
                                        3rd Party Involvement
                                    </Typography>

                                    {/* Warning Card */}
                                    <Box className="bg-white dark:bg-black rounded-3xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-red-400 text-center">
                                        <Typography className="text-red-500 text-2xl font-extrabold mb-4 uppercase">
                                            DO NOT READ THIS QUESTION TO THE CALLER
                                        </Typography>
                                        <Typography className="text-red-500 text-lg font-semibold">
                                            Please use you own judgement to answer the question, do not ask the caller this question
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <label id="third-party-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                            Was a 3rd Party Involved in the Accident?
                                            <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <RadioGroup
                                            aria-labelledby="third-party-label"
                                            row
                                            value={formData.thirdPartyInvolved || ''}
                                            onChange={(e) => handleChange('thirdPartyInvolved', e.target.value)}
                                        >
                                            <FormControlLabel
                                                value="yes"
                                                control={
                                                    <Radio
                                                        icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                        checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                    />
                                                }
                                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                className="mr-6"
                                            />
                                            <FormControlLabel
                                                value="no"
                                                control={
                                                    <Radio
                                                        icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                        checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                    />
                                                }
                                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                            />
                                        </RadioGroup>
                                    </Box>

                                    {/* Conditional Textarea */}
                                    {formData.thirdPartyInvolved === 'yes' && (
                                        <CustomInput
                                            required
                                            label="Described third party Involvement"
                                            value={formData.thirdPartyInvolvementDescription || ''}
                                            onChange={(e: any) => handleChange('thirdPartyInvolvementDescription', e.target.value)}
                                            multiline
                                            rows={4}
                                        />
                                    )}
                                </Box>

                            </Box>

                            {/* Prior Accident Information */}

                            <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-6 text-2xl">
                                Prior accident information
                            </Typography>

                            <Box className="max-w-4xl mx-auto mb-12">
                                <Box className="mt-12 space-y-8">

                                    <Grid container spacing={4}>
                                        {/* Row 1 Left: Have you been involved? */}
                                        <Grid item xs={12} md={6}>
                                            <Box>
                                                <label id="prior-accidents-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                    Have you been involved in any prior accidents?
                                                    <span className="text-red-500 ml-1">*</span>
                                                </label>
                                                <RadioGroup
                                                    aria-labelledby="prior-accidents-label"
                                                    row
                                                    value={formData.priorAccidents || ''}
                                                    onChange={(e) => handleChange('priorAccidents', e.target.value)}
                                                >
                                                    <FormControlLabel
                                                        value="yes"
                                                        control={
                                                            <Radio
                                                                icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                            />
                                                        }
                                                        label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                        className="mr-6"
                                                    />
                                                    <FormControlLabel
                                                        value="no"
                                                        control={
                                                            <Radio
                                                                icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                            />
                                                        }
                                                        label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                                    />
                                                </RadioGroup>
                                            </Box>
                                        </Grid>

                                        {/* Row 1 Right: Date (Conditional) */}
                                        <Grid item xs={12} md={6}>
                                            {formData.priorAccidents === 'yes' && (
                                                <CustomInput
                                                    required
                                                    label="What is your date of Prior Accident?"
                                                    type="date"
                                                    value={formData.priorAccidentDate || ''}
                                                    onChange={(e: any) => handleChange('priorAccidentDate', e.target.value)}
                                                    onClick={(e: any) => e.currentTarget.showPicker()}
                                                />
                                            )}
                                        </Grid>

                                        {/* Row 2 Left: Type (Conditional) */}
                                        <Grid item xs={12} md={6}>
                                            {formData.priorAccidents === 'yes' && (
                                                <CustomInput
                                                    required
                                                    label="What type of prior accident?"
                                                    select
                                                    value={formData.priorAccidentType || ''}
                                                    onChange={(e: any) => handleChange('priorAccidentType', e.target.value)}
                                                >
                                                    <option value="Auto Accident">Auto Accident</option>
                                                    <option value="Slip and Fall">Slip and Fall</option>
                                                    <option value="Workplace Accident">Workplace Accident</option>
                                                    <option value="Other">Other</option>
                                                </CustomInput>
                                            )}
                                        </Grid>

                                        {/* Row 2 Right: Legal Rep (Conditional) */}
                                        <Grid item xs={12} md={6}>
                                            {formData.priorAccidents === 'yes' && (
                                                <Box>
                                                    <label id="prior-legal-rep-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                                                        Did you have Legal Representation for the previous accident?
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </label>
                                                    <RadioGroup
                                                        aria-labelledby="prior-legal-rep-label"
                                                        row
                                                        value={formData.priorAccidentLegalRep || ''}
                                                        onChange={(e) => handleChange('priorAccidentLegalRep', e.target.value)}
                                                    >
                                                        <FormControlLabel
                                                            value="yes"
                                                            control={
                                                                <Radio
                                                                    icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                    checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                                />
                                                            }
                                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                            className="mr-6"
                                                        />
                                                        <FormControlLabel
                                                            value="no"
                                                            control={
                                                                <Radio
                                                                    icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                                    checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                                />
                                                            }
                                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                                        />
                                                    </RadioGroup>
                                                </Box>
                                            )}
                                        </Grid>

                                        {/* Row 3 Full Width: Body Parts (Conditional) */}
                                        <Grid item xs={12}>
                                            {formData.priorAccidents === 'yes' && (
                                                <CustomInput
                                                    required
                                                    label="What body parts were claimed during the previous accident?"
                                                    value={formData.priorAccidentInjuries || ''}
                                                    onChange={(e: any) => handleChange('priorAccidentInjuries', e.target.value)}
                                                    multiline
                                                    rows={4}
                                                />
                                            )}
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </>
                    )}

                    {/* Merged Personal Information Section */}

                    <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-6 text-2xl">
                        Personal information
                    </Typography>

                    <Box className="max-w-4xl mx-auto mb-12">
                        {/* Script Card */}
                        <Box className="mb-12">
                            <Box className="bg-white dark:bg-black rounded-3xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-red-400">
                                <Typography className="text-red-500 text-xl font-semibold leading-relaxed">
                                    For these types of cases, you will need medical treatment. Treatment is extremely important not only to help you recover from the injuries sustained in the accident, but also because it enables your attorney to gather all the necessary documentation to secure the maximum possible compensation. That’s why it’s essential that you attend all of your therapy appointments.
                                </Typography>
                            </Box>
                        </Box>

                        {/* Right Column: Content */}

                        <Box className="flex flex-col gap-10">

                            {/* Form Fields */}
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <CustomInput
                                        label="What is your date of birth?"
                                        type="date"
                                        value={formData.dateOfBirth || ''}
                                        onChange={(e: any) => handleChange('dateOfBirth', e.target.value)}
                                        onClick={(e: any) => e.currentTarget.showPicker()}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <CustomInput
                                        required
                                        label="What is your personal email address?"
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e: any) => handleChange('email', e.target.value)}
                                        error={formData.email && formData.email.length > 0 && !formData.email.includes('@')}
                                        helperText={formData.email && formData.email.length > 0 && !formData.email.includes('@') ? "Please enter a valid email address" : ""}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <CustomInput
                                        label="What is your preferred language?"
                                        select
                                        value={formData.preferredLanguage || ''}
                                        onChange={(e: any) => handleChange('preferredLanguage', e.target.value)}
                                        required
                                    >
                                        <option value="English">English</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="Chinese">Chinese</option>
                                        <option value="Russian">Russian</option>
                                        <option value="Creole">Creole</option>
                                        <option value="Italian">Italian</option>
                                        <option value="Bengali">Bengali</option>
                                        <option value="French">French</option>
                                        <option value="Arabic">Arabic</option>
                                        <option value="Korean">Korean</option>
                                        <option value="Hebrew">Hebrew</option>
                                        <option value="Other">Other</option>
                                    </CustomInput>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <label id="same-address-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                        Does this person have the same address as the Main Lead?
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <RadioGroup
                                        aria-labelledby="same-address-label"
                                        row
                                        value={formData.sameAddressAsLead || ''}
                                        onChange={(e) => handleChange('sameAddressAsLead', e.target.value)}
                                    >
                                        <FormControlLabel
                                            value="yes"
                                            control={
                                                <Radio
                                                    icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                    checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                />
                                            }
                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                            className="mr-6"
                                        />
                                        <FormControlLabel
                                            value="no"
                                            control={
                                                <Radio
                                                    icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                    checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                />
                                            }
                                            label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                        />
                                    </RadioGroup>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box className="flex-grow">
                                        {isLoaded ? (
                                            <Autocomplete
                                                onLoad={onLoadHomeAddress}
                                                onPlaceChanged={onPlaceChangedHomeAddress}
                                            >
                                                <CustomInput
                                                    required
                                                    label="What is your Home Address?"
                                                    value={formData.address || ''}
                                                    onChange={(e: any) => handleChange('address', e.target.value)}
                                                />
                                            </Autocomplete>
                                        ) : (
                                            <CustomInput
                                                required
                                                label="What is your Home Address?"
                                                value={formData.address || ''}
                                                onChange={(e: any) => handleChange('address', e.target.value)}
                                            />
                                        )}
                                    </Box>

                                    {formData.address && (
                                        <Box className="mt-3 flex justify-end">
                                            <Button
                                                variant="contained"
                                                onClick={openHomeAddressGoogleMaps}
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
                                </Grid>
                            </Grid>

                            {/* Emergency Contact Header */}
                            <Typography variant="h2" className="font-extrabold text-black dark:text-white mt-4 text-xl mb-2">
                                Emergency contact details
                            </Typography>

                            <Grid container spacing={3} alignItems="flex-start">
                                <Grid item xs={12} md={6}>
                                    <Box className="mb-6">
                                        <label id="has-emergency-contact-label" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                            Do you have an emergency contact that you would like to share?*
                                        </label>
                                        <RadioGroup
                                            aria-labelledby="has-emergency-contact-label"
                                            row
                                            value={formData.hasEmergencyContact || ''}
                                            onChange={(e) => handleChange('hasEmergencyContact', e.target.value)}
                                        >
                                            <FormControlLabel
                                                value="yes"
                                                control={
                                                    <Radio
                                                        icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                        checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                    />
                                                }
                                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">Yes</span>}
                                                className="mr-6"
                                            />
                                            <FormControlLabel
                                                value="no"
                                                control={
                                                    <Radio
                                                        icon={<div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                                                        checkedIcon={<div className="w-5 h-5 rounded-full border-2 border-[#EAB308] bg-[#EAB308]" />}
                                                    />
                                                }
                                                label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">No</span>}
                                            />
                                        </RadioGroup>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box className="mb-6">
                                        <CustomInput
                                            required={formData.hasEmergencyContact === 'yes'}
                                            label="What is the first and last name of your Emergency contact?"
                                            value={formData.emergencyContactName || ''}
                                            onChange={(e: any) => handleChange('emergencyContactName', e.target.value)}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box className="mb-6">
                                        <CustomInput
                                            required={formData.hasEmergencyContact === 'yes'}
                                            label="What is the emergency contact's phone number?"
                                            value={formData.emergencyContactPhone || ''}
                                            onChange={(e: any) => handleChange('emergencyContactPhone', e.target.value)}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Box className="mb-6">
                                        <CustomInput
                                            required={formData.hasEmergencyContact === 'yes'}
                                            label="What is the emergency contact's relationship to you?"
                                            value={formData.emergencyContactRelation || ''}
                                            onChange={(e: any) => handleChange('emergencyContactRelation', e.target.value)}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>

                            {/* Navigation Buttons for Step 4 */}
                            <Box className="flex justify-between items-center pt-4">
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
                                    onClick={handleContinueToSource}
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

                    </Box>
                </>
            )
            }

            {
                showSourceSection && (
                    <>
                        <Typography variant="h2" className="font-extrabold text-black dark:text-white mb-24 text-2xl">
                            How did you know about us
                        </Typography>

                        <Box className="bg-transparent max-w-4xl mx-auto">
                            <Typography id="call-source-label" className="font-extrabold text-black dark:text-white mb-6 text-sm">
                                How did the Client Hear About Us
                                <span className="text-red-500 ml-1">*</span>
                            </Typography>

                            <RadioGroup
                                aria-labelledby="call-source-label"
                                row
                                value={formData.callSource || ''}
                                onChange={(e) => handleChange('callSource', e.target.value)}
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 items-center"
                            >
                                {['Radio', 'TV', 'Internet', 'Facebook', 'Instagram', 'Referral', 'Booklet', 'Other'].map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={
                                            <Radio
                                                icon={
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                                }
                                                checkedIcon={
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-400 bg-gray-400" />
                                                }
                                            />
                                        }
                                        label={<span className="text-sm font-bold text-gray-700 dark:text-gray-200">{option}</span>}
                                        className="m-0"
                                    />
                                ))}

                                {formData.callSource === 'Other' && (
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            value={formData.callSubSource || ''}
                                            onChange={(e) => handleChange('callSubSource', e.target.value)}
                                            className="w-full px-4 py-1 rounded-full border border-gray-400 focus:outline-none focus:border-gray-600 bg-white"
                                        />
                                    </div>
                                )}
                            </RadioGroup>
                            <Box className="mb-12 mt-10">
                                <Box className="bg-white dark:bg-black rounded-3xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-red-400">
                                    <Typography className="text-red-500 text-xl font-semibold leading-relaxed">
                                        Just one last quick question before we finish - would you mind sharing your nationality? we&apos;re simply asking so we can better understand who our clients are and what communities we&apos;re reaching. it helps us improve our marketing and outreach efforts.
                                        <br /><br />
                                        Una última preguntita antes de finalizar - ¿le molestaría decirme su nacionalidad? solo lo preguntamos para entender mejor quiénes son nuestros clientes y a qué comunidades estamos llegando. esto nos ayuda a mejorar nuestras estrategias de mercadeo y alcance.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box className="max-w-4xl mx-auto mb-12">
                            <CustomInput
                                required
                                label="Client's Nationality"
                                select
                                value={formData.nationality || ''}
                                onChange={(e: any) => handleChange('nationality', e.target.value)}
                                placeholder="Select Nationality"
                            >
                                {NATIONALITY_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </CustomInput>
                        </Box>

                        <Box className="max-w-4xl mx-auto">
                            <Box className="mt-6 mb-12 flex justify-between items-center">
                                <Button
                                    onClick={handleBackToInjury}
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
                )
            }
        </>
    );
}
