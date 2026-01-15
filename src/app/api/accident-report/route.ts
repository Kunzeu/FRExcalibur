import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth.middleware';

export async function POST(request: NextRequest) {
    return requireAuth(request, async (req, user) => {
        try {
            const formData = await request.json();

            // Validar campos requeridos
            const requiredFields = [
                'firstName',
                'lastName',
                'accidentType',
                'dateOfBirth',
                'hasEmergencyContact',
                'address',
            ];

            for (const field of requiredFields) {
                if (!formData[field]) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: {
                                message: `Missing required field: ${field}`,
                                code: 'MISSING_FIELD',
                            },
                        },
                        { status: 400 }
                    );
                }
            }

            // Aquí puedes agregar la lógica para guardar los datos en una base de datos
            // Por ahora, solo registramos los datos en la consola
            console.log('Accident form submitted by user:', user.email, formData);

            // Simular procesamiento
            // En producción, aquí guardarías los datos en tu base de datos
            // await saveAccidentReport(formData, user.id);

            return NextResponse.json({
                success: true,
                message: 'Accident report submitted successfully',
                data: {
                    id: `ACC-${Date.now()}`, // ID temporal
                    submittedAt: new Date().toISOString(),
                    submittedBy: user.email,
                },
            });
        } catch (error) {
            console.error('Error processing accident form:', error);
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        message: 'Internal server error',
                        code: 'INTERNAL_ERROR',
                    },
                },
                { status: 500 }
            );
        }
    });
}
