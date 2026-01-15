
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { ClientProcess } from '@/lib/types/l2l-process';

// Mock data for seeding
const DEFAULT_PROCESSES: ClientProcess[] = [
    {
        id: '1',
        clientName: 'Jhon Morales',
        weeks: [
            { weekNumber: 1, status: 'Cumplio' },
            { weekNumber: 2, status: 'Cumplio' },
            { weekNumber: 3, status: 'Cumplio' },
            { weekNumber: 4, status: 'no_cumplio' },
            { weekNumber: 5, status: 'Cumplio' },
            { weekNumber: 6, status: 'Cumplio' },
            { weekNumber: 7, status: 'Cumplio' },
            { weekNumber: 8, status: 'pendiente' },
            { weekNumber: 9, status: 'Cumplio' },
            { weekNumber: 10, status: 'pendiente' },
            { weekNumber: 11, status: 'pendiente' },
            { weekNumber: 12, status: 'pendiente' },
        ],
        attendancePercentage: 65,
    },
    {
        id: '2',
        clientName: 'Rafael Castillo',
        weeks: [
            { weekNumber: 1, status: 'Cumplio' },
            { weekNumber: 2, status: 'Cumplio' },
            { weekNumber: 3, status: 'Cumplio' },
            { weekNumber: 4, status: 'no_cumplio' },
            { weekNumber: 5, status: 'pendiente' },
            { weekNumber: 6, status: 'pendiente' },
            { weekNumber: 7, status: 'pendiente' },
            { weekNumber: 8, status: 'pendiente' },
            { weekNumber: 9, status: 'pendiente' },
            { weekNumber: 10, status: 'pendiente' },
            { weekNumber: 11, status: 'pendiente' },
            { weekNumber: 12, status: 'pendiente' },
        ],
        attendancePercentage: 35,
    },
];

export async function GET(request: NextRequest) {
    try {
        const client = await pool.connect();
        try {
            // Check if table exists, if not, might fail - ensure user runs schema
            // Ideally we check or create it. But for now query.

            // First, try to fetch
            const result = await client.query('SELECT * FROM l2l_client_processes ORDER BY CAST(id AS INTEGER) ASC');

            if (result.rowCount === 0) {
                // Seed if empty
                console.log('Seeding l2l_client_processes with default data...');
                for (const p of DEFAULT_PROCESSES) {
                    await client.query(
                        'INSERT INTO l2l_client_processes (id, client_name, weeks, attendance_percentage) VALUES ($1, $2, $3, $4)',
                        [p.id, p.clientName, JSON.stringify(p.weeks), p.attendancePercentage]
                    );
                }
                return NextResponse.json({ success: true, data: DEFAULT_PROCESSES });
            }

            const processes: ClientProcess[] = result.rows.map(row => ({
                id: row.id,
                clientName: row.client_name,
                weeks: row.weeks, // JSONB is automatically parsed by pg
                attendancePercentage: row.attendance_percentage
            }));

            return NextResponse.json({ success: true, data: processes });

        } finally {
            client.release();
        }
    } catch (error: any) {
        console.error('Error in GET /api/l2l/processes:', error);
        // Fallback to mock if DB fails (e.g. table doesn't exist yet)
        if (error.code === '42P01') { // undefined_table
            return NextResponse.json({
                success: true,
                data: DEFAULT_PROCESSES,
                warning: 'Database table not found. Using in-memory fallback. Please run schema.sql.'
            });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, clientName, weeks, attendancePercentage } = body as ClientProcess;

        if (!id || !clientName) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            // Upsert
            const query = `
                INSERT INTO l2l_client_processes (id, client_name, weeks, attendance_percentage, updated_at)
                VALUES ($1, $2, $3, $4, NOW())
                ON CONFLICT (id) DO UPDATE SET
                    client_name = EXCLUDED.client_name,
                    weeks = EXCLUDED.weeks,
                    attendance_percentage = EXCLUDED.attendance_percentage,
                    updated_at = NOW()
                RETURNING *
            `;

            const result = await client.query(query, [id, clientName, JSON.stringify(weeks), attendancePercentage]);

            const row = result.rows[0];
            const savedProcess: ClientProcess = {
                id: row.id,
                clientName: row.client_name,
                weeks: row.weeks,
                attendancePercentage: row.attendance_percentage
            };

            return NextResponse.json({ success: true, data: savedProcess });

        } finally {
            client.release();
        }

    } catch (error: any) {
        console.error('Error in POST /api/l2l/processes:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
