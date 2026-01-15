import { NextRequest, NextResponse } from 'next/server';
import { L2LQuickIntakeFormData } from '@/lib/types/l2l-quick-intake';

/**
 * POST /api/l2l/quick-intake
 * Submits a Quick Intake form for L2L
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const formData: L2LQuickIntakeFormData = body;

        // Validate required fields
        if (!formData.clientPhoneNumber || !formData.clientFirstName || !formData.clientLastName) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Client information is required',
                    },
                },
                { status: 400 }
            );
        }

        if (!formData.wasAutomobileAccident || !formData.accidentLocation || !formData.accidentDate) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Accident information is required',
                    },
                },
                { status: 400 }
            );
        }

        // TODO: Save to database
        // For now, just return success
        console.log('L2L Quick Intake submitted:', formData);

        return NextResponse.json({
            success: true,
            data: {
                message: 'Quick Intake submitted successfully',
                formData,
            },
        });
    } catch (error: any) {
        console.error('Quick Intake submission error:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Internal server error',
                },
            },
            { status: 500 }
        );
    }
}

