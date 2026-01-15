'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
    Grid,
    TextField,
    InputAdornment,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    Select,
    FormControl,
    IconButton,
    Menu
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from '@/lib/contexts/theme-context';
import IntakeDetailView from './IntakeDetailView';

// Mock data for the table
const mockData = [
    { id: 1, codeCase: '25-70-000026-03-0', date: '14/02/2025, 11:30:45 AM', createdBy: 'Pruebtest', pimmSource: 'PIMM BAHAREH &GLORIA', name: 'Gene', lastName: 'Test', phone: '(1) 254-4542   ', accidentType: 'No Fault', status: 'Pending' },
    { id: 2, codeCase: '25-70-000026-03-0', date: '14/02/2025, 11:31:45 AM', createdBy: 'Pruebatest2', pimmSource: 'PIMM BAHAREH &GLORIA', name: 'Gene', lastName: 'Test', phone: '(2) 223-4567', accidentType: 'No Fault', status: 'Pending' },
    { id: 3, codeCase: '25-70-000026-03-0', date: '14/02/2025, 11:32:45 AM', createdBy: 'Pruebatest3', pimmSource: 'PIMM BAHAREH &GLORIA', name: 'Gene', lastName: 'Test', phone: '(3) 223-4567', accidentType: 'No Fault', status: 'Pending' },
    { id: 4, codeCase: '25-70-000026-03-0', date: '14/02/2025, 11:33:45 AM', createdBy: 'Pruebatest4', pimmSource: 'PIMM BAHAREH &GLORIA', name: 'Gene', lastName: 'Test', phone: '(4) 223-4567', accidentType: 'No Fault', status: 'Pending' },
    { id: 5, codeCase: '25-70-000028-03-0', date: '14/02/2025, 11:34:45 AM', createdBy: 'Pruebatest5', pimmSource: 'PIMM BAHAREH &GLORIA', name: 'Gene', lastName: 'Test', phone: '(5) 223-4567', accidentType: 'No Fault', status: 'Pending' },
    { id: 6, codeCase: '25-70-000026-03-0', date: '14/02/2025, 11:35:45 AM', createdBy: 'Pruebatest6', pimmSource: 'PIMM BAHAREH &GLORIA', name: 'Gene', lastName: 'Test', phone: '(6) 223-4567', accidentType: 'No Fault', status: 'Pending' },
    { id: 7, codeCase: '25-70-000026-03-0', date: '14/02/2025, 11:36:45 AM', createdBy: 'Pruebatest7', pimmSource: 'PIMM BAHAREH &GLORIA', name: 'Gene', lastName: 'Test', phone: '(7) 223-4567', accidentType: 'No Fault', status: 'Pending' },
    { id: 8, codeCase: '25-70-000026-03-0', date: '14/02/2025, 11:37:45 AM', createdBy: 'Pruebatest8', pimmSource: 'PIMM BAHAREH &GLORIA', name: 'Gene', lastName: 'Test', phone: '(8) 223-9567', accidentType: 'No Fault', status: 'Pending' },
    { id: 9, codeCase: '25-70-000026-03-0', date: '14/02/2025, 11:38:45 AM', createdBy: 'Pruebatest9', pimmSource: 'PIMM BAHAREH &GLORIA', name: 'Gene', lastName: 'Test', phone: '(9) 123-6467', accidentType: 'No Fault', status: 'Pending' },
    { id: 10, codeCase: '25-70-000026-03-0', date: '14/02/2025, 11:39:45 AM', createdBy: 'Pruebatest10', pimmSource: 'PIMM BAHAREH &GLORIA', name: 'Gene', lastName: 'Test', phone: '(10) 235-4867', accidentType: 'No Fault', status: 'Pending' },
];

export default function IntakesPimmListTab() {
    const [entryType, setEntryType] = useState('ver'); // 'ingresar' or 'ver'
    const [patientType, setPatientType] = useState('Type of patient');
    const [accidentTypeFilter, setAccidentTypeFilter] = useState('all');
    const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const { mode } = useTheme();

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFilterSelect = (value: string) => {
        setAccidentTypeFilter(value);
        handleFilterClose();
    };

    const filteredData = accidentTypeFilter === 'all'
        ? mockData
        : mockData.filter(row => row.accidentType === accidentTypeFilter);

    if (selectedPatient) {
        return (
            <IntakeDetailView
                patient={selectedPatient}
                onBack={() => setSelectedPatient(null)}
            />
        );
    }

    return (
        <Box className="w-full">
            {/* Top Controls Section */}
            <Box className="mb-8">
                {/* Tipo de ingreso */}
                <Typography className="font-bold text-sm mb-3 text-black dark:text-white">
                    Tipo de ingreso
                </Typography>
                <RadioGroup
                    row
                    value={entryType}
                    onChange={(e) => setEntryType(e.target.value)}
                    className="mb-8"
                >
                    <FormControlLabel
                        value="ingresar"
                        control={
                            <Radio
                                sx={{
                                    color: '#D1D5DB',
                                    '&.Mui-checked': { color: '#EAB308' }
                                }}
                            />
                        }
                        label={<Typography className="text-sm text-black dark:text-white">Ingresar paciente</Typography>}
                    />
                    <FormControlLabel
                        value="ver"
                        control={
                            <Radio
                                sx={{
                                    color: '#D1D5DB',
                                    '&.Mui-checked': { color: '#EAB308' }
                                }}
                            />
                        }
                        label={<Typography className="text-sm text-black dark:text-white">Ver paciente</Typography>}
                    />
                </RadioGroup>

                {entryType === 'ver' && (
                    <>
                        {/* Paciente Section */}
                        <Typography className="font-bold text-sm mb-3 text-black dark:text-white">
                            Paciente
                        </Typography>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={2}>
                                <FormControl size="small" sx={{ width: '200px' }}>
                                    <Select
                                        value={patientType}
                                        onChange={(e) => setPatientType(e.target.value)}
                                        displayEmpty
                                        renderValue={(selected) => {
                                            if (selected === 'Type of patient') {
                                                return <span className={`font-bold ${mode === 'dark' ? 'text-gray-900' : 'text-gray-900'}`}>Type of patient</span>;
                                            }
                                            return <span className={mode === 'dark' ? 'text-gray-900' : 'text-gray-900'}>{selected}</span>;
                                        }}
                                        sx={{
                                            borderRadius: '25px',
                                            backgroundColor: '#FDE047',
                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            '& .MuiSelect-select': {
                                                paddingTop: '10px',
                                                paddingBottom: '10px',
                                                fontWeight: 'bold',
                                            },
                                            '& .MuiSvgIcon-root': { color: '#000' },
                                            '.dark &': {
                                                backgroundColor: '#FDE047',
                                            }
                                        }}
                                    >
                                        <MenuItem value="Type of patient" disabled>Type of patient</MenuItem>
                                        <MenuItem value="Lawyer">Lawyer</MenuItem>
                                        <MenuItem value="PIMM">PIMM</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Search and Filter */}
                        <Box className="flex gap-4 mt-6">
                            <TextField
                                placeholder="Search"
                                size="small"
                                sx={{
                                    width: '300px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '25px',
                                        backgroundColor: mode === 'dark' ? '#1F2937' : '#FFFFFF',
                                        height: '45px',
                                        color: mode === 'dark' ? '#FFFFFF !important' : '#000000 !important',
                                        '& fieldset': {
                                            borderColor: `${mode === 'dark' ? '#374151' : '#000000'} !important`,
                                            borderWidth: `${mode === 'dark' ? '1px' : '2px'} !important`,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: `${mode === 'dark' ? '#4B5563' : '#000000'} !important`,
                                            borderWidth: `${mode === 'dark' ? '1px' : '2px'} !important`,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: `${mode === 'dark' ? '#EAB308' : '#000000'} !important`,
                                            borderWidth: `${mode === 'dark' ? '1px' : '2px'} !important`,
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        color: `${mode === 'dark' ? '#FFFFFF' : '#000000'} !important`,
                                        '&::placeholder': {
                                            color: mode === 'dark' ? '#9CA3AF' : '#6B7280',
                                            opacity: 1,
                                        },
                                    },
                                    '& input': {
                                        color: `${mode === 'dark' ? '#FFFFFF' : '#000000'} !important`,
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#EAB308' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="outlined"
                                sx={{
                                    minWidth: '50px',
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '8px',
                                    backgroundColor: '#EBB207 !important',
                                    border: '1px solid #000000',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.1)',
                                    '&:hover': {
                                        backgroundColor: '#EBB207',
                                        border: '1px solid #000000',
                                    }
                                }}
                            >
                                <Box
                                    component="svg"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    sx={{
                                        width: '30px',
                                        height: '30px',
                                        fill: 'none',
                                        stroke: '#FFFFFF',
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
                    </>
                )}
            </Box>

            {/* Table Section */}
            {entryType === 'ver' && (
                <TableContainer
                    component={Paper}
                    elevation={0}
                    className="bg-white dark:bg-gray-900"
                    sx={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow sx={{ borderBottom: `2px solid ${mode === 'dark' ? '#374151' : '#000000'} !important` }}>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', color: mode === 'dark' ? '#FFFFFF' : '#000000', borderBottom: `2px solid ${mode === 'dark' ? '#374151' : '#000000'} !important` }}>Code Case</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', color: mode === 'dark' ? '#FFFFFF' : '#000000', borderBottom: `2px solid ${mode === 'dark' ? '#374151' : '#000000'} !important` }}>Creation Date</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', color: mode === 'dark' ? '#FFFFFF' : '#000000', borderBottom: `2px solid ${mode === 'dark' ? '#374151' : '#000000'} !important` }}>Created By</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', color: mode === 'dark' ? '#FFFFFF' : '#000000', borderBottom: `2px solid ${mode === 'dark' ? '#374151' : '#000000'} !important` }}>Pimm Source</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', color: mode === 'dark' ? '#FFFFFF' : '#000000', borderBottom: `2px solid ${mode === 'dark' ? '#374151' : '#000000'} !important` }}>Client Name</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', color: mode === 'dark' ? '#FFFFFF' : '#000000', borderBottom: `2px solid ${mode === 'dark' ? '#374151' : '#000000'} !important` }}>Last Name</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', color: mode === 'dark' ? '#FFFFFF' : '#000000', borderBottom: `2px solid ${mode === 'dark' ? '#374151' : '#000000'} !important` }}>Phone Number</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', color: mode === 'dark' ? '#FFFFFF' : '#000000', borderBottom: `2px solid ${mode === 'dark' ? '#374151' : '#000000'} !important` }}>
                                    <Box
                                        className="flex items-center justify-center gap-1 cursor-pointer hover:opacity-80"
                                        onClick={handleFilterClick}
                                        sx={{ color: mode === 'dark' ? '#FFFFFF' : '#000000' }}
                                    >
                                        Type Of Accident
                                        <ArrowDropDownIcon sx={{ fontSize: '16px', color: mode === 'dark' ? '#EAB308' : '#000' }} />
                                    </Box>
                                    <Menu
                                        anchorEl={filterAnchorEl}
                                        open={Boolean(filterAnchorEl)}
                                        onClose={handleFilterClose}
                                        PaperProps={{
                                            sx: {
                                                backgroundColor: mode === 'dark' ? '#1F2937' : '#FFFFFF',
                                                color: mode === 'dark' ? '#FFFFFF' : '#000000',
                                            }
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => handleFilterSelect('all')}
                                            sx={{
                                                color: mode === 'dark' ? '#FFFFFF' : '#000000',
                                                '&:hover': {
                                                    backgroundColor: mode === 'dark' ? '#374151' : '#F3F4F6',
                                                }
                                            }}
                                        >
                                            All
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => handleFilterSelect('No Fault')}
                                            sx={{
                                                color: mode === 'dark' ? '#FFFFFF' : '#000000',
                                                '&:hover': {
                                                    backgroundColor: mode === 'dark' ? '#374151' : '#F3F4F6',
                                                }
                                            }}
                                        >
                                            No Fault
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => handleFilterSelect('Workers Compensation')}
                                            sx={{
                                                color: mode === 'dark' ? '#FFFFFF' : '#000000',
                                                '&:hover': {
                                                    backgroundColor: mode === 'dark' ? '#374151' : '#F3F4F6',
                                                }
                                            }}
                                        >
                                            Workers Compensation
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => handleFilterSelect('Personal Injury')}
                                            sx={{
                                                color: mode === 'dark' ? '#FFFFFF' : '#000000',
                                                '&:hover': {
                                                    backgroundColor: mode === 'dark' ? '#374151' : '#F3F4F6',
                                                }
                                            }}
                                        >
                                            Personal Injury
                                        </MenuItem>
                                    </Menu>
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', color: mode === 'dark' ? '#FFFFFF' : '#000000', borderBottom: `2px solid ${mode === 'dark' ? '#374151' : '#000000'} !important` }}>Medical Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', color: mode === 'dark' ? '#FFFFFF' : '#000000', borderBottom: `2px solid ${mode === 'dark' ? '#374151' : '#000000'} !important` }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0
                                            ? (mode === 'dark' ? '#1F2937' : '#FFFFFF')
                                            : (mode === 'dark' ? '#374151' : '#FFFBEB'),
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': {
                                            backgroundColor: mode === 'dark' ? '#4B5563' : 'rgba(234, 179, 8, 0.1)',
                                        }
                                    }}
                                >
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', color: mode === 'dark' ? '#FFFFFF' : '#000000' }}>{row.codeCase}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', color: mode === 'dark' ? '#FFFFFF' : '#000000' }}>{row.date}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', color: mode === 'dark' ? '#FFFFFF' : '#000000' }}>{row.createdBy}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', color: mode === 'dark' ? '#FFFFFF' : '#000000' }}>{row.pimmSource}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', color: mode === 'dark' ? '#FFFFFF' : '#000000' }}>{row.name}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', color: mode === 'dark' ? '#FFFFFF' : '#000000' }}>{row.lastName}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', color: mode === 'dark' ? '#FFFFFF' : '#000000' }}>{row.phone}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', color: mode === 'dark' ? '#FFFFFF' : '#000000' }}>{row.accidentType}</TableCell>
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', color: mode === 'dark' ? '#FFFFFF' : '#000000' }}>{row.status}</TableCell>
                                    <TableCell align="center" className="text-xs">
                                        <Button
                                            variant="text"
                                            onClick={() => setSelectedPatient(row)}
                                            sx={{
                                                textTransform: 'none',
                                                color: mode === 'dark' ? '#EAB308' : '#000',
                                                fontWeight: 'bold',
                                                textDecoration: 'underline',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    backgroundColor: 'transparent',
                                                    color: mode === 'dark' ? '#FDE047' : '#000',
                                                }
                                            }}
                                        >
                                            Detail
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
