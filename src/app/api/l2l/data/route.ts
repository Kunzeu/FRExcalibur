import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { L2LUserData, L2LWeek } from '@/lib/types/l2l';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const mockWeeks: L2LWeek[] = [
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

        const mockData: L2LUserData = {
            stats: {
                totalCases: 15,
                approvedCases: 2,
                referralFeesReceived: 12000,
                pendingSignatureCases: 9,
                referralFeesPending: 1500,
            },
            weeks: mockWeeks
        };

        return NextResponse.json({
            success: true,
            data: mockData
        });

    } catch (error: any) {
        console.error('Error fetching L2L data:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
