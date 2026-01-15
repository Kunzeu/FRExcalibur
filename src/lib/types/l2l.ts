export interface L2LStat {
    id: number;
    value: string;
    label: string;
}

export interface L2LWeek {
    id: number;
    status: 'Cumplio' | 'no_cumplio' | 'pendiente';
}

export interface L2LUserData {
    stats: {
        totalCases: number;
        approvedCases: number;
        referralFeesReceived: number;
        pendingSignatureCases: number;
        referralFeesPending: number;
    };
    weeks: L2LWeek[];
}
