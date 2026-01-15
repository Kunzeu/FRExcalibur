'use client';

import { useState } from 'react';
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
    Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@/lib/contexts/theme-context';

// Mock data - En producción esto vendría de una API
const mockIntakeData = [
    {
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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
        id: 5,
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
        id: 6,
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

export default function IntakeListTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const { mode } = useTheme();
    const isDark = mode === 'dark';

    const filteredData = mockIntakeData.filter(row =>
        row.mainLeadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.mainLeadLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.clientFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.clientLastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={17} align="center" sx={{ padding: '40px', color: isDark ? '#9CA3AF' : '#6B7280' }}>
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
                                                // Handle "See all" click
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
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

