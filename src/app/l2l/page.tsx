'use client';

import { useState, useEffect } from 'react';

// ... (keep Mui imports needed for the rest of the file)
import {
    Container,
    Box,
    Typography,
    Paper,
    Grid,
    IconButton, // Might be unused now? No, headers used it but rest of page might not. Wait, Header used it.
    Avatar,
    Button,
    Alert,
    Tabs,
    Tab,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterAltOutlined as FilterIcon,
    Check as CheckIcon,
    AccessTime as ClockIcon,
    AttachMoney as MoneyIcon,
    Description as DocIcon,
    Numbers as HashIcon,
} from '@mui/icons-material';


import { L2LUserData, L2LWeek } from '../../lib/types/l2l';
import { CustomInput } from '@/components/forms/CustomInput';
import { DateInputStyles } from '@/components/forms/DateInputStyles';
import { L2LQuickIntakeFormData, L2LQuickIntakeValidationErrors } from '@/lib/types/l2l-quick-intake';
import { AUTOMOBILE_ACCIDENT_OPTIONS, ACCIDENT_LOCATION_OPTIONS } from '@/lib/constants/l2l-quick-intake';
import { ClientProcess } from '@/lib/types/l2l-process';

const STATS = [
    {
        id: 1,
        icon: <HashIcon sx={{ color: '#9CA3AF' }} />, // Gray
        bgColor: '#F3F4F6',
        value: '15',
        label: 'Number of\nMy Cases',
        color: 'text-gray-500',
    },
    {
        id: 2,
        icon: <CheckIcon sx={{ color: '#4ADE80' }} />, // Green
        bgColor: '#DCFCE7',
        value: '2',
        label: 'My Approved\nCases',
        color: 'text-green-500',
    },
    {
        id: 3,
        icon: <MoneyIcon sx={{ color: '#F472B6' }} />, // Pink
        bgColor: '#FCE7F3',
        value: '$12.000',
        label: 'Referral fees\nreceived',
        color: 'text-pink-400',
    },
    {
        id: 4,
        icon: <ClockIcon sx={{ color: '#60A5FA' }} />, // Blue
        bgColor: '#DBEAFE',
        value: '9',
        label: 'My Pending\nSignature Cases',
        color: 'text-blue-400',
    },
    {
        id: 5,
        icon: <DocIcon sx={{ color: '#FACC15' }} />, // Yellow
        bgColor: '#FEF9C3',
        value: '$1500',
        label: 'Referral fees\npending',
        color: 'text-yellow-400',
    },
];

const WEEKS = [
    { id: 1, status: 'Cumplio' },
    { id: 2, status: 'Cumplio' },
    { id: 3, status: 'Cumplio' },
    { id: 4, status: 'no_cumplio' },
    { id: 5, status: 'Cumplio' },
    { id: 6, status: 'Cumplio' },
    { id: 7, status: 'Cumplio' },
    { id: 8, status: 'pendiente' },
    { id: 9, status: 'Cumplio' },
    { id: 10, status: 'pendiente' },
    { id: 11, status: 'pendiente' },
    { id: 12, status: 'pendiente' },
];

// ... (keep const STATS but maybe remove 'value' or ignore it)
// ... (keep const WEEKS as fallback or remove if not needed)

import { useSession } from 'next-auth/react';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`l2l-tabpanel-${index}`}
            aria-labelledby={`l2l-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

export default function L2LPage() {
    const { data: session } = useSession();
    const userName = session?.user?.name || '';
    const [l2lData, setL2lData] = useState<L2LUserData | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [formData, setFormData] = useState<L2LQuickIntakeFormData>({
        clientPhoneNumber: '',
        clientFirstName: '',
        clientLastName: '',
        wasAutomobileAccident: '',
        accidentLocation: '',
        accidentDate: '',
        note: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState<L2LQuickIntakeValidationErrors>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [filterType, setFilterType] = useState('all');

    // My Cases State
    const [myCasesSearch, setMyCasesSearch] = useState('');
    const [myCasesFilterAnchor, setMyCasesFilterAnchor] = useState<null | HTMLElement>(null);
    const [myCasesFilter, setMyCasesFilter] = useState('all');

    const handleMyCasesFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setMyCasesFilterAnchor(event.currentTarget);
    };

    const handleMyCasesFilterClose = () => {
        setMyCasesFilterAnchor(null);
    };

    const handleMyCasesSelect = (type: string) => {
        setMyCasesFilter(type);
        handleMyCasesFilterClose();
    };

    const MY_CASES_DATA = [
        {
            id: '25-01-0000',
            subId: '35-01-0',
            role: 'Main Lead',
            name: 'Carmen Doe',
            phone: '(212) 111-1222',
            type: 'AutoAccident',
            date: '01-28-2026',
            status: 'active'
        },
        {
            id: '25-01-0001',
            subId: '35-01-1',
            role: 'Main Lead',
            name: 'John Smith',
            phone: '(212) 555-0123',
            type: 'AutoAccident',
            date: '01-29-2026',
            status: 'pending'
        },
        {
            id: '25-01-0002',
            subId: '35-01-2',
            role: 'Main Lead',
            name: 'Alice Johnson',
            phone: '(212) 555-0199',
            type: 'SlipAndFall',
            date: '01-05-2026',
            status: 'active'
        }
    ];

    const filteredMyCases = MY_CASES_DATA.filter(item => {
        const matchesSearch = myCasesSearch === '' ||
            item.name.toLowerCase().includes(myCasesSearch.toLowerCase()) ||
            item.id.includes(myCasesSearch) ||
            item.phone.includes(myCasesSearch);

        const matchesFilter = myCasesFilter === 'all' || item.status === myCasesFilter;

        return matchesSearch && matchesFilter;
    });

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFilterSelect = (type: string) => {
        setFilterType(type);
        handleFilterClose();
    };
    const [clientProcesses, setClientProcesses] = useState<ClientProcess[]>([]);

    const handleWeekStatusToggle = async (clientId: string, weekId: number) => {
        const clientIndex = clientProcesses.findIndex(c => c.id === clientId);
        if (clientIndex === -1) return;

        const client = clientProcesses[clientIndex];
        const weekIndex = client.weeks.findIndex(w => w.weekNumber === weekId);
        if (weekIndex === -1) return;

        // Cycle status: Cumplio -> no_cumplio -> pendiente -> Cumplio
        const currentStatus = client.weeks[weekIndex].status;
        let nextStatus: 'Cumplio' | 'no_cumplio' | 'pendiente' = 'Cumplio';
        if (currentStatus === 'Cumplio') nextStatus = 'no_cumplio';
        else if (currentStatus === 'no_cumplio') nextStatus = 'pendiente';

        const newWeeks = [...client.weeks];
        newWeeks[weekIndex] = { ...newWeeks[weekIndex], status: nextStatus };

        // Recalculate percentage
        const completed = newWeeks.filter(w => w.status === 'Cumplio').length;
        const total = 12; // Assuming 12 weeks
        const newPercentage = Math.round((completed / total) * 100);

        const updatedClient = {
            ...client,
            weeks: newWeeks,
            attendancePercentage: newPercentage
        };

        // Optimistic update
        const newProcesses = [...clientProcesses];
        newProcesses[clientIndex] = updatedClient;
        setClientProcesses(newProcesses);

        // Save to backend
        try {
            await fetch('/api/l2l/processes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedClient)
            });
        } catch (e) {
            console.error('Failed to save process update', e);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch L2L Data
                const l2lResponse = await fetch('/api/l2l/data');
                // Check if 401?
                if (l2lResponse.ok) {
                    const l2lResult = await l2lResponse.json();
                    if (l2lResult.success) {
                        setL2lData(l2lResult.data);
                    }
                }

                // Fetch Client Processes
                const processesResponse = await fetch('/api/l2l/processes');
                if (processesResponse.ok) {
                    const processesResult = await processesResponse.json();
                    if (processesResult.success) {
                        setClientProcesses(processesResult.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (session) {
            fetchData();
        }
    }, [session]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Cumplio': return '#4ADE80'; // Green
            case 'no_cumplio': return '#F472B6'; // Pink
            default: return '#D1D5DB'; // Gray
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount).replace('USD', '$');
    };

    // Calculate dynamic values
    const currentWeeks = l2lData?.weeks || [];
    const completedWeeks = currentWeeks.filter(w => w.status === 'Cumplio').length;
    const percentage = currentWeeks.length > 0 ? Math.round((completedWeeks / currentWeeks.length) * 100) : 0;

    const getStatValue = (index: number) => {
        if (!l2lData) return '...';
        switch (index) {
            case 0: return l2lData.stats.totalCases;
            case 1: return l2lData.stats.approvedCases;
            case 2: return formatCurrency(l2lData.stats.referralFeesReceived);
            case 3: return l2lData.stats.pendingSignatureCases;
            case 4: return formatCurrency(l2lData.stats.referralFeesPending);
            default: return '';
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const errors: { [key: string]: boolean } = {};

        if (!formData.clientPhoneNumber) {
            errors.clientPhoneNumber = true;
        }
        if (!formData.clientFirstName) {
            errors.clientFirstName = true;
        }
        if (!formData.clientLastName) {
            errors.clientLastName = true;
        }
        if (!formData.wasAutomobileAccident) {
            errors.wasAutomobileAccident = true;
        }
        if (!formData.accidentLocation) {
            errors.accidentLocation = true;
        }
        if (!formData.accidentDate) {
            errors.accidentDate = true;
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/l2l/quick-intake', {
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

                setTimeout(() => {
                    setFormData({
                        clientPhoneNumber: '',
                        clientFirstName: '',
                        clientLastName: '',
                        wasAutomobileAccident: '',
                        accidentLocation: '',
                        accidentDate: '',
                        note: '',
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

    const filteredProcesses = clientProcesses.filter(client => {
        // Search filter
        if (searchQuery && !client.clientName.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Dropdown filter
        if (filterType === 'high_attendance') return client.attendancePercentage >= 50;
        if (filterType === 'low_attendance') return client.attendancePercentage < 50;
        if (filterType === 'has_failed') return client.weeks.some(w => w.status === 'no_cumplio');

        return true;
    });

    return (
        <>
            <DateInputStyles />
            <Box className="min-h-screen bg-gray-50 dark:bg-black pb-12">

                <Container maxWidth={false} className="px-4 sm:px-6 lg:px-12 max-w-[1600px]">
                    {/* Stats Section */}
                    {/* ... existing stats section ... */}
                    <Paper
                        elevation={0}
                        className="rounded-[20px] sm:rounded-[30px] p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                    >
                        <Grid container spacing={2} alignItems="center">
                            {STATS.map((stat, index) => (
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={2.4}
                                    key={stat.id}
                                    className={`${index !== STATS.length - 1 ? 'md:border-r md:border-gray-100' : ''}`}
                                >
                                    <Box className="flex flex-col items-center justify-center p-2 sm:p-3 lg:p-4 text-center">
                                        <Box className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                            <Box
                                                className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center"
                                                sx={{ backgroundColor: stat.bgColor }}
                                            >
                                                {stat.icon}
                                            </Box>
                                            <Typography variant="h4" className="font-bold text-black dark:text-white text-lg sm:text-xl lg:text-2xl">
                                                {getStatValue(index)}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            className="font-bold text-gray-800 dark:text-gray-200 whitespace-pre-line leading-tight text-xs sm:text-sm"
                                            sx={{ minHeight: { xs: '32px', sm: '36px', lg: '40px' } }}
                                        >
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>

                    {/* Process Section */}
                    {tabValue !== 3 && (
                        <Paper
                            elevation={0}
                            className="rounded-[20px] sm:rounded-[30px] p-4 sm:p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-gray-800 relative bg-white dark:bg-gray-900"
                        >
                            <Typography variant="h6" className="font-extrabold mb-6 sm:mb-8 lg:mb-12 uppercase tracking-wide text-base sm:text-lg lg:text-xl text-black dark:text-white">
                                PROCESS
                            </Typography>

                            <Box className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 lg:gap-0 mb-8 sm:mb-12 lg:mb-16">
                                {/* User */}
                                <Box className="flex flex-col items-center gap-2 pr-0 sm:pr-4 lg:pr-8 border-r-0 sm:border-r border-gray-200 w-full sm:w-auto">
                                    <Avatar sx={{ width: { xs: 48, sm: 52, lg: 56 }, height: { xs: 48, sm: 52, lg: 56 }, bgcolor: '#F3F4F6', color: '#000', fontWeight: 'bold' }}>
                                        {userName ? userName.charAt(0).toUpperCase() : 'U'}
                                    </Avatar>
                                    <Typography className="font-bold text-xs sm:text-sm whitespace-nowrap text-black dark:text-white">
                                        {userName || 'User'}
                                    </Typography>
                                </Box>

                                {/* Timeline */}
                                <Box className="flex-1 flex justify-between items-center px-0 sm:px-4 lg:px-8 border-r-0 sm:border-r border-gray-200 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                                    <Box className="flex gap-2 sm:gap-0 sm:justify-between w-full min-w-max sm:min-w-0">
                                        {currentWeeks.map((week, index) => (
                                            <Box key={week.id} className={`flex flex-col items-center gap-2 sm:gap-3 w-full min-w-[60px] sm:min-w-0 ${index !== currentWeeks.length - 1 ? 'border-r border-gray-200 pr-2 sm:pr-0' : ''}`}>
                                                <Typography className="text-[10px] sm:text-xs font-bold text-black dark:text-white mb-1">
                                                    week {week.id}
                                                </Typography>
                                                <Box
                                                    className="w-8 h-2 sm:w-10 sm:h-2.5 lg:w-12 lg:h-3 rounded-full"
                                                    sx={{ backgroundColor: getStatusColor(week.status) }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Pie Chart (CSS) */}
                                <Box className="flex flex-col items-center pl-0 sm:pl-4 lg:pl-8 w-full sm:w-auto">
                                    <Typography className="font-extrabold text-gray-600 dark:text-gray-300 mb-2 text-base sm:text-lg">{percentage}%</Typography>
                                    <Box
                                        className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full relative"
                                        sx={{
                                            background: `conic-gradient(#EAB308 0% ${percentage}%, #FFFFFF ${percentage}% 100%)`,
                                            border: '2px solid #9CA3AF',
                                            transform: 'rotate(0deg)',
                                        }}
                                    />
                                    <Typography className="font-bold text-xs sm:text-sm mt-2 sm:mt-3 text-center text-black dark:text-white">
                                        Attended appointments
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Bottom Action and Legend */}
                            <Box className="flex flex-col items-center justify-center mt-4 sm:mt-0">
                                <Button
                                    variant="contained"
                                    onClick={() => setTabValue(3)}
                                    sx={{
                                        backgroundColor: '#D4A017 !important',
                                        backgroundImage: 'linear-gradient(180deg, #EAB308 0%, #D97706 100%)',
                                        color: 'white !important',
                                        borderRadius: '80px',
                                        textTransform: 'none',
                                        fontWeight: '800',
                                        fontSize: { xs: '0.875rem', sm: '0.95rem', lg: '1rem' },
                                        px: { xs: 4, sm: 5, lg: 6 },
                                        py: { xs: 1, sm: 1.25, lg: 1.5 },
                                        border: 'none',
                                        textShadow: 'none',
                                        boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)',
                                        minWidth: { xs: '140px', sm: '160px', lg: '180px' },
                                        '&:hover': {
                                            backgroundColor: '#B8860B !important',
                                            backgroundImage: 'linear-gradient(180deg, #F59E0B 0%, #B45309 100%)',
                                            boxShadow: '0 6px 15px rgba(217, 119, 6, 0.4)',
                                        }
                                    }}
                                >
                                    View process
                                </Button>
                            </Box>

                            <Box className="flex justify-center w-full mt-6 sm:mt-0 sm:w-auto sm:absolute sm:bottom-8 sm:right-10 gap-3 sm:gap-6 text-[10px] sm:text-xs font-bold">
                                <Box className="flex flex-col items-center gap-1">
                                    <span className="text-gray-700 dark:text-gray-300">Complied</span>
                                    <Box className="w-6 h-1.5 sm:w-8 sm:h-2 rounded-full bg-green-400" />
                                </Box>
                                <Box className="flex flex-col items-center gap-1">
                                    <span className="text-gray-700 dark:text-gray-300">Pending</span>
                                    <Box className="w-6 h-1.5 sm:w-8 sm:h-2 rounded-full bg-gray-300" />
                                </Box>
                                <Box className="flex flex-col items-center gap-1">
                                    <span className="text-gray-700 dark:text-gray-300">No Complied</span>
                                    <Box className="w-6 h-1.5 sm:w-8 sm:h-2 rounded-full bg-pink-400" />
                                </Box>
                            </Box>
                        </Paper>
                    )}

                    {/* Navigation Tabs */}
                    <Box className="mb-4 sm:mb-6 border-b border-gray-200 mt-6 sm:mt-8 overflow-x-auto">
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#EAB308',
                                    height: 3,
                                },
                                '& .MuiTabs-flexContainer': {
                                    gap: { xs: '20px', sm: '40px', lg: '70px' },
                                },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.875rem', sm: '0.95rem', lg: '1rem' },
                                    color: 'text.primary',
                                    padding: { xs: '12px 8px', sm: '14px 0px', lg: '16px 0px' },
                                    minHeight: 'auto',
                                    minWidth: { xs: 'auto', sm: '100px' },
                                    marginRight: { xs: '20px', sm: '40px', lg: '70px' },
                                    '&:last-child': {
                                        marginRight: 0,
                                    },
                                    '&.Mui-selected': {
                                        color: '#EAB308 !important',
                                    },
                                    '&:hover': {
                                        color: '#EAB308 !important',
                                    },
                                },
                            }}
                        >
                            <Tab label="Quick Intake" className="text-black dark:text-white" />
                            <Tab label="My Intakes" className="text-black dark:text-white" />
                            <Tab label="My Cases" className="text-black dark:text-white" />
                            <Tab label="Process" className="text-black dark:text-white" />
                        </Tabs>
                    </Box>

                    {/* Tab Panels */}
                    <TabPanel value={tabValue} index={0}>
                        {/* Quick Intake Form */}
                        <Paper
                            elevation={0}
                            className="rounded-[20px] sm:rounded-[30px] p-4 sm:p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                        >
                            <Typography variant="h4" className="font-bold text-black dark:text-white mb-6 sm:mb-8 text-xl sm:text-2xl lg:text-3xl">
                                Quick intake
                            </Typography>

                            {error && (
                                <Alert
                                    severity="error"
                                    className="mb-6 rounded-xl border-2 border-red-200"
                                    sx={{
                                        backgroundColor: '#FEE2E2',
                                        color: '#DC2626',
                                        '& .MuiAlert-icon': { color: '#DC2626' }
                                    }}
                                >
                                    <strong>Error:</strong> {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert
                                    severity="success"
                                    className="mb-6 rounded-xl border-2 border-green-200"
                                    sx={{
                                        backgroundColor: '#D1FAE5',
                                        '& .MuiAlert-icon': { color: '#059669' }
                                    }}
                                >
                                    <strong>Success!</strong> Form submitted successfully!
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="Client's Phone Number"
                                            value={formData.clientPhoneNumber}
                                            onChange={(e: any) => {
                                                setFormData({ ...formData, clientPhoneNumber: e.target.value });
                                                setValidationErrors(prev => ({ ...prev, clientPhoneNumber: false }));
                                            }}
                                            required
                                            error={validationErrors.clientPhoneNumber}
                                            helperText={validationErrors.clientPhoneNumber ? 'This field is required' : ''}
                                            placeholder="Client's Phone Number"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="Client's First Name"
                                            value={formData.clientFirstName}
                                            onChange={(e: any) => {
                                                setFormData({ ...formData, clientFirstName: e.target.value });
                                                setValidationErrors(prev => ({ ...prev, clientFirstName: false }));
                                            }}
                                            required
                                            error={validationErrors.clientFirstName}
                                            helperText={validationErrors.clientFirstName ? 'This field is required' : ''}
                                            placeholder="Client's First Name"
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="Client's Last Name"
                                            value={formData.clientLastName}
                                            onChange={(e: any) => {
                                                setFormData({ ...formData, clientLastName: e.target.value });
                                                setValidationErrors(prev => ({ ...prev, clientLastName: false }));
                                            }}
                                            required
                                            error={validationErrors.clientLastName}
                                            helperText={validationErrors.clientLastName ? 'This field is required' : ''}
                                            placeholder="Client's Last Name"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="Was it an automobile accident?"
                                            value={formData.wasAutomobileAccident}
                                            onChange={(e: any) => {
                                                setFormData({ ...formData, wasAutomobileAccident: e.target.value });
                                                setValidationErrors(prev => ({ ...prev, wasAutomobileAccident: false }));
                                            }}
                                            required
                                            error={validationErrors.wasAutomobileAccident}
                                            helperText={validationErrors.wasAutomobileAccident ? 'This field is required' : ''}
                                            select
                                        >
                                            {AUTOMOBILE_ACCIDENT_OPTIONS.map((option: string) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </CustomInput>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="Where did the accident occur?"
                                            value={formData.accidentLocation}
                                            onChange={(e: any) => {
                                                setFormData({ ...formData, accidentLocation: e.target.value });
                                                setValidationErrors(prev => ({ ...prev, accidentLocation: false }));
                                            }}
                                            required
                                            error={validationErrors.accidentLocation}
                                            helperText={validationErrors.accidentLocation ? 'This field is required' : ''}
                                            select
                                        >
                                            {ACCIDENT_LOCATION_OPTIONS.map((location: string) => (
                                                <option key={location} value={location}>
                                                    {location}
                                                </option>
                                            ))}
                                        </CustomInput>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <CustomInput
                                            label="Accident Date"
                                            type="date"
                                            value={formData.accidentDate}
                                            onChange={(e: any) => {
                                                setFormData({ ...formData, accidentDate: e.target.value });
                                                setValidationErrors(prev => ({ ...prev, accidentDate: false }));
                                            }}
                                            required
                                            error={validationErrors.accidentDate}
                                            helperText={validationErrors.accidentDate ? 'This field is required' : ''}
                                        />
                                    </Grid>
                                </Grid>

                                <CustomInput
                                    label="Note"
                                    value={formData.note}
                                    onChange={(e: any) => setFormData({ ...formData, note: e.target.value })}
                                    multiline
                                    rows={4}
                                    placeholder="Add any additional notes..."
                                />

                                <Box className="flex justify-end mt-4 sm:mt-6">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="small"
                                        disabled={loading}
                                        sx={{
                                            minWidth: '140px',
                                            height: '36px',
                                            backgroundColor: '#EAB308 !important',
                                            color: '#FFFFFF !important',
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                            px: 3,
                                            py: 0.5,
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            boxShadow: '0 2px 8px rgba(234, 179, 8, 0.4)',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                backgroundColor: '#D97706 !important',
                                                boxShadow: '0 4px 12px rgba(234, 179, 8, 0.5)',
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:disabled': {
                                                background: '#D1D1D1 !important',
                                                color: '#6D6D6D',
                                            },
                                        }}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </span>
                                        ) : (
                                            'Send to Excalibur'
                                        )}
                                    </Button>
                                </Box>
                            </form>
                        </Paper>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <Box className="py-4 sm:py-6 lg:py-8">
                            <Typography variant="h4" className="font-bold text-black dark:text-white mb-6 sm:mb-8 lg:mb-12 text-xl sm:text-2xl lg:text-3xl">
                                My Intakes
                            </Typography>

                            <Box className="mb-6 sm:mb-8">
                                <Typography variant="h6" className="font-bold text-black dark:text-white mb-4 sm:mb-6 text-lg sm:text-xl">
                                    L2L Intakes
                                </Typography>
                                <Box className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                                    <Box className="relative w-full sm:w-80">
                                        <SearchIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-yellow-500" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                        <input
                                            type="text"
                                            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-full border border-gray-300 bg-white text-black focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-medium text-sm sm:text-base"
                                        />
                                    </Box>
                                    <Button
                                        variant="contained"
                                        className="rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-white font-bold normal-case shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                                        sx={{
                                            backgroundColor: '#D4A017 !important',
                                            backgroundImage: 'linear-gradient(180deg, #EAB308 0%, #D97706 100%)',
                                            boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)',
                                            border: '2px solid white',
                                            color: 'white !important',
                                            fontSize: { xs: '0.875rem', sm: '0.95rem' },
                                            '&:hover': {
                                                backgroundImage: 'linear-gradient(180deg, #F59E0B 0%, #B45309 100%)',
                                                boxShadow: '0 6px 15px rgba(217, 119, 6, 0.4)',
                                            },
                                        }}
                                    >
                                        New Intake L2L
                                    </Button>
                                </Box>
                            </Box>

                            <Paper elevation={0} className="w-full overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
                                <Box className="overflow-x-auto -mx-4 sm:mx-0">
                                    <Box className="min-w-full inline-block">
                                        <table className="w-full text-left border-collapse min-w-[1200px]">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                                    {['Case', 'Person', 'Name', 'Phone', 'Case type', 'Date of accident', 'Handling lawyer', 'Status', 'Creation date'].map((header) => (
                                                        <th key={header} className="p-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[1, 2, 3].map((item, index) => (
                                                    <tr key={item} className={`border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors ${index % 2 !== 0 ? "bg-yellow-50/30 dark:bg-yellow-900/10" : "bg-white dark:bg-gray-900"} hover:bg-gray-50 dark:hover:bg-gray-800`}>
                                                        <td className="p-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-900 dark:text-white">25-01-0000</span>
                                                                <span className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">35-01-0</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Main Lead</td>
                                                        <td className="p-4 text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">Carmen Doe</td>
                                                        <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">(212) 111-1222</td>
                                                        <td className="p-4 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">AutoAccident</td>
                                                        <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">12-28-2025</td>
                                                        <td className="p-4 text-sm font-medium text-gray-600 whitespace-nowrap">
                                                            <span className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold">Pending</span>
                                                        </td>
                                                        <td className="p-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-yellow-600 dark:text-yellow-500">Pending Full</span>
                                                                <span className="text-xs text-gray-400 dark:text-gray-500">Intake</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-500 dark:text-gray-400">1/06/2026</span>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">01:27:22 PM</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <Box className="py-4 sm:py-6 lg:py-8">
                            <Typography variant="h4" className="font-bold text-black dark:text-white mb-6 sm:mb-8 text-xl sm:text-2xl lg:text-3xl">
                                My Case
                            </Typography>

                            <Box className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                                <Box className="relative w-full sm:max-w-xs">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" sx={{ fontSize: 24 }} />
                                    <input
                                        type="text"
                                        placeholder="Search cases..."
                                        value={myCasesSearch}
                                        onChange={(e) => setMyCasesSearch(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-medium text-base text-black bg-white"
                                    />
                                </Box>
                                <Box>
                                    <Box
                                        onClick={handleMyCasesFilterClick}
                                        className="flex justify-center items-center w-12 h-12 rounded-xl shadow-md cursor-pointer hover:opacity-90 transition-all"
                                        sx={{
                                            backgroundColor: '#D4A017',
                                            backgroundImage: 'linear-gradient(180deg, #EAB308 0%, #D97706 100%)',
                                            boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)',
                                        }}
                                    >
                                        <FilterIcon className="text-white" sx={{ fontSize: 28 }} />
                                    </Box>
                                    <Menu
                                        anchorEl={myCasesFilterAnchor}
                                        open={Boolean(myCasesFilterAnchor)}
                                        onClose={handleMyCasesFilterClose}
                                    >
                                        <MenuItem onClick={() => handleMyCasesSelect('all')}>All Cases</MenuItem>
                                        <MenuItem onClick={() => handleMyCasesSelect('active')}>Active</MenuItem>
                                        <MenuItem onClick={() => handleMyCasesSelect('pending')}>Pending</MenuItem>
                                    </Menu>
                                </Box>
                            </Box>

                            <Paper elevation={0} className="w-full overflow-hidden rounded-[30px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-0 sm:p-2">
                                <Box className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[1000px]">
                                        <thead>
                                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                                {['Creation date', 'Case', 'Accident date', 'Email', 'Firm name', 'Status'].map((header) => (
                                                    <th key={header} className="p-6 text-sm font-extrabold text-black dark:text-white whitespace-nowrap">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredMyCases.length > 0 ? (
                                                filteredMyCases.map((item, index) => (
                                                    <tr key={item.id} className={`border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-yellow-50/20 dark:hover:bg-yellow-900/10 transition-colors ${index % 2 !== 0 ? "bg-[#FEFCE8] dark:bg-gray-800" : "bg-white dark:bg-gray-900"}`}>
                                                        <td className="p-6">
                                                            <Box className="flex flex-col">
                                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.id}</span>
                                                                <span className="text-sm font-medium text-gray-400 dark:text-gray-500">{item.subId}</span>
                                                            </Box>
                                                        </td>
                                                        <td className="p-6 text-sm font-medium text-gray-600 dark:text-gray-300">{item.role}</td>
                                                        <td className="p-6 text-sm font-medium text-gray-600 dark:text-gray-300">{item.name}</td>
                                                        <td className="p-6 text-sm font-medium text-gray-600 dark:text-gray-300">{item.phone}</td>
                                                        <td className="p-6 text-sm font-medium text-gray-600 dark:text-gray-300">{item.type}</td>
                                                        <td className="p-6 text-sm font-medium text-gray-600 dark:text-gray-300">{item.date}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                                        No cases found matching your search.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </Box>
                            </Paper>
                        </Box>
                    </TabPanel>

                    <TabPanel value={tabValue} index={3}>
                        <Box className="py-4 sm:py-6 lg:py-8">
                            <Paper
                                elevation={0}
                                className="rounded-[20px] sm:rounded-[30px] p-4 sm:p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                            >
                                <Box className="mb-6 sm:mb-8">
                                    <Typography variant="h6" className="font-extrabold uppercase tracking-wide mb-4 sm:mb-6 text-base sm:text-lg lg:text-xl text-black dark:text-white">
                                        PROCESS
                                    </Typography>

                                    <Box className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 lg:gap-0">
                                        <Box className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
                                            {/* Search Bar */}
                                            <Box className="flex-1 w-full sm:max-w-md">
                                                <Box className="relative">
                                                    <SearchIcon
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500"
                                                        sx={{ fontSize: { xs: 20, sm: 24 } }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Search..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all font-medium text-base text-black bg-white"
                                                    />
                                                </Box>
                                            </Box>

                                            {/* Filter Button */}
                                            <Box>
                                                <Box
                                                    onClick={handleFilterClick}
                                                    className="flex justify-center items-center w-12 h-12 rounded-xl shadow-md cursor-pointer hover:opacity-90 transition-all"
                                                    sx={{
                                                        backgroundColor: '#D4A017',
                                                        backgroundImage: 'linear-gradient(180deg, #EAB308 0%, #D97706 100%)',
                                                        boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)',
                                                    }}
                                                >
                                                    <FilterIcon className="text-white" sx={{ fontSize: 28 }} />
                                                </Box>
                                                <Menu
                                                    anchorEl={filterAnchorEl}
                                                    open={Boolean(filterAnchorEl)}
                                                    onClose={handleFilterClose}
                                                >
                                                    <MenuItem onClick={() => handleFilterSelect('all')}>All</MenuItem>
                                                    <MenuItem onClick={() => handleFilterSelect('high_attendance')}>High attendance (&ge; 50%)</MenuItem>
                                                    <MenuItem onClick={() => handleFilterSelect('low_attendance')}>Low attendance (&lt; 50%)</MenuItem>
                                                    <MenuItem onClick={() => handleFilterSelect('has_failed')}>With failures</MenuItem>
                                                </Menu>
                                            </Box>
                                        </Box>

                                        {/* Legend */}
                                        <Box className="flex items-center justify-center lg:justify-end gap-3 sm:gap-6">
                                            <Box className="flex gap-3 sm:gap-6 text-[10px] sm:text-xs font-bold">
                                                <Box className="flex flex-col items-center gap-1">
                                                    <span className="text-gray-700 dark:text-gray-300">Complied</span>
                                                    <Box className="w-6 h-1.5 sm:w-8 sm:h-2 rounded-full bg-green-400" />
                                                </Box>
                                                <Box className="flex flex-col items-center gap-1">
                                                    <span className="text-gray-700 dark:text-gray-300">Pending</span>
                                                    <Box className="w-6 h-1.5 sm:w-8 sm:h-2 rounded-full bg-gray-300" />
                                                </Box>
                                                <Box className="flex flex-col items-center gap-1">
                                                    <span className="text-gray-700 dark:text-gray-300">Not Complied</span>
                                                    <Box className="w-6 h-1.5 sm:w-8 sm:h-2 rounded-full bg-pink-400" />
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Process Table */}
                                <Box className="overflow-x-auto -mx-4 sm:mx-0">
                                    <Box className="min-w-full inline-block">
                                        <table className="w-full">
                                            <thead>
                                                <tr>
                                                    <th className="text-left py-3 sm:py-4 px-3 sm:px-4 font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-900 z-10">Cliente</th>
                                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((weekNum) => (
                                                        <th key={weekNum} className="text-center py-3 sm:py-4 px-1 sm:px-2 font-bold text-[10px] sm:text-xs text-gray-700 dark:text-gray-300 min-w-[60px] sm:min-w-[80px]">
                                                            week {weekNum}
                                                        </th>
                                                    ))}
                                                    <th className="text-center py-3 sm:py-4 px-3 sm:px-4 font-bold text-xs sm:text-sm text-gray-700 dark:text-gray-300 min-w-[100px] sm:min-w-[120px]">Attended appointments</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredProcesses
                                                    .map((client) => {
                                                        const completedWeeks = client.weeks.filter(w => w.status === 'Cumplio').length;
                                                        const percentage = Math.round((completedWeeks / 12) * 100);

                                                        return (
                                                            <tr key={client.id} className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                                <td className="py-3 sm:py-4 px-3 sm:px-4 sticky left-0 bg-white dark:bg-gray-900 z-10">
                                                                    <Box className="flex items-center gap-2 sm:gap-3">
                                                                        <Avatar
                                                                            sx={{
                                                                                width: { xs: 32, sm: 36, lg: 40 },
                                                                                height: { xs: 32, sm: 36, lg: 40 },
                                                                                bgcolor: '#F3F4F6',
                                                                                color: '#000',
                                                                                fontWeight: 'bold',
                                                                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                                            }}
                                                                        >
                                                                            {client.clientName.charAt(0).toUpperCase()}
                                                                        </Avatar>
                                                                        <Typography className="font-bold text-xs sm:text-sm text-black dark:text-white">
                                                                            {client.clientName}
                                                                        </Typography>
                                                                    </Box>
                                                                </td>
                                                                {Array.from({ length: 12 }, (_, i) => i + 1).map((weekNum) => {
                                                                    const week = client.weeks.find(w => w.weekNumber === weekNum);
                                                                    const status = week?.status || 'pendiente';

                                                                    return (
                                                                        <td key={weekNum} className="py-3 sm:py-4 px-1 sm:px-2 text-center">
                                                                            <Box className="flex flex-col items-center gap-1.5 sm:gap-2">
                                                                                <Typography className="text-[10px] sm:text-xs font-bold text-black dark:text-white">
                                                                                    week {weekNum}
                                                                                </Typography>
                                                                                <Box
                                                                                    onClick={() => handleWeekStatusToggle(client.id, weekNum)}
                                                                                    className="w-8 h-2 sm:w-10 sm:h-2.5 lg:w-12 lg:h-3 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                                                                                    sx={{ backgroundColor: getStatusColor(status) }}
                                                                                    title="Click to change status"
                                                                                />
                                                                            </Box>
                                                                        </td>
                                                                    );
                                                                })}
                                                                <td className="py-3 sm:py-4 px-3 sm:px-4">
                                                                    <Box className="flex flex-col items-center gap-1.5 sm:gap-2">
                                                                        <Typography className="font-extrabold text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                                                                            {percentage}%
                                                                        </Typography>
                                                                        <Box
                                                                            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full relative"
                                                                            sx={{
                                                                                background: `conic-gradient(#EAB308 0% ${percentage}%, #FFFFFF ${percentage}% 100%)`,
                                                                                border: '2px solid #9CA3AF',
                                                                            }}
                                                                        />
                                                                        <Typography className="font-bold text-[10px] sm:text-xs text-center text-black dark:text-white">
                                                                            Attended appointments
                                                                        </Typography>
                                                                    </Box>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                    </TabPanel>
                </Container>
            </Box>
        </>
    );
}
