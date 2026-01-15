'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
    Checkbox,
    IconButton,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Tooltip,
    DialogContentText,
    InputAdornment,
} from '@mui/material';
import {
    Close as CloseIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { MedicalOffice, MedicalOfficeFilters } from '@/lib/types/medical-office';
import { MONTHS, NYC_BOROUGHS, TABLE_COLUMNS, SPECIALIST_TABLE_COLUMNS } from '@/lib/constants/medical-office';
import { MOCK_MEDICAL_OFFICES } from '@/lib/data/medical-offices-mock';

// Estilos comunes para TextField
const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '25px',
        height: '45px',
        backgroundColor: '#FFFFFF',
        color: '#000000',
    },
    '& .MuiOutlinedInput-input': {
        paddingLeft: '20px !important',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#9CA3AF !important',
        borderWidth: '1px !important',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#9CA3AF !important',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#9CA3AF !important',
    },
};

const grayTextFieldStyles = {
    ...textFieldStyles,
    '& .MuiOutlinedInput-root': {
        ...textFieldStyles['& .MuiOutlinedInput-root'],
        backgroundColor: '#FFF',
    },
};

const selectFieldStyles = {
    ...textFieldStyles,
    '& .MuiSelect-select': {
        paddingLeft: '20px !important',
        display: 'flex',
        alignItems: 'center',
    },
    '& .MuiSelect-icon': {
        color: '#EAB308',
        fontSize: '2rem',
    },
};

// Estado inicial del formulario
const getInitialFormState = (): Omit<MedicalOffice, 'id'> => ({
        totalQuota: 0,
        name: '',
        monthlyQuota: 0,
        usedQuota: 0,
        availableQuota: 0,
        active: true,
        priority: false,
        transportation: false,
    scheduleTypes: { neck: false, back: false },
        address: '',
        phone: '',
        doctorName: '',
        borough: '',
        contactName: '',
        contactLastname: '',
        contactEmail: '',
    contactEmails: '',
    emailsMedicalUpdates: '',
    emailMedicalRecords: '',
    specialists: '',
    primaryPhone: '',
    secondaryPhone: '',
    cellPhone: '',
    primaryEmail: '',
    secondaryEmail: '',
    addressPrimary: '',
    addressSecondary: '',
    limitPerClinicOwner: '',
    network: '',
    clinicServiceSchedule: '',
    clinicType: '',
    typeOfInjuries: '',
    typeOfService: '',
    status: '',
    doctorQuota: '',
    notes: '',
    note: '',
    extensions: '',
    hasSpecialistAddress: false,
    medicalCenterAddress: '',
    hoursOfAttention: '',
    medicalCenterPhone: '',
    contacts: '',
    medicalRecordsEmails: '',
    secondStatus: true,
});

// Componente interno para diálogo de confirmación
const ConfirmDialog = ({ 
    open, 
    onClose, 
    onConfirm, 
    icon, 
    title, 
    message, 
    confirmText, 
    confirmColor = '#EAB308' 
}: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    icon: string;
    title: string;
    message: string;
    confirmText: string;
    confirmColor?: string;
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
            sx: {
                borderRadius: '30px',
                padding: '32px',
                maxWidth: '440px',
                width: '100%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 40px 60px -12px rgba(0, 0, 0, 0.3)',
                '.dark &': { backgroundColor: '#1F2937' }
            }
        }}
        BackdropProps={{
            sx: {
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
        }}
    >
        <DialogContent sx={{ p: 0, textAlign: 'center' }}>
            <Box className={`w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full shadow-lg ${confirmColor === '#EF4444' ? 'bg-red-500 shadow-red-500/30' : 'bg-[#EAB308] shadow-yellow-500/30'}`}>
                <Image src={icon} alt="" width={42} height={42} className="brightness-0 invert" />
            </Box>
            <Typography variant="h4" className="font-black text-gray-900 dark:text-white mb-3 text-2xl">
                {title}
            </Typography>
            <Typography className="text-gray-500 dark:text-gray-400 mb-10 text-lg leading-relaxed px-4">
                {message}
            </Typography>
            <Box className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <Button
                    onClick={onClose}
                    variant="outlined"
                    fullWidth
                    sx={{
                        borderRadius: '50px',
                        textTransform: 'none',
                        borderColor: '#E5E7EB',
                        color: '#6B7280',
                        fontWeight: 700,
                        fontSize: '1rem',
                        height: '52px',
                        borderWidth: '2px',
                        '&:hover': {
                            borderColor: '#D1D5DB',
                            backgroundColor: '#F9FAFB',
                            borderWidth: '2px',
                        },
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    fullWidth
                    sx={{
                        borderRadius: '50px',
                        textTransform: 'none',
                        backgroundColor: `${confirmColor} !important`,
                        color: 'white !important',
                        fontWeight: 700,
                        fontSize: '1rem',
                        height: '52px',
                        boxShadow: `0 4px 14px ${confirmColor}40`,
                        '&:hover': {
                            backgroundColor: `${confirmColor === '#EF4444' ? '#DC2626' : '#CA8A04'} !important`,
                            boxShadow: `0 6px 20px ${confirmColor}50`,
                            transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    {confirmText}
                </Button>
            </Box>
        </DialogContent>
    </Dialog>
);

export default function MedicalOfficesTab() {
    const [filters, setFilters] = useState<MedicalOfficeFilters>({
        type: 'medical',
        borough: '',
        month: '',
        year: '',
    });
    const [medicalOffices, setMedicalOffices] = useState<MedicalOffice[]>(MOCK_MEDICAL_OFFICES);
    const [openDialog, setOpenDialog] = useState(false);
    const [newOffice, setNewOffice] = useState<Omit<MedicalOffice, 'id'>>(getInitialFormState());
    const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);

    const handleToggle = (id: string, field: 'active' | 'priority' | 'transportation') => {
        setMedicalOffices(prev =>
            prev.map(office =>
                office.id === id ? { ...office, [field]: !office[field] } : office
            )
        );
    };

    const handleScheduleTypeToggle = (id: string, type: 'neck' | 'back') => {
        setMedicalOffices(prev =>
            prev.map(office =>
                office.id === id
                    ? {
                        ...office,
                        scheduleTypes: {
                            ...office.scheduleTypes,
                            [type]: !office.scheduleTypes[type],
                        },
                    }
                    : office
            )
        );
    };

    const handleCreateOffice = () => {
        if (selectedOfficeId) {
            // Edit existing
            setMedicalOffices(prev => prev.map(off =>
                off.id === selectedOfficeId ? { ...off, ...newOffice } : off
            ));
        } else {
            // Create new
            const newId = (medicalOffices.length + 1).toString(); // Using existing mock ID logic
            const office: MedicalOffice = {
                ...newOffice,
                id: newId,
                // Set defaults for fields not in modal but required for table view
                monthlyQuota: 0,
                usedQuota: 0,
                availableQuota: 0,
                active: true,
                priority: false,
                transportation: false,
                scheduleTypes: {
                    neck: false,
                    back: false,
                },
                address: newOffice.addressPrimary || newOffice.address || 'Pending Address',
                phone: newOffice.primaryPhone || newOffice.phone || 'Pending Phone',
            };
            setMedicalOffices(prev => [...prev, office]);
        }

        setOpenDialog(false);
        resetForm();
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        resetForm();
    };

    const resetForm = () => {
        setNewOffice(getInitialFormState());
        setSelectedOfficeId(null);
    };

    const handleEdit = (office: MedicalOffice) => {
        setNewOffice({
            ...office,
            // Ensure optional fields are strings to avoid uncontrolled warnings
            doctorName: office.doctorName || '',
            borough: office.borough || '',
            contactName: office.contactName || '',
            contactLastname: office.contactLastname || '',
            contactEmail: office.contactEmail || '',
            contactEmails: office.contactEmails || '',
            emailsMedicalUpdates: office.emailsMedicalUpdates || '',
            emailMedicalRecords: office.emailMedicalRecords || '',
            specialists: office.specialists || '',
            primaryPhone: office.primaryPhone || '',
            secondaryPhone: office.secondaryPhone || '',
            cellPhone: office.cellPhone || '',
            primaryEmail: office.primaryEmail || '',
            secondaryEmail: office.secondaryEmail || '',
            addressPrimary: office.addressPrimary || '',
            addressSecondary: office.addressSecondary || '',
            limitPerClinicOwner: office.limitPerClinicOwner || '',
            network: office.network || '',
            clinicServiceSchedule: office.clinicServiceSchedule || '',
            clinicType: office.clinicType || '',
            typeOfInjuries: office.typeOfInjuries || '',
            typeOfService: office.typeOfService || '',
            status: office.status || '',
            doctorQuota: office.doctorQuota || '',
            notes: office.notes || '',
            note: (office as any).note || '',
            extensions: office.extensions || '',
            hasSpecialistAddress: office.hasSpecialistAddress !== undefined ? office.hasSpecialistAddress : false,
            // Specialist specific fields
            medicalCenterAddress: (office as any).medicalCenterAddress || '',
            hoursOfAttention: (office as any).hoursOfAttention || '',
            medicalCenterPhone: (office as any).medicalCenterPhone || '',
            contacts: (office as any).contacts || '',
            medicalRecordsEmails: (office as any).medicalRecordsEmails || '',
            secondStatus: (office as any).secondStatus !== undefined ? (office as any).secondStatus : true,
        });
        setSelectedOfficeId(office.id);
        setOpenDialog(true);
    };

    const handleDeleteClick = (id: string) => {
        setSelectedOfficeId(id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedOfficeId) {
            setMedicalOffices(prev => prev.filter(o => o.id !== selectedOfficeId));
        }
        setDeleteDialogOpen(false);
        setSelectedOfficeId(null);
    };

    const handleSaveClick = (id: string) => {
        setSelectedOfficeId(id);
        setSaveDialogOpen(true);
    };

    const handleConfirmSave = () => {
        // Logic to "Save" (maybe just confirmation)
        setSaveDialogOpen(false);
        setSelectedOfficeId(null);
    };

    return (
        <>
            <Paper className="p-4 sm:p-6 lg:p-8 shadow-sm rounded-[16px] sm:rounded-[20px] bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-100 dark:border-gray-800">
                {/* Tipo de ingreso */}
                <Box className="mb-6">
                    <Typography variant="subtitle2" className="mb-2 font-semibold">
                        Tipo de ingreso
                    </Typography>
                    <RadioGroup
                        row
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value as 'medical' | 'specialist' })}
                    >
                        <FormControlLabel
                            value="medical"
                            control={<Radio sx={{ color: '#EAB308', '&.Mui-checked': { color: '#EAB308' } }} />}
                            label={<span className="text-black dark:text-white">Medical offices</span>}
                        />
                        <FormControlLabel
                            value="specialist"
                            control={<Radio sx={{ color: '#EAB308', '&.Mui-checked': { color: '#EAB308' } }} />}
                            label={<span className="text-black dark:text-white">Specialist</span>}
                        />
                    </RadioGroup>
                </Box>

                <Box className="h-px bg-gray-200 dark:bg-gray-700 my-6"></Box>

                {/* Filters */}
                <Typography variant="h5" className="mb-4 font-bold text-black dark:text-white text-lg sm:text-xl lg:text-2xl">
                    {filters.type === 'medical' ? 'Medical Offices' : 'Specialist'}
                </Typography>
                <Box className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
                    {filters.type === 'medical' ? (
                        <>
                    <TextField
                        select
                        value={filters.borough}
                        onChange={(e) => setFilters({ ...filters, borough: e.target.value })}
                        className="w-full sm:w-48"
                        size="small"
                        SelectProps={{
                            displayEmpty: true,
                            renderValue: (selected: any) => {
                                if (!selected) {
                                    return <span className="text-gray-500 font-medium">Borough</span>;
                                }
                                return <span className="text-black">{selected}</span>;
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                                backgroundColor: '#FFFFFF',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#E5E7EB !important', // gray-200
                                borderWidth: '1px !important',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#9CA3AF !important', // gray-400
                            },
                            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#EAB308 !important', // yellow-500
                            },
                            '& .MuiSelect-icon': {
                                color: '#EAB308',
                                fontSize: '2rem',
                            },
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {NYC_BOROUGHS.map((borough: string) => (
                            <MenuItem key={borough} value={borough}>
                                {borough}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        value={filters.month}
                        onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                        className="w-full sm:w-48"
                        size="small"
                        SelectProps={{
                            displayEmpty: true,
                            renderValue: (selected: any) => {
                                if (!selected) {
                                    return <span className="text-gray-500 font-medium">Month</span>;
                                }
                                return <span className="text-black">{selected}</span>;
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                                backgroundColor: '#FFFFFF',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#E5E7EB !important',
                                borderWidth: '1px !important',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#9CA3AF !important',
                            },
                            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#EAB308 !important',
                            },
                            '& .MuiSelect-icon': {
                                color: '#EAB308',
                                fontSize: '2rem',
                            },
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {MONTHS.map((month: string) => (
                            <MenuItem key={month} value={month}>
                                {month}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        value={filters.year}
                        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                        className="w-full sm:w-48"
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                                backgroundColor: '#FFFFFF',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#E5E7EB !important',
                                borderWidth: '1px !important',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#9CA3AF !important',
                            },
                            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#EAB308 !important',
                            },
                            '& .MuiSelect-icon': {
                                color: '#EAB308',
                                fontSize: '2rem',
                            },
                        }}
                        SelectProps={{
                            displayEmpty: true,
                            renderValue: (selected: any) => {
                                if (!selected) {
                                    return <span className="text-gray-500 font-medium">Year</span>;
                                }
                                return <span className="text-black">{selected}</span>;
                            },
                            MenuProps: {
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                    },
                                },
                            },
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {Array.from(
                            { length: new Date().getFullYear() - 1980 + 1 },
                            (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                            <MenuItem key={year} value={year.toString()}>
                                {year}
                            </MenuItem>
                        ))}
                    </TextField>
                        </>
                    ) : (
                        // Specialist Search Bar
                        <Box className="flex items-center w-full max-w-md mr-auto">
                            <TextField
                                fullWidth
                                placeholder="Search"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#EAB308' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '50px',
                                        backgroundColor: '#FFFFFF',
                                        paddingLeft: '10px',
                                        height: '45px',
                                        width: '50%',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#E5E7EB !important',
                                        borderWidth: '1px !important',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#9CA3AF !important',
                                    },
                                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#EAB308 !important',
                                    },
                                }}
                            />
                        </Box>
                    )}

                    <Button
                        variant="contained"
                        className="w-full sm:w-auto sm:ml-auto"
                        onClick={() => setOpenDialog(true)}
                        sx={{
                            backgroundColor: '#EAB308 !important',
                            color: '#FFFFFF !important',
                            textTransform: 'none',
                            fontSize: { xs: '0.875rem', sm: '0.95rem' },
                            fontWeight: 700,
                            px: { xs: '16px !important', sm: '24px !important' },
                            py: { xs: '8px !important', sm: '10px !important' },
                            minHeight: '45px',
                            minWidth: '180px',
                            borderRadius: '38px',
                            boxShadow: '0 4px 6px rgba(234, 179, 8, 0.25)',
                            '&:hover': {
                                backgroundColor: '#CA8A04 !important',
                                boxShadow: '0 6px 12px rgba(234, 179, 8, 0.35)',
                            },
                        }}
                    >
                        {filters.type === 'medical' ? 'Create medical offices' : 'Create specialist'}
                    </Button>
                </Box>

                {/* Table */}
                <TableContainer sx={{ overflowX: 'auto', maxWidth: '100%' }}>
                    <Table sx={{ minWidth: 1200 }}>
                        <TableHead>
                            <TableRow>
                                {(filters.type === 'medical' ? TABLE_COLUMNS : SPECIALIST_TABLE_COLUMNS).map((column: any) => (
                                    <TableCell
                                        key={column.id}
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: { xs: '0.65rem', sm: '0.7rem', lg: '0.75rem' },
                                            color: 'inherit',
                                            borderBottom: '2px solid #E5E7EB',
                                            whiteSpace: 'nowrap',
                                            padding: { xs: '8px 10px', sm: '10px 14px', lg: '12px 16px' },
                                        }}
                                    >
                                        <span className="text-black dark:text-white">{column.label}</span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {medicalOffices.map((office, index) => (
                                <TableRow
                                    key={office.id}
                                    sx={{
                                        backgroundColor: 'inherit',
                                        '&:hover': {
                                            backgroundColor: 'rgba(234, 179, 8, 0.1) !important',
                                        },
                                        '& .MuiTableCell-root': {
                                            padding: { xs: '8px 10px', sm: '10px 14px', lg: '12px 16px' },
                                            fontSize: { xs: '0.7rem', sm: '0.8rem', lg: '0.875rem' },
                                            color: 'inherit',
                                            borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                                        },
                                    }}
                                    className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-yellow-50/50 dark:bg-yellow-900/10'}`}
                                >
                                    {filters.type === 'medical' ? (
                                        // Medical Office Columns
                                        <>
                                    <TableCell>{office.totalQuota}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" className="font-bold">
                                            {office.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{office.borough || 'Staten Island'}</TableCell>
                                    <TableCell>{office.monthlyQuota}</TableCell>
                                    <TableCell>{office.usedQuota}</TableCell>
                                    <TableCell>{office.availableQuota}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={office.active}
                                            onChange={() => handleToggle(office.id, 'active')}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#EAB308',
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#EAB308',
                                                },
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={office.priority}
                                            onChange={() => handleToggle(office.id, 'priority')}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={office.transportation}
                                            onChange={() => handleToggle(office.id, 'transportation')}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#EAB308',
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#EAB308',
                                                },
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box className="flex flex-col gap-1">
                                            <Box className="flex items-center gap-1">
                                                <Checkbox
                                                    checked={office.scheduleTypes.neck}
                                                    onChange={() => handleScheduleTypeToggle(office.id, 'neck')}
                                                    size="small"
                                                    sx={{
                                                        color: '#EAB308',
                                                        '&.Mui-checked': { color: '#EAB308' },
                                                    }}
                                                />
                                                <Typography variant="caption" className="text-gray-700 dark:text-gray-300">Neck</Typography>
                                            </Box>
                                            <Box className="flex items-center gap-1">
                                                <Checkbox
                                                    checked={office.scheduleTypes.back}
                                                    onChange={() => handleScheduleTypeToggle(office.id, 'back')}
                                                    size="small"
                                                    sx={{
                                                        color: '#EAB308',
                                                        '&.Mui-checked': { color: '#EAB308' },
                                                    }}
                                                />
                                                <Typography variant="caption" className="text-gray-700 dark:text-gray-300">Back</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" className="text-sm">
                                            {office.address}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{office.phone}</Typography>
                                    </TableCell>
                                        </>
                                    ) : (
                                        // Specialist Columns
                                        <>
                                            <TableCell>
                                                <Typography variant="body2" className="font-medium">
                                                    {office.name}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {office.clinicType ? office.clinicType.charAt(0).toUpperCase() + office.clinicType.slice(1) : 'Orthopedic'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" className="text-sm">
                                                    {office.address}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={office.active}
                                                    onChange={() => handleToggle(office.id, 'active')}
                                                    sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#EAB308',
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: '#EAB308',
                                                        },
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box className="flex flex-col gap-1">
                                                    <Box className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={office.scheduleTypes.neck}
                                                            onChange={() => handleScheduleTypeToggle(office.id, 'neck')}
                                                            size="small"
                                                            sx={{
                                                                color: '#EAB308',
                                                                padding: '4px',
                                                                '&.Mui-checked': { color: '#EAB308' },
                                                                '& .MuiSvgIcon-root': { fontSize: 24 }
                                                            }}
                                                        />
                                                        <Typography variant="body2" className="text-gray-900 dark:text-gray-100 font-bold">Neck</Typography>
                                                    </Box>
                                                    <Box className="flex items-center gap-2">
                                                        <Checkbox
                                                            checked={office.scheduleTypes.back}
                                                            onChange={() => handleScheduleTypeToggle(office.id, 'back')}
                                                            size="small"
                                                            sx={{
                                                                color: '#EAB308',
                                                                padding: '4px',
                                                                '&.Mui-checked': { color: '#EAB308' },
                                                                '& .MuiSvgIcon-root': { fontSize: 24 }
                                                            }}
                                                        />
                                                        <Typography variant="body2" className="text-gray-900 dark:text-gray-100 font-bold">Back</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        </>
                                    )}

                                    {/* Actions Column (Common settings) */}
                                    <TableCell>
                                        <Box className="flex gap-2">
                                            <Tooltip title="Save">
                                                <IconButton onClick={() => handleSaveClick(office.id)} className="text-gray-400 hover:text-yellow-500">
                                                    <Box className="w-6 h-6 flex items-center justify-center">
                                                        <Image
                                                            src="/icons/iconos-svg/guardar.svg"
                                                            alt="Save"
                                                            width={24}
                                                            height={24}
                                                        />
                                                    </Box>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => handleEdit(office)} className="text-gray-500 dark:text-gray-400 hover:text-yellow-500">
                                                    <Box className="w-6 h-6 flex items-center justify-center">
                                                        <Image
                                                            src="/icons/iconos-svg/editar.svg"
                                                            alt="Edit"
                                                            width={24}
                                                            height={24}
                                                        />
                                                    </Box>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDeleteClick(office.id)} className="text-gray-500 dark:text-gray-400 hover:text-red-500">
                                                    <Box className="w-6 h-6 flex items-center justify-center">
                                                        <Image
                                                            src="/icons/iconos-svg/delete.svg"
                                                            alt="Delete"
                                                            width={24}
                                                            height={24}
                                                        />
                                                    </Box>
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Create Medical Office Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '30px',
                        overflow: 'hidden',
                        backgroundColor: '#FFFFFF',
                        boxShadow: '0 40px 60px -12px rgba(0, 0, 0, 0.3)',
                        '.dark &': {
                            backgroundColor: '#111827',
                        }
                    },
                    className: "bg-white dark:bg-gray-900"
                }}
                BackdropProps={{
                    sx: {
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        p: 4,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                    }}
                >
                    <Box>
                        <Typography variant="h5" className="font-extrabold text-2xl text-black dark:text-white">
                            {selectedOfficeId ? (filters.type === 'medical' ? 'Edit Medical Office' : 'Edit Specialist') : (filters.type === 'medical' ? 'Create Medical Office' : 'Create Specialist')}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={handleCloseDialog}
                        sx={{
                            color: '#9CA3AF',
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.08)' }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0 }}>
                    {filters.type === 'medical' ? (
                        <>
                            {/* Medical Office Form Content (Existing) */}
                    {/* Top Section - White */}
                    <Box className="bg-white dark:bg-gray-900 px-8 py-8">
                        <Grid container columnSpacing={4} rowSpacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                    Medical Office Name<span className="text-red-500">*</span>
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={newOffice.name}
                                    onChange={(e) => setNewOffice({ ...newOffice, name: e.target.value })}
                                            size="small"
                                            sx={textFieldStyles}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Borough<span className="text-red-500">*</span>
                                        </Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            value={newOffice.borough}
                                            onChange={(e) => setNewOffice({ ...newOffice, borough: e.target.value })}
                                            size="small"
                                            sx={selectFieldStyles}
                                        >
                                            {NYC_BOROUGHS.map((borough: string) => (
                                                <MenuItem key={borough} value={borough}>
                                                    {borough}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Doctor Name
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.doctorName}
                                            onChange={(e) => setNewOffice({ ...newOffice, doctorName: e.target.value })}
                                            size="small"
                                            sx={textFieldStyles}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>


                            {/* Bottom Section - Gray */}
                            <Box className="bg-gray-50 dark:bg-gray-800/50 px-8 py-8">
                                <Grid container columnSpacing={4} rowSpacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Contact Name
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.contactName}
                                            onChange={(e) => setNewOffice({ ...newOffice, contactName: e.target.value })}
                                            size="small"
                                            sx={grayTextFieldStyles}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Contact Lastname
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.contactLastname}
                                            onChange={(e) => setNewOffice({ ...newOffice, contactLastname: e.target.value })}
                                            size="small"
                                            sx={grayTextFieldStyles}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Contact Email
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.contactEmail}
                                            onChange={(e) => setNewOffice({ ...newOffice, contactEmail: e.target.value })}
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                            height: '45px',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            paddingLeft: '20px !important',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                            borderWidth: '1px !important',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Contact Phone
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.phone}
                                            onChange={(e) => setNewOffice({ ...newOffice, phone: e.target.value })}
                                            size="small"
                                            sx={grayTextFieldStyles}
                                        />
                                    </Grid>
                                </Grid>

                                <Box className="flex justify-end mt-8">
                                    <Button
                                        onClick={handleCreateOffice}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#EAB308 !important',
                                            color: '#FFFFFF !important',
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 'bold !important',
                                            px: 8,
                                            py: 1.5,
                                            minHeight: '48px',
                                            minWidth: '150px',
                                            borderRadius: '50px',
                                            boxShadow: '0 10px 20px -5px rgba(234, 179, 8, 0.4)',
                                            '&:hover': {
                                                backgroundColor: '#CA8A04 !important',
                                                boxShadow: '0 15px 25px -5px rgba(234, 179, 8, 0.5)',
                                                transform: 'translateY(-1px)',
                                            },
                                            transition: 'all 0.2s ease',
                                        }}
                                    >
                                        {selectedOfficeId ? 'Save Changes' : 'Create User'}
                                    </Button>
                                </Box>

                                {/* Additional Fields Section */}
                                <Grid container columnSpacing={4} rowSpacing={3} className="mt-8">
                                    {/* Row 1: Contact emails / Emails to Medical Updates */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Contact emails
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.contactEmails}
                                            onChange={(e) => setNewOffice({ ...newOffice, contactEmails: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                                    height: '45px',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Emails to Medical Updates
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.emailsMedicalUpdates}
                                            onChange={(e) => setNewOffice({ ...newOffice, emailsMedicalUpdates: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                                    height: '45px',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Row 2: Email for Medical Records / Specialists */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Email for Medical Records
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.emailMedicalRecords}
                                            onChange={(e) => setNewOffice({ ...newOffice, emailMedicalRecords: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                                    height: '45px',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Specialists
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.specialists}
                                            onChange={(e) => setNewOffice({ ...newOffice, specialists: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                                    height: '45px',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Row 3: Primary Phone* / Secondary Phone */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Primary Phone<span className="text-red-500">*</span>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.primaryPhone}
                                            onChange={(e) => setNewOffice({ ...newOffice, primaryPhone: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                                    height: '45px',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Secondary Phone
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.secondaryPhone}
                                            onChange={(e) => setNewOffice({ ...newOffice, secondaryPhone: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                                    height: '45px',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Row 4: Cell Phone / Primary Email */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Cell Phone
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.cellPhone}
                                            onChange={(e) => setNewOffice({ ...newOffice, cellPhone: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                                    height: '45px',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Primary Email
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.primaryEmail}
                                            onChange={(e) => setNewOffice({ ...newOffice, primaryEmail: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                                    height: '45px',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Row 5: Secondary Email / Address Primary */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Secondary Email
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.secondaryEmail}
                                            onChange={(e) => setNewOffice({ ...newOffice, secondaryEmail: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                                    height: '45px',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Address Primary
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.addressPrimary}
                                            onChange={(e) => setNewOffice({ ...newOffice, addressPrimary: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                                    height: '45px',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Row 6: Address Secondary  */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Address Secondary
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.addressSecondary}
                                            onChange={(e) => setNewOffice({ ...newOffice, addressSecondary: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                                    height: '45px',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Row 7: Priority / Transportation */}
                                    <Grid item xs={12} md={3}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Priority
                                        </Typography>
                                        <Switch
                                            checked={newOffice.priority}
                                            onChange={(e) => setNewOffice({ ...newOffice, priority: e.target.checked })}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#EAB308',
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#EAB308',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Transportation
                                        </Typography>
                                        <Switch
                                            checked={newOffice.transportation}
                                            onChange={(e) => setNewOffice({ ...newOffice, transportation: e.target.checked })}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#EAB308',
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#EAB308',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Row 8: Limit per Clinic/Owner / Network */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Limit per Clinic/Owner
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                            value={newOffice.limitPerClinicOwner}
                                            onChange={(e) => setNewOffice({ ...newOffice, limitPerClinicOwner: e.target.value })}
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '25px',
                                            height: '45px',
                                            backgroundColor: '#FFFFFF',
                                        },
                                        '& .MuiSelect-select': {
                                            paddingLeft: '20px !important',
                                            display: 'flex',
                                            alignItems: 'center',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                            borderWidth: '1px !important',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                        '& .MuiSelect-icon': {
                                            color: '#EAB308',
                                            fontSize: '2rem',
                                        },
                                    }}
                                >
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="no-limit">No limit</MenuItem>
                                            <MenuItem value="5">5</MenuItem>
                                            <MenuItem value="10">10</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Network
                                </Typography>
                                <TextField
                                            select
                                    fullWidth
                                            value={newOffice.limitPerClinicOwner}
                                            onChange={(e) => setNewOffice({ ...newOffice, limitPerClinicOwner: e.target.value })}
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '25px',
                                            height: '45px',
                                            backgroundColor: '#FFFFFF',
                                                },
                                                '& .MuiSelect-select': {
                                                    paddingLeft: '20px !important',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .MuiSelect-icon': {
                                                    color: '#EAB308',
                                                    fontSize: '2rem',
                                                },
                                            }}
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="network-1">Network 1</MenuItem>
                                            <MenuItem value="network-2">Network 2</MenuItem>
                                            <MenuItem value="network-3">Network 3</MenuItem>
                                        </TextField>

                                    </Grid>

                                    {/* Row 9: Days and hours of clinic service (textarea full width) */}
                                    <Grid item xs={12}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Days and hours of clinic service
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={newOffice.clinicServiceSchedule}
                                            onChange={(e) => setNewOffice({ ...newOffice, clinicServiceSchedule: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            paddingLeft: '20px !important',
                                                    paddingTop: '12px !important',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                            borderWidth: '1px !important',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                    }}
                                />
                            </Grid>

                                    {/* Row 10: Type of clinic (select full width) */}
                            <Grid item xs={12} md={6}>
                                <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Type of clinic
                                </Typography>
                                <TextField
                                            select
                                    fullWidth
                                            value={newOffice.clinicType}
                                            onChange={(e) => setNewOffice({ ...newOffice, clinicType: e.target.value })}
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '25px',
                                            height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                },
                                                '& .MuiSelect-select': {
                                                    paddingLeft: '20px !important',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .MuiSelect-icon': {
                                                    color: '#EAB308',
                                                    fontSize: '2rem',
                                                },
                                            }}
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="orthopedic">Orthopedic</MenuItem>
                                            <MenuItem value="neurology">Neurology</MenuItem>
                                            <MenuItem value="general">General</MenuItem>
                                        </TextField>
                                    </Grid>

                                    {/* Row 11: Type of Injuries (textarea full width) */}
                                    <Grid item xs={12}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Type of Injuries
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={newOffice.typeOfInjuries}
                                            onChange={(e) => setNewOffice({ ...newOffice, typeOfInjuries: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    backgroundColor: '#FFF',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            paddingLeft: '20px !important',
                                                    paddingTop: '12px !important',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                            borderWidth: '1px !important',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                    }}
                                />
                            </Grid>

                                    {/* Row 12: Type of Service (select full width) */}
                            <Grid item xs={12} md={6}>
                                <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Type of Service
                                </Typography>
                                <TextField
                                            select
                                    fullWidth
                                            value={newOffice.typeOfService}
                                            onChange={(e) => setNewOffice({ ...newOffice, typeOfService: e.target.value })}
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '25px',
                                            height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                        },
                                                '& .MuiSelect-select': {
                                            paddingLeft: '20px !important',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                            borderWidth: '1px !important',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                                '& .MuiSelect-icon': {
                                                    color: '#EAB308',
                                                    fontSize: '2rem',
                                                },
                                            }}
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="primary">Primary</MenuItem>
                                            <MenuItem value="secondary">Secondary</MenuItem>
                                        </TextField>
                            </Grid>

                                    {/* Row 13: Status (select full width) */}
                            <Grid item xs={12} md={6}>
                                <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Status
                                </Typography>
                                <TextField
                                            select
                                    fullWidth
                                            value={newOffice.status}
                                            onChange={(e) => setNewOffice({ ...newOffice, status: e.target.value })}
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '25px',
                                            height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                },
                                                '& .MuiSelect-select': {
                                                    paddingLeft: '20px !important',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .MuiSelect-icon': {
                                                    color: '#EAB308',
                                                    fontSize: '2rem',
                                                },
                                            }}
                                        >
                                            <MenuItem value="">Select</MenuItem>
                                            <MenuItem value="active">Active</MenuItem>
                                            <MenuItem value="inactive">Inactive</MenuItem>
                                        </TextField>
                                    </Grid>

                                    {/* Row 14: Doctor Quota */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Doctor Quota
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.doctorQuota}
                                            onChange={(e) => setNewOffice({ ...newOffice, doctorQuota: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            paddingLeft: '20px !important',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                            borderWidth: '1px !important',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                    }}
                                />
                            </Grid>
                                    {/* Row 15: Notes  */}
                                    <Grid item xs={12}>
                                <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Notes
                                </Typography>
                                <TextField
                                    fullWidth
                                            multiline
                                            rows={4}
                                            value={newOffice.notes}
                                            onChange={(e) => setNewOffice({ ...newOffice, notes: e.target.value })}
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '25px',
                                            backgroundColor: '#FFF',
                                        },
                                        '& .MuiOutlinedInput-input': {
                                            paddingLeft: '20px !important',
                                                    paddingTop: '12px !important',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                            borderWidth: '1px !important',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#9CA3AF !important',
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>

                                {/* Action Buttons */}
                                <Box className="flex justify-between mt-8">
                            <Button
                                onClick={handleCloseDialog}
                                variant="outlined"
                                sx={{
                                    borderRadius: '50px',
                                    textTransform: 'none',
                                            border: '2px solid #EAB308 !important',
                                            borderColor: '#EAB308 !important',
                                            color: '#EAB308 !important',
                                            fontWeight: 'bold !important',
                                            minWidth: '150px',
                                    fontSize: '1rem',
                                    px: 4,
                                    py: 1.5,
                                            minHeight: '48px',
                                            backgroundColor: '#FFFFFF !important',
                                            '& .MuiButton-label': {
                                                fontWeight: 'bold !important',
                                            },
                                    '&:hover': {
                                                border: '2px solid #EAB308 !important',
                                                borderColor: '#EAB308 !important',
                                                backgroundColor: '#FFFFFF !important',
                                    },
                                }}
                            >
                                        Back
                            </Button>
                            <Button
                                onClick={handleCreateOffice}
                                variant="contained"
                                sx={{
                                    backgroundColor: '#EAB308 !important',
                                    color: '#FFFFFF !important',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                            fontWeight: 'bold !important',
                                            px: 8,
                                    py: 1.5,
                                    minHeight: '48px',
                                            minWidth: '150px',
                                    borderRadius: '50px',
                                    boxShadow: '0 10px 20px -5px rgba(234, 179, 8, 0.4)',
                                            '& .MuiButton-label': {
                                                fontWeight: 'bold !important',
                                            },
                                    '&:hover': {
                                        backgroundColor: '#CA8A04 !important',
                                        boxShadow: '0 15px 25px -5px rgba(234, 179, 8, 0.5)',
                                        transform: 'translateY(-1px)',
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                        {selectedOfficeId ? 'Save Changes' : 'Create'}
                            </Button>
                        </Box>

                    </Box>
                        </>
                    ) : (
                        // Specialist Form Content
                        <Box>
                            {/* Top Section - White */}
                            <Box className="bg-white dark:bg-gray-900 px-8 py-8">
                                <Grid container columnSpacing={4} rowSpacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Doctor Name
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.doctorName}
                                            onChange={(e) => setNewOffice({ ...newOffice, doctorName: e.target.value })}
                                            placeholder=""
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                        backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#EAB308 !important',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Phone
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.primaryPhone}
                                            onChange={(e) => setNewOffice({ ...newOffice, primaryPhone: e.target.value })}
                                            placeholder=""
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#EAB308 !important',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Email
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.primaryEmail}
                                            onChange={(e) => setNewOffice({ ...newOffice, primaryEmail: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#EAB308 !important',
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Contact
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.contactName}
                                            onChange={(e) => setNewOffice({ ...newOffice, contactName: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#EAB308 !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Type of Specialist */}
                                    <Grid item xs={12}>
                                        <Typography className="font-bold text-sm mb-4 text-black dark:text-white">
                                            Type of Specialist
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {['Hand specialist', 'Pain Management', 'Spine Surgeon', 'Neurologist', 'Orthopedic'].map((type) => {
                                                // Parse specialists string to array for checking
                                                const specialistsArray = newOffice.specialists 
                                                    ? newOffice.specialists.split(',').map(s => s.trim()).filter(s => s)
                                                    : [];
                                                const isChecked = specialistsArray.includes(type);
                                                
                                                return (
                                                    <Grid item xs={12} md={6} key={type}>
                                                        <Box className="flex items-center gap-2">
                                                            <Checkbox
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    const currentArray = newOffice.specialists 
                                                                        ? newOffice.specialists.split(',').map(s => s.trim()).filter(s => s)
                                                                        : [];
                                                                    let updatedArray;
                                                                    if (e.target.checked) {
                                                                        // Add type if not already in array
                                                                        updatedArray = [...currentArray, type];
                                                                    } else {
                                                                        // Remove type from array
                                                                        updatedArray = currentArray.filter(t => t !== type);
                                                                    }
                                                                    // Convert array back to comma-separated string
                                                                    setNewOffice({ ...newOffice, specialists: updatedArray.join(', ') });
                                                                }}
                                                                sx={{
                                                                    color: '#EAB308',
                                                                    '&.Mui-checked': { color: '#EAB308' },
                                                                    '& .MuiSvgIcon-root': { fontSize: 28 } // Larger box
                                                                }}
                                                            />
                                                            <Typography className="font-bold text-black dark:text-white">
                                                                {type}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    </Grid>

                                    {/* Specialist Address */}
                                    <Grid item xs={12}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Specialist Address
                                        </Typography>
                                        <RadioGroup
                                            row
                                            value={newOffice.hasSpecialistAddress ? 'Yes' : 'No'}
                                            onChange={(e) => setNewOffice({ ...newOffice, hasSpecialistAddress: e.target.value === 'Yes' })}
                                        >
                                            <FormControlLabel
                                                value="Yes"
                                                control={<Radio sx={{ color: '#EAB308', '&.Mui-checked': { color: '#EAB308' } }} />} // Using gray to match 'No' in image or inactive? Image shows unchecked gray. Let's use gray unselected.
                                                label={<span className="font-bold text-black dark:text-white">Yes</span>}
                                            />
                                            <FormControlLabel
                                                value="No"
                                                control={<Radio sx={{ color: '#EAB308', '&.Mui-checked': { color: '#EAB308' } }} />}
                                                label={<span className="font-bold text-black dark:text-white">No</span>}
                                            />
                                        </RadioGroup>
                                    </Grid>
                                </Grid>
                    </Box>

                            {/* Bottom Section - Gray Background */}
                            <Box className="bg-gray-50 dark:bg-gray-800/50 px-8 py-8">
                                <Grid container columnSpacing={4} rowSpacing={3}>
                                    {/* Medical Center address* */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Medical Center address<span className="text-yellow-500">*</span>
                    </Typography>
                                        <TextField
                                            fullWidth
                                            required
                                            value={newOffice.medicalCenterAddress || ''}
                                            onChange={(e) => setNewOffice({ ...newOffice, medicalCenterAddress: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#EAB308 !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Hours of Atention* */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Hours of Atention<span className="text-yellow-500">*</span>
                    </Typography>
                                        <TextField
                                            fullWidth
                                            required
                                            value={newOffice.hoursOfAttention || ''}
                                            onChange={(e) => setNewOffice({ ...newOffice, hoursOfAttention: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#EAB308 !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Phone* */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Phone<span className="text-yellow-500">*</span>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            required
                                            value={newOffice.medicalCenterPhone || ''}
                                            onChange={(e) => setNewOffice({ ...newOffice, medicalCenterPhone: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#EAB308 !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Extensions */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Extensions
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.extensions || ''}
                                            onChange={(e) => setNewOffice({ ...newOffice, extensions: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#EAB308 !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Contact emails */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Contact emails
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.contactEmails || ''}
                                            onChange={(e) => setNewOffice({ ...newOffice, contactEmails: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#EAB308 !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Contacts */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Contacts
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.contacts || ''}
                                            onChange={(e) => setNewOffice({ ...newOffice, contacts: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#EAB308 !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Medical Records Emails */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Medical Records Emails
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            value={newOffice.medicalRecordsEmails || ''}
                                            onChange={(e) => setNewOffice({ ...newOffice, medicalRecordsEmails: e.target.value })}
                                            size="small"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '25px',
                                                    height: '45px',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#000000',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    paddingLeft: '20px !important',
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                    borderWidth: '1px !important',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#9CA3AF !important',
                                                },
                                                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: '#EAB308 !important',
                                                },
                                            }}
                                        />
                                    </Grid>

                                    {/* Status - Switch */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Status
                                        </Typography>
                                        <Box className="flex items-center gap-2">
                                            <Typography className="text-sm text-black dark:text-white">Active</Typography>
                                            <Switch
                                                checked={newOffice.active}
                                                onChange={(e) => setNewOffice({ ...newOffice, active: e.target.checked })}
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: '#EAB308',
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: '#EAB308',
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Grid>

                                    {/* Notes Section with Cancel and Confirm buttons */}
                                    <Grid item xs={12}>
                                        <Box>
                                            <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                                Notes
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                value={newOffice.notes || ''}
                                                onChange={(e) => setNewOffice({ ...newOffice, notes: e.target.value })}
                                                size="small"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '25px',
                                                        backgroundColor: '#FFFFFF',
                                                        color: '#000000',
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#9CA3AF !important',
                                                        borderWidth: '1px !important',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#9CA3AF !important',
                                                    },
                                                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#EAB308 !important',
                                                    },
                                                }}
                                            />
                                            <Box className="flex mt-4 justify-end" sx={{ gap: '44px' }}>
                        <Button
                                                    onClick={handleCloseDialog}
                            variant="outlined"
                            sx={{
                                borderRadius: '50px',
                                textTransform: 'none',
                                                        border: '2px solid #EAB308 !important',
                                                        borderColor: '#EAB308 !important',
                                                        color: '#EAB308 !important',
                                                        fontWeight: 'bold !important',
                                                        minWidth: '120px',
                                fontSize: '1rem',
                                                        px: 4,
                                                        py: 1,
                                                        minHeight: '40px',
                                                        backgroundColor: '#FFFFFF !important',
                                                        '& .MuiButton-label': {
                                                            fontWeight: 'bold !important',
                                                        },
                                '&:hover': {
                                                            border: '2px solid #EAB308 !important',
                                                            borderColor: '#EAB308 !important',
                                                            backgroundColor: '#FFFFFF !important',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                                        backgroundColor: '#EAB308 !important',
                                                        color: '#FFFFFF !important',
                                textTransform: 'none',
                                fontSize: '1rem',
                                                        fontWeight: 'bold !important',
                                                        px: 4,
                                                        py: 1,
                                                        minHeight: '40px',
                                                        minWidth: '120px',
                                                        borderRadius: '50px',
                                                        boxShadow: '0 10px 20px -5px rgba(234, 179, 8, 0.4)',
                                                        '& .MuiButton-label': {
                                                            fontWeight: 'bold !important',
                                                        },
                                '&:hover': {
                                                            backgroundColor: '#CA8A04 !important',
                                                            boxShadow: '0 15px 25px -5px rgba(234, 179, 8, 0.5)',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                                                    Confirm
                        </Button>
                    </Box>
                                        </Box>
                                    </Grid>

                                    {/* Status - Switch before Note */}
                                    <Grid item xs={12} md={6}>
                                        <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                            Status
                                        </Typography>
                                        <Box className="flex items-center gap-2">
                                            <Typography className="text-sm text-black dark:text-white">Active</Typography>
                                            <Switch
                                                checked={newOffice.secondStatus !== undefined ? newOffice.secondStatus : true}
                                                onChange={(e) => setNewOffice({ ...newOffice, secondStatus: e.target.checked })}
                                                sx={{
                                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                                        color: '#EAB308',
                                                    },
                                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                        backgroundColor: '#EAB308',
                                                    },
                                                }}
                        />
                    </Box>
                                    </Grid>

                                    {/* Note Section with Cancel and Create specialist buttons */}
                                    <Grid item xs={12}>
                                        <Box>
                                            <Typography className="font-bold text-sm mb-2 text-black dark:text-white">
                                                Note
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                value={newOffice.note || ''}
                                                onChange={(e) => setNewOffice({ ...newOffice, note: e.target.value })}
                                                size="small"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '25px',
                                                        backgroundColor: '#FFFFFF',
                                                        color: '#000000',
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#9CA3AF !important',
                                                        borderWidth: '1px !important',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#9CA3AF !important',
                                                    },
                                                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#EAB308 !important',
                                                    },
                                                }}
                                            />
                                            <Box className="flex mt-4 justify-end" sx={{ gap: '24px' }}>
                        <Button
                                                    onClick={handleCloseDialog}
                            variant="outlined"
                            sx={{
                                borderRadius: '50px',
                                textTransform: 'none',
                                                        border: '2px solid #EAB308 !important',
                                                        borderColor: '#EAB308 !important',
                                                        color: '#EAB308 !important',
                                                        fontWeight: 'bold !important',
                                                        minWidth: '120px',
                                fontSize: '1rem',
                                                        px: 4,
                                                        py: 1,
                                                        minHeight: '40px',
                                                        backgroundColor: '#FFFFFF !important',
                                                        '& .MuiButton-label': {
                                                            fontWeight: 'bold !important',
                                                        },
                                '&:hover': {
                                                            border: '2px solid #EAB308 !important',
                                                            borderColor: '#EAB308 !important',
                                                            backgroundColor: '#FFFFFF !important',
                                },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                                                    onClick={handleCreateOffice}
                            variant="contained"
                            sx={{
                                backgroundColor: '#EAB308 !important',
                                                        color: '#FFFFFF !important',
                                                        textTransform: 'none',
                                fontSize: '1rem',
                                                        fontWeight: 'bold !important',
                                                        px: 4,
                                                        py: 1,
                                                        minHeight: '40px',
                                                        minWidth: '150px',
                                                        borderRadius: '50px',
                                                        boxShadow: '0 10px 20px -5px rgba(234, 179, 8, 0.4)',
                                                        '& .MuiButton-label': {
                                                            fontWeight: 'bold !important',
                                                        },
                                '&:hover': {
                                    backgroundColor: '#CA8A04 !important',
                                                            boxShadow: '0 15px 25px -5px rgba(234, 179, 8, 0.5)',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease',
                            }}
                        >
                                                    {selectedOfficeId ? 'Save Changes' : 'Create specialist'}
                        </Button>
                    </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 0 }} />
            </Dialog>

            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                icon="/icons/iconos-svg/delete.svg"
                title="Delete Office?"
                message="Are you sure you want to delete this office? This action cannot be undone."
                confirmText="Delete it"
                confirmColor="#EF4444"
            />

            <ConfirmDialog
                open={saveDialogOpen}
                onClose={() => setSaveDialogOpen(false)}
                onConfirm={handleConfirmSave}
                icon="/icons/iconos-svg/guardar.svg"
                title="Save Changes?"
                message="Do you want to save the modifications made to this medical office?"
                confirmText="Save Updates"
            />
        </>
    );
}
