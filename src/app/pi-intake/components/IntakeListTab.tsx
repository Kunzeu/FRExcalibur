'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Pagination,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@/lib/contexts/theme-context';
import { intakeService } from '@/lib/services/intake.service';
import { userService } from '@/lib/services/user.service';
import type { IntakeResponse, UserResponse } from '@/lib/types/intake-api';

// Tipo para los datos de la tabla
interface IntakeTableRow {
    id: string;
    mainLeadName: string;
    mainLeadLastName: string;
    mainLeadPhone: string;
    code: string;
    dateTimeIntake: string;
    screener: string;
    callSource: string;
    clientFirstName: string;
    clientLastName: string;
    clientPhone: string;
    typeOfAccident: string;
    accidentState: string;
    accidentDate: string;
    handlingLawyer: string;
    legalStatus: string;
    dateLawyerAssigned: string;
    historyLegalStatusNotes: string;
}

// Mock data - En producción esto vendría de una API
const mockIntakeData: IntakeTableRow[] = [
    {
        id: '1',
        mainLeadName: 'Eduardo',
        mainLeadLastName: 'Flores',
        mainLeadPhone: '(631) 215-7260',
        code: '25-80-009145 -01-0',
        dateTimeIntake: '01/15/2026, 09:55:33 AM',
        screener: 'Valeria Herazo Pico',
        callSource: 'Cantaso',
        clientFirstName: 'Eduardo',
        clientLastName: 'Flores',
        clientPhone: '(631) 215-7260',
        typeOfAccident: 'Other',
        accidentState: '',
        accidentDate: '',
        handlingLawyer: '',
        legalStatus: 'Pending Full Intake',
        dateLawyerAssigned: '01/15/2026, 12:05:10 PM',
        historyLegalStatusNotes: 'See all'
    },
    {
        id: '2',
        mainLeadName: 'Eduardo',
        mainLeadLastName: 'Flores',
        mainLeadPhone: '(631) 215-7260',
        code: '25-80-009145 -01-0',
        dateTimeIntake: '01/15/2026, 09:55:33 AM',
        screener: 'Valeria Herazo Pico',
        callSource: 'Cantaso',
        clientFirstName: 'Eduardo',
        clientLastName: 'Flores',
        clientPhone: '(631) 215-7260',
        typeOfAccident: 'Other',
        accidentState: '',
        accidentDate: '',
        handlingLawyer: '',
        legalStatus: 'Pending Full Intake',
        dateLawyerAssigned: '01/15/2026, 12:05:10 PM',
        historyLegalStatusNotes: 'See all'
    },
    {
        id: '3',
        mainLeadName: 'Eduardo',
        mainLeadLastName: 'Flores',
        mainLeadPhone: '(631) 215-7260',
        code: '25-80-009145 -01-0',
        dateTimeIntake: '01/15/2026, 09:55:33 AM',
        screener: 'Valeria Herazo Pico',
        callSource: 'Cantaso',
        clientFirstName: 'Eduardo',
        clientLastName: 'Flores',
        clientPhone: '(631) 215-7260',
        typeOfAccident: 'Other',
        accidentState: '',
        accidentDate: '',
        handlingLawyer: '',
        legalStatus: 'Pending Full Intake',
        dateLawyerAssigned: '01/15/2026, 12:05:10 PM',
        historyLegalStatusNotes: 'See all'
    },
    {
        id: '4',
        mainLeadName: 'Eduardo',
        mainLeadLastName: 'Flores',
        mainLeadPhone: '(631) 215-7260',
        code: '25-80-009145 -01-0',
        dateTimeIntake: '01/15/2026, 09:55:33 AM',
        screener: 'Valeria Herazo Pico',
        callSource: 'Cantaso',
        clientFirstName: 'Eduardo',
        clientLastName: 'Flores',
        clientPhone: '(631) 215-7260',
        typeOfAccident: 'Other',
        accidentState: '',
        accidentDate: '',
        handlingLawyer: '',
        legalStatus: 'Pending Full Intake',
        dateLawyerAssigned: '01/15/2026, 12:05:10 PM',
        historyLegalStatusNotes: 'See all'
    },
    {
        id: '5',
        mainLeadName: 'Eduardo',
        mainLeadLastName: 'Flores',
        mainLeadPhone: '(631) 215-7260',
        code: '25-80-009145 -01-0',
        dateTimeIntake: '01/15/2026, 09:55:33 AM',
        screener: 'Valeria Herazo Pico',
        callSource: 'Cantaso',
        clientFirstName: 'Eduardo',
        clientLastName: 'Flores',
        clientPhone: '(631) 215-7260',
        typeOfAccident: 'Other',
        accidentState: '',
        accidentDate: '',
        handlingLawyer: '',
        legalStatus: 'Pending Full Intake',
        dateLawyerAssigned: '01/15/2026, 12:05:10 PM',
        historyLegalStatusNotes: 'See all'
    },
    {
        id: '6',
        mainLeadName: 'Eduardo',
        mainLeadLastName: 'Flores',
        mainLeadPhone: '(631) 215-7260',
        code: '25-80-009145 -01-0',
        dateTimeIntake: '01/15/2026, 09:55:33 AM',
        screener: 'Valeria Herazo Pico',
        callSource: 'Cantaso',
        clientFirstName: 'Eduardo',
        clientLastName: 'Flores',
        clientPhone: '(631) 215-7260',
        typeOfAccident: 'Other',
        accidentState: '',
        accidentDate: '',
        handlingLawyer: '',
        legalStatus: 'Pending Full Intake',
        dateLawyerAssigned: '01/15/2026, 12:05:10 PM',
        historyLegalStatusNotes: 'See all'
    }
];

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

interface IntakeListTabProps {
    onEdit?: (id: string) => void;
}

export default function IntakeListTab({ onEdit }: IntakeListTabProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [intakeData, setIntakeData] = useState<IntakeTableRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [screenerCache, setScreenerCache] = useState<Record<string, UserResponse>>({});
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedHistoryIntakeId, setSelectedHistoryIntakeId] = useState<string | null>(null);
    const { mode } = useTheme();
    const isDark = mode === 'dark';
    const pageSize = 20;

    // Cargar datos de la API
    useEffect(() => {
        const loadIntakes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await intakeService.getAllIntakes({
                    page,
                    size: pageSize,
                    sort: ['createdAt,desc']
                });

                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);

                // Optimización: Obtener todos los createdBy únicos y cargar usuarios en paralelo
                const uniqueUserIds = new Set<string>();
                response.content.forEach((intake: IntakeResponse) => {
                    if (intake.createdBy && !screenerCache[intake.createdBy]) {
                        uniqueUserIds.add(intake.createdBy);
                    }
                });

                // Cargar todos los usuarios únicos en paralelo
                const userPromises = Array.from(uniqueUserIds).map(async (userId) => {
                    try {
                        const user = await userService.getUserById(userId);
                        return { userId, user };
                    } catch (err) {
                        console.warn(`Error loading user ${userId}:`, err);
                        return { userId, user: null };
                    }
                });

                const userResults = await Promise.all(userPromises);
                
                // Actualizar caché con todos los usuarios cargados
                const newCache = { ...screenerCache };
                userResults.forEach(({ userId, user }) => {
                    if (user) {
                        newCache[userId] = user;
                    }
                });
                setScreenerCache(newCache);

                // Mapear los datos de la API a los campos de la tabla (sin llamadas async adicionales)
                const mappedData = response.content.map((intake: IntakeResponse) => {
                        // Obtener información del screener desde caché
                        let screenerName = '-';
                        if (intake.createdBy) {
                            const cachedUser = newCache[intake.createdBy];
                            if (cachedUser) {
                                screenerName = cachedUser.fullName || `${cachedUser.firstName || ''} ${cachedUser.lastName || ''}`.trim() || '-';
                            }
                        }

                        // Extraer información del cliente desde typeSpecificData o clientUserId
                        let clientFirstName = '-';
                        let clientLastName = '-';
                        let clientPhone = '-';

                        if (intake.typeSpecificData) {
                            const typeData = intake.typeSpecificData as any;
                            // Intentar obtener datos del cliente desde typeSpecificData
                            if (typeData.persons && Array.isArray(typeData.persons) && typeData.persons.length > 0) {
                                const person1 = typeData.persons[0];
                                clientFirstName = person1.firstName || '-';
                                clientLastName = person1.lastName || '-';
                                clientPhone = person1.phoneNumber || '-';
                            } else if (typeData.firstName) {
                                clientFirstName = typeData.firstName;
                                clientLastName = typeData.lastName || '-';
                                clientPhone = typeData.phoneNumber || '-';
                            }
                        }

                        // Obtener información del lead (main lead) - similar al cliente
                        let mainLeadName = clientFirstName;
                        let mainLeadLastName = clientLastName;
                        let mainLeadPhone = clientPhone;

                        // Mapear el tipo de accidente
                        const typeOfAccident = intake.intakeType || '-';

                        // Mapear el estado legal
                        const legalStatus = intake.status || 'PENDING';
                        const legalStatusMap: Record<string, string> = {
                            'PENDING': 'Pending Full Intake',
                            'QUALIFIED': 'Qualified',
                            'REJECTED': 'Rejected',
                            'CONVERTED': 'Converted',
                            'FOLLOW_UP': 'Follow Up'
                        };

                        return {
                            id: intake.id,
                            mainLeadName: mainLeadName,
                            mainLeadLastName: mainLeadLastName,
                            mainLeadPhone: mainLeadPhone,
                            code: intake.intakeNumber || '-',
                            dateTimeIntake: intakeService.formatDateTime(intake.createdAt),
                            screener: screenerName,
                            callSource: intake.subsourceName || intake.subsourceText || '-',
                            clientFirstName: clientFirstName,
                            clientLastName: clientLastName,
                            clientPhone: clientPhone,
                            typeOfAccident: typeOfAccident,
                            accidentState: intake.accidentLocation ? intake.accidentLocation.split(',')[1]?.trim() || '-' : '-',
                            accidentDate: intakeService.formatDate(intake.accidentDate),
                            handlingLawyer: '-', // No disponible en la API actual
                            legalStatus: legalStatusMap[legalStatus] || legalStatus,
                            dateLawyerAssigned: '-', // No disponible en la API actual
                            historyLegalStatusNotes: 'See all'
                        } as IntakeTableRow;
                    });

                setIntakeData(mappedData);
            } catch (err: any) {
                console.warn('API no disponible, usando datos mock:', err);

                // Si la API no está disponible, usar datos mock silenciosamente
                // Esto es esperado si el entorno aún no está configurado
                setIntakeData(mockIntakeData);
                setTotalPages(1);
                setTotalElements(mockIntakeData.length);
                setError(null); // No mostrar error, es esperado

                // Solo mostrar error en consola para debugging
                if (err.request && !err.response) {
                    console.info(
                        'ℹ️ La API no está disponible. ' +
                        'Esto es normal si el entorno aún no está configurado. ' +
                        'Se están usando datos mock para desarrollo.'
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadIntakes();
    }, [page]);

    // Filtrar datos localmente
    const filteredData = intakeData.filter(row =>
        row.mainLeadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.mainLeadLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.clientFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.clientLastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value - 1); // MUI Pagination es 1-indexed, pero la API es 0-indexed
    };

    return (
        <Box className="w-full pb-8">
            <Typography
                variant="h2"
                className="font-extrabold text-black dark:text-white mb-6 text-2xl md:text-3xl"
                sx={{ fontWeight: 700 }}
            >
                Intake List
            </Typography>

            {/* Search and Filter Bar */}
            <Box className="flex gap-4 mb-6 items-center">
                <TextField
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon
                                    sx={{
                                        color: isDark ? '#9CA3AF' : '#6B7280',
                                        fontSize: '20px'
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        flex: 1,
                        maxWidth: '500px',
                        '& .MuiOutlinedInput-root': {
                            height: '45px',
                            backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
                            borderRadius: '8px',
                            border: isDark ? '1px solid #374151' : '1px solid #000000',
                            '& fieldset': {
                                border: 'none',
                            },
                            '& input': {
                                color: isDark ? '#FFFFFF !important' : '#000000 !important',
                                fontSize: '14px',
                                padding: '12px 14px',
                                '&::placeholder': {
                                    color: isDark ? '#9CA3AF !important' : '#6B7280 !important',
                                    opacity: 1,
                                },
                            },
                            '&:hover': {
                                border: isDark ? '1px solid #4B5563 !important' : '1px solid #000000 !important',
                            },
                            '&.Mui-focused': {
                                border: '2px solid #EAB308 !important',
                                '& fieldset': {
                                    border: 'none',
                                },
                            },
                        },
                    }}
                />
                <Button
                    variant="outlined"
                    sx={{
                        minWidth: '40px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: '#EBB207 !important',
                        border: '1px solid #000000 !important',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                            backgroundColor: '#EBB207 !important',
                            border: '1px solid #000000 !important',
                        }
                    }}
                >
                    <Box
                        component="svg"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        sx={{
                            width: '30px',
                            height: '40px',
                            fill: 'none',
                            stroke: '#FFFFFF !important',
                            strokeWidth: 2,
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            filter: 'drop-shadow(0 0 1px rgba(255, 255, 255, 0.5))'
                        }}
                    >
                        <path d="M22 3H2l8 9.46V19l4 2v-7.54L22 3z" />
                    </Box>
                </Button>
            </Box>

            {/* Table */}
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: '12px',
                    overflowX: 'auto',
                    backgroundColor: isDark ? '#111827' : '#FFFFFF',
                    boxShadow: isDark
                        ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                        : '0 4px 6px rgba(0, 0, 0, 0.1)',
                    maxHeight: 'calc(100vh - 300px)',
                    width: '100%',
                }}
            >
                <Table
                    sx={{
                        width: '100%',
                        tableLayout: 'fixed',
                        '& .MuiTableCell-root': {
                            whiteSpace: 'nowrap',
                            padding: '12px 8px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }
                    }}
                    stickyHeader
                >
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                                '& th': {
                                    borderBottom: '2px solid #E5E7EB',
                                    padding: '14px 8px',
                                }
                            }}
                        >
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '6%', padding: '14px 8px' }}>Main lead name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '6%', padding: '14px 8px' }}>Main lead last name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '7%', padding: '14px 8px' }}>Main lead phone number</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '7%', padding: '14px 8px' }}>Code</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '7%', padding: '14px 8px' }}>Date time of the intake</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '7%', padding: '14px 8px' }}>Screener (created by)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '6%', padding: '14px 8px' }}>Call source</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '6%', padding: '14px 8px' }}>Client first name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '6%', padding: '14px 8px' }}>Client last name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '7%', padding: '14px 8px' }}>Client phone</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '6%', padding: '14px 8px' }}>Type of accident</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '6%', padding: '14px 8px' }}>Accident state</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '6%', padding: '14px 8px' }}>Accident date</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '6%', padding: '14px 8px' }}>Handling lawyer</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '7%', padding: '14px 8px' }}>Legal status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '7%', padding: '14px 8px' }}>Date lawyer assigned</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '7%', padding: '14px 8px' }}>History legal status notes</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', width: '5%', padding: '14px 8px' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={18} align="center" sx={{ padding: '40px' }}>
                                    <CircularProgress size={40} sx={{ color: '#EAB308' }} />
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={18} align="center" sx={{ padding: '40px', color: isDark ? '#EF4444' : '#DC2626' }}>
                                    <Typography variant="body1">{error}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={18} align="center" sx={{ padding: '40px', color: isDark ? '#9CA3AF' : '#6B7280' }}>
                                    <Typography variant="body1">No se encontraron resultados</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0
                                            ? (isDark ? '#1F2937' : '#FFFFFF')
                                            : (isDark ? '#374151' : '#FEF3C7'),
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': {
                                            backgroundColor: isDark ? '#4B5563' : 'rgba(234, 179, 8, 0.15)',
                                            transition: 'background-color 0.2s ease',
                                        },
                                        '& td': {
                                            borderBottom: index % 2 === 0
                                                ? (isDark ? '1px solid #374151' : '1px solid #F3F4F6')
                                                : (isDark ? '1px solid #4B5563' : '1px solid #FDE68A'),
                                        }
                                    }}
                                >
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.mainLeadName}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.mainLeadLastName}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.mainLeadPhone}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.code}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.dateTimeIntake}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.screener}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.callSource}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.clientFirstName}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.clientLastName}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.clientPhone}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.typeOfAccident}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 400, padding: '12px 8px' }}>{row.accidentState || '-'}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 400, padding: '12px 8px' }}>{row.accidentDate || '-'}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 400, padding: '12px 8px' }}>{row.handlingLawyer || '-'}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.legalStatus}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', color: isDark ? '#FFFFFF' : '#000000', fontWeight: 400, padding: '12px 8px' }}>{row.dateLawyerAssigned}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.8rem', padding: '12px 8px' }}>
                                        <Typography
                                            component="a"
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedHistoryIntakeId(row.id);
                                                setHistoryModalOpen(true);
                                            }}
                                            sx={{
                                                color: '#EAB308',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: 500,
                                                '&:hover': {
                                                    color: '#FCD34D',
                                                    textDecoration: 'underline',
                                                }
                                            }}
                                        >
                                            {row.historyLegalStatusNotes}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ padding: '12px 8px' }}>
                                        <Box
                                            component="img"
                                            src="/icons/iconos-svg/editar.svg"
                                            alt="Edit"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onEdit) {
                                                    onEdit(row.id);
                                                }
                                            }}
                                            sx={{
                                                width: '20px',
                                                height: '20px',
                                                cursor: 'pointer',
                                                filter: isDark ? 'invert(1)' : 'none',
                                                '&:hover': {
                                                    opacity: 0.8
                                                }
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Paginación */}
            {!loading && !error && totalPages > 1 && (
                <Box className="flex justify-center mt-6">
                    <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={handlePageChange}
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: isDark ? '#FFFFFF' : '#000000',
                                '&.Mui-selected': {
                                    backgroundColor: '#EAB308',
                                    color: '#000000',
                                    '&:hover': {
                                        backgroundColor: '#FCD34D',
                                    }
                                },
                                '&:hover': {
                                    backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                }
                            }
                        }}
                    />
                </Box>
            )}

            {/* Información de paginación */}
            {!loading && (
                <Box className="flex justify-center mt-4">
                    <Typography variant="body2" sx={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                        Mostrando {filteredData.length} de {totalElements} intakes
                        {process.env.NODE_ENV === 'development' && intakeData.length > 0 && intakeData[0]?.id === '1' && (
                            <span style={{ marginLeft: '8px', fontStyle: 'italic' }}>
                                (Datos de demostración)
                            </span>
                        )}
                    </Typography>
                </Box>
            )}

            {/* History Modal */}
            <Dialog
                open={historyModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                maxWidth={false}
                PaperProps={{
                    sx: {
                        borderRadius: '8px',
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        color: isDark ? '#FFFFFF' : '#000000',
                        boxShadow: isDark
                            ? '0 10px 25px rgba(0, 0, 0, 0.5)'
                            : '0 10px 25px rgba(0, 0, 0, 0.15)',
                        width: '90%',
                        maxWidth: '1000px',
                        maxHeight: '90vh',
                        height: 'auto',
                        margin: '32px auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '24px 48px 20px 48px',
                    position: 'relative',
                    borderBottom: isDark ? '1px solid #374151' : '1px solid #E5E7EB',
                    pb: '20px'
                }}>
                    <Typography variant="h5" component="div" sx={{
                        fontWeight: 700,
                        textAlign: 'center',
                        color: isDark ? '#FFFFFF' : '#000000',
                        fontSize: '1.125rem'
                    }}>
                        History Legal Status Note
                    </Typography>
                    <IconButton
                        onClick={() => setHistoryModalOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 12,
                            top: 12,
                            color: isDark ? '#9CA3AF' : '#6B7280',
                            padding: '8px',
                            '&:hover': {
                                backgroundColor: isDark ? '#374151' : '#F3F4F6'
                            }
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{
                    padding: '32px 48px',
                    flex: '1 1 auto',
                    overflowY: 'auto',
                    minHeight: '400px'
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
                                <Box sx={{ height: '12px' }} /> {/* Espacio adicional forzado */}
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
                </DialogContent>
            </Dialog>
        </Box>
    );
}

