import { useState } from 'react';
import Image from 'next/image';
import { Box, Typography, Button, Paper, Divider, Chip, Dialog, IconButton, TextField, InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useTheme } from '@/lib/contexts/theme-context';

interface IntakeDetailViewProps {
    patient: any; // Replace with proper type if available
    onBack: () => void;
}

export default function IntakeDetailView({ patient, onBack }: IntakeDetailViewProps) {
    const { mode } = useTheme();

    const handleReminderClick = (reminderType: string) => {
        setSelectedReminder(reminderType);
        setIsReminderModalOpen(true);
    };

    const cardStyles = {
        borderRadius: '20px',
        padding: '24px',
        height: '100%',
        backgroundColor: mode === 'dark' ? '#1F2937' : '#FFFFFF',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    };

    const titleStyles = {
        fontWeight: 'bold',
        fontSize: '1.25rem', // h6/text-xl
        textAlign: 'center',
        marginBottom: '24px',
        color: mode === 'dark' ? '#FFFFFF' : '#000000'
    };

    const labelStyles = {
        fontWeight: 'bold',
        color: mode === 'dark' ? '#FFFFFF' : '#000000',
        marginBottom: '4px',
        display: 'inline-block',
        marginRight: '8px'
    };

    const valueStyles = {
        color: mode === 'dark' ? '#D1D5DB' : '#374151',
    };

    const sectionHeaderStyles = {
        ...labelStyles,
        fontSize: '1rem',
        marginTop: '16px',
        marginBottom: '8px',
        display: 'block'
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [selectedReminder, setSelectedReminder] = useState('');

    return (
        <Box className="w-full animate-fade-in">
            {/* Header / Back Button */}
            <Box className="mb-6 flex items-center">
                <Button
                    onClick={onBack}
                    startIcon={
                        <Image
                            src="/icons/iconos-svg/arrow-left.svg"
                            alt="Back"
                            width={20}
                            height={20}
                            style={{ filter: mode === 'dark' ? 'invert(1)' : 'none' }}
                        />
                    }
                    sx={{
                        textTransform: 'none',
                        color: '#EAB308', // Gold color for the text
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'underline'
                        }
                    }}
                >
                    <Box className="flex flex-col items-start ml-1 leading-tight">
                        <span>Handling lawyers</span>
                        <span>management PI</span>
                    </Box>
                </Button>
            </Box>
            <Box className="mb-16" />
            <Box className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Card 1: Client Information */}
                <Paper elevation={0} sx={cardStyles}>
                    <Typography sx={titleStyles}>Client information</Typography>

                    <Box className="space-y-4">
                        <Box sx={{ height: '10px' }} />
                        <Box>
                            <Typography component="span" sx={labelStyles}>Client Name:</Typography>
                            <Typography component="span" sx={valueStyles}>{patient.name} {patient.lastName}</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Client Phone:</Typography>
                            <Typography component="span" sx={valueStyles}>{patient.phone}</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Pimm Source:</Typography>
                            <Typography component="span" sx={valueStyles}>{patient.pimmSource || 'Unknown'}</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Referral Lawyer:</Typography>
                            <Typography component="span" sx={valueStyles}>{patient.referralLawyer || 'N/A'}</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Address:</Typography>
                            <Typography component="span" sx={valueStyles}>{patient.address || 'Address not provided'}</Typography>
                        </Box>

                        <Box sx={{ height: '10px' }} />
                        <Typography sx={sectionHeaderStyles}>Accident details</Typography>
                        <Box>
                            <Typography component="h6" sx={labelStyles}>Were you driving?</Typography>
                            <Typography component="span" sx={valueStyles}>{patient.wereYouDriving || ' Unknown'}</Typography>
                        </Box>

                        <Typography sx={sectionHeaderStyles}>Employment information</Typography>
                    </Box>
                </Paper>

                {/* Card 2: Appointments */}
                <Paper elevation={0} sx={cardStyles}>
                    <Typography sx={titleStyles}>Appointments</Typography>
                        <Box sx={{ height: '10px' }} />

                    <Typography sx={{ ...labelStyles, display: 'block', marginBottom: '16px' }}>Scheduled appointments</Typography>

                    <Box className="space-y-3 mb-6">
                        <Box>
                            <Typography component="span" sx={labelStyles}>Medical office:</Typography>
                            <Typography component="span" sx={valueStyles}>a.m. care physical therapy p.c. 09/26/2025, 10:27:00</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Description:</Typography>
                            <Typography component="span" sx={valueStyles}>fhfghfg</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Customer:</Typography>
                            <Typography component="span" sx={valueStyles}>jj gg</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Phone number:</Typography>
                            <Typography component="span" sx={valueStyles}>{patient.phone}</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Created by:</Typography>
                            <Typography component="span" sx={valueStyles}>{patient.createdBy}</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Does the client require transportation?</Typography>
                            <Typography component="span" sx={valueStyles}>yes</Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3, borderColor: mode === 'dark' ? '#374151' : '#E5E7EB' }} />

                    <Box className="mb-6">
                        <Box sx={{ height: '10px' }} />
                        <Typography sx={{ ...labelStyles, display: 'block' }}>Reminders:</Typography>
                        <Box sx={{ height: '10px' }} />
                        <Box className="flex flex-wrap gap-4">
                            <Chip
                                label="1 day after"
                                size="small"
                                onClick={() => handleReminderClick('1 day after')}
                                sx={{
                                    borderRadius: '100px',
                                    fontWeight: 'bold',
                                    bgcolor: mode === 'dark' ? '#374151' : '#F3F4F6',
                                    color: mode === 'dark' ? '#fff' : '#000',
                                    px: 1,
                                    height: '32px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: mode === 'dark' ? '#4B5563' : '#E5E7EB',
                                    }
                                }}
                            />
                            <Chip
                                label="1 day before"
                                size="small"
                                onClick={() => handleReminderClick('1 day before')}
                                sx={{
                                    borderRadius: '100px',
                                    fontWeight: 'bold',
                                    bgcolor: mode === 'dark' ? '#374151' : '#F3F4F6',
                                    color: mode === 'dark' ? '#fff' : '#000',
                                    px: 1,
                                    height: '32px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: mode === 'dark' ? '#4B5563' : '#E5E7EB',
                                    }
                                }}
                            />
                            <Chip
                                label="2 hours before"
                                size="small"
                                onClick={() => handleReminderClick('2 hours before')}
                                sx={{
                                    borderRadius: '100px',
                                    fontWeight: 'bold',
                                    bgcolor: mode === 'dark' ? '#374151' : '#F3F4F6',
                                    color: mode === 'dark' ? '#fff' : '#000',
                                    px: 1,
                                    height: '32px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: mode === 'dark' ? '#4B5563' : '#E5E7EB',
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                    <Box className="flex items-center justify-between gap-4 mt-auto pt-4">
                        <Button
                            variant="outlined"
                            startIcon={
                                <Image
                                    src="/icons/iconos-svg/calendar.svg"
                                    alt="Calendar"
                                    width={20}
                                    height={20}
                                    style={{ filter: mode === 'dark' ? 'invert(1)' : 'opacity(0.6)' }}
                                />
                            }
                            sx={{
                                borderRadius: '100px',
                                textTransform: 'none',
                                color: mode === 'dark' ? '#fff' : '#374151',
                                border: mode === 'dark' ? '1px solid #4B5563 !important' : '1px solid #D1D5DB !important',
                                fontWeight: 'bold !important',
                                flex: 1,
                                height: '45px',
                                '&:hover': {
                                    border: mode === 'dark' ? '1px solid #6B7280' : '1px solid #9CA3AF !important',
                                    backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.05) !important' : 'rgba(0,0,0,0.02) !important'
                                }
                            }}
                        >
                            Calendar
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setIsEditModalOpen(true)}
                            sx={{
                                borderRadius: '100px',
                                textTransform: 'none',
                                color: '#EAB308 !important',
                                border: '1px solid #EAB308 !important',
                                fontWeight: 'bold !important',
                                flex: 1,
                                height: '45px',
                                '&:hover': {
                                    border: '1px solid #CA8A04 !important',
                                    borderColor: '#CA8A04 !important',
                                    backgroundColor: 'rgba(234, 179, 8, 0.04) !important'
                                }
                            }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                borderRadius: '100px',
                                textTransform: 'none',
                                backgroundColor: '#EAB308 !important',
                                color: '#fff !important',
                                fontWeight: 'bold !important',
                                flex: 1,
                                height: '45px',
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: '#CA8A04 !important',
                                    boxShadow: 'none !important'
                                }
                            }}
                        >
                            Send SMS
                        </Button>
                    </Box>
                </Paper>

                {/* Card 3: Medical office */}
                <Paper elevation={0} sx={cardStyles}>
                    <Typography sx={titleStyles}>Medical office</Typography>

                    <Box className="space-y-4">
                        <Box>
                            <Typography component="span" sx={labelStyles}>Medical Office:</Typography>
                            <Typography component="span" sx={valueStyles}>A.M. Care Physical Therapy P.C.</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Primary Doctor:</Typography>
                            <Typography component="span" sx={valueStyles}>N/A</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Primary Phone:</Typography>
                            <Typography component="span" sx={valueStyles}>(516) 688-0050</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Primary Email:</Typography>
                            <Typography component="span" sx={valueStyles}>Unknown</Typography>
                        </Box>
                        <Box className="flex items-start">
                            <Typography component="span" sx={{ ...labelStyles, minWidth: 'fit-content' }}>Address:</Typography>
                            <Typography component="span" sx={valueStyles}>500 Bi County Blvd suite 114, Farmingdale, NY 11735, USA</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Client Availability:</Typography>
                            <Typography component="span" sx={valueStyles}>N/A</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Needs Transportation:</Typography>
                            <Typography component="span" sx={valueStyles}>No</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Client Role:</Typography>
                            <Typography component="span" sx={valueStyles}>NaN</Typography>
                        </Box>
                        <Box>
                            <Typography component="span" sx={labelStyles}>Client Injuries</Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* Edit Modal */}
            <Dialog
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        padding: '40px',
                        width: '100%',
                        maxWidth: '560px',
                        backgroundColor: mode === 'dark' ? '#1F2937' : '#FFFFFF',
                    }
                }}
            >
                <IconButton
                    onClick={() => setIsEditModalOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 20,
                        top: 20,
                        color: mode === 'dark' ? '#9CA3AF' : '#6B7280'
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography
                    sx={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '32px',
                        color: mode === 'dark' ? '#FFFFFF' : '#000000',
                    }}
                >
                    Appointment Status
                </Typography>

                <Box sx={{ height: '20px' }} />
                <Box className="flex flex-col gap-8">
                    <Box>
                        <TextField
                            fullWidth
                            placeholder="Borough"
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '100px',
                                    backgroundColor: 'transparent',
                                    height: '50px',
                                    paddingLeft: '15px',
                                    paddingRight: '15px',
                                    color: `${mode === 'dark' ? '#FFFFFF' : '#000000'} !important`,
                                    '& fieldset': {
                                        borderWidth: '1px !important',
                                        borderColor: mode === 'dark' ? '#4B5563 !important' : '#D1D5DB !important',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#EAB308 !important',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#EAB308 !important',
                                    },
                                    '& input': {
                                        paddingLeft: '16px',
                                        paddingRight: '16px',
                                        color: `${mode === 'dark' ? '#FFFFFF' : '#000000'} !important`,
                                    },
                                    '& .MuiInputBase-input': {
                                        color: `${mode === 'dark' ? '#FFFFFF' : '#000000'} !important`,
                                    }
                                }
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography sx={{ fontWeight: 'bold', mb: 2, fontSize: '0.9rem', color: mode === 'dark' ? '#E5E7EB' : '#000000' }}>
                            Appointment Date/Time (Optional):
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" sx={{ marginRight: '8px' }}>
                                        <Image
                                            src="/icons/iconos-svg/calendar.svg"
                                            alt="Calendar"
                                            width={24}
                                            height={24}
                                            style={{
                                                filter: mode === 'dark'
                                                    ? 'invert(69%) sepia(38%) saturate(3731%) hue-rotate(2deg) brightness(105%) contrast(105%)'
                                                    : 'invert(59%) sepia(85%) saturate(1478%) hue-rotate(10deg) brightness(108%) contrast(106%)'
                                            }}
                                            className="opacity-80"
                                        />
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '100px',
                                    backgroundColor: 'transparent',
                                    height: '40px',
                                    paddingLeft: '15px',
                                    paddingRight: '15px',
                                    color: `${mode === 'dark' ? '#FFFFFF' : '#000000'} !important`,
                                    '& fieldset': {
                                        borderWidth: '1px !important',
                                        borderColor: mode === 'dark' ? '#4B5563 !important' : '#D1D5DB !important',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#EAB308 !important',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#EAB308 !important',
                                    },
                                    '& input': {
                                        paddingLeft: '16px',
                                        paddingRight: '16px',
                                        color: `${mode === 'dark' ? '#FFFFFF' : '#000000'} !important`,
                                    },
                                    '& .MuiInputBase-input': {
                                        color: `${mode === 'dark' ? '#FFFFFF' : '#000000'} !important`,
                                    }
                                }
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography sx={{ fontWeight: 'bold', mb: 2, fontSize: '0.9rem', color: mode === 'dark' ? '#E5E7EB' : '#000000' }}>
                            Note (optional):
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',
                                    backgroundColor: 'transparent',
                                    color: `${mode === 'dark' ? '#FFFFFF' : '#000000'} !important`,
                                    '& fieldset': {
                                        borderWidth: '1px !important',
                                        borderColor: mode === 'dark' ? '#4B5563 !important' : '#D1D5DB !important',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#EAB308 !important',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#EAB308 !important',
                                    },
                                    '& textarea': {
                                        color: `${mode === 'dark' ? '#FFFFFF' : '#000000'} !important`,
                                        padding: '16px',
                                    },
                                    '& .MuiInputBase-input': {
                                        color: `${mode === 'dark' ? '#FFFFFF' : '#000000'} !important`,
                                    }
                                }
                            }}
                        />
                    </Box>

                    <Box className="flex justify-end gap-4 mt-4">
                        <Button
                            variant="outlined"
                            onClick={() => setIsEditModalOpen(false)}
                            sx={{
                                borderRadius: '100px',
                                px: 6,
                                py: 1.5,
                                minHeight: '50px',
                                width: '90px',
                                border: '1px solid #EAB308 !important',
                                color: '#EAB308 !important',
                                fontWeight: 'bold !important',
                                fontSize: '1rem',
                                textTransform: 'none',
                                '&:hover': {
                                    border: '1px solid #CA8A04 !important',
                                    backgroundColor: 'rgba(234, 179, 8, 0.04) !important'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setIsEditModalOpen(false)}
                            sx={{
                                borderRadius: '100px',
                                px: 6,
                                py: 1.5,
                                minHeight: '48px',
                                width: '90px',
                                backgroundColor: '#EAB308 !important',
                                color: '#FFFFFF !important',
                                fontWeight: 'bold !important',
                                fontSize: '1rem',
                                textTransform: 'none',
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: '#CA8A04 !important',
                                    boxShadow: 'none !important'
                                }
                            }}
                        >
                            Update
                        </Button>
                    </Box>
                </Box>
            </Dialog>

            {/* Reminder Modal */}
            <Dialog
                open={isReminderModalOpen}
                onClose={() => setIsReminderModalOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '20px',
                        padding: '40px',
                        width: '100%',
                        maxWidth: '500px',
                        backgroundColor: mode === 'dark' ? '#1F2937' : '#FFFFFF',
                    }
                }}
            >
                <IconButton
                    onClick={() => setIsReminderModalOpen(false)}
                    sx={{
                        position: 'absolute',
                        right: 20,
                        top: 20,
                        color: mode === 'dark' ? '#9CA3AF' : '#6B7280'
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography
                    sx={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginBottom: '24px',
                        color: mode === 'dark' ? '#FFFFFF' : '#000000',
                        textAlign: 'center'
                    }}
                >
                    Confirm Reminder
                </Typography>

                <Typography
                    sx={{
                        fontSize: '1rem',
                        color: mode === 'dark' ? '#D1D5DB' : '#374151',
                        textAlign: 'center',
                        marginBottom: '32px',
                        lineHeight: 1.6
                    }}
                >
                    Are you sure you want to send the <strong>{selectedReminder}</strong> reminder to <strong>{patient.phone || 'the client'}</strong>?
                </Typography>

                <Box className="flex justify-center gap-4">
                    <Button
                        variant="outlined"
                        onClick={() => setIsReminderModalOpen(false)}
                        sx={{
                            borderRadius: '100px',
                            px: 6,
                            py: 1.5,
                            minHeight: '48px',
                            minWidth: '120px',
                            border: '1px solid #EAB308 !important',
                            color: '#EAB308 !important',
                            fontWeight: 'bold !important',
                            fontSize: '1rem',
                            textTransform: 'none',
                            '&:hover': {
                                border: '1px solid #CA8A04 !important',
                                backgroundColor: 'rgba(234, 179, 8, 0.04) !important'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // Logic to send reminder would go here
                            alert(`Reminder "${selectedReminder}" sent!`);
                            setIsReminderModalOpen(false);
                        }}
                        sx={{
                            borderRadius: '100px',
                            px: 6,
                            py: 1.5,
                            minHeight: '48px',
                            minWidth: '120px',
                            backgroundColor: '#EAB308 !important',
                            color: '#FFFFFF !important',
                            fontWeight: 'bold !important',
                            fontSize: '1rem',
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#CA8A04 !important',
                                boxShadow: 'none !important'
                            }
                        }}
                    >
                        Send
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
}
