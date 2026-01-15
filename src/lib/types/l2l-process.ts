export interface ClientProcess {
    id: string;
    clientName: string;
    weeks: {
        weekNumber: number;
        status: 'Cumplio' | 'pendiente' | 'no_cumplio';
    }[];
    attendancePercentage: number;
}

