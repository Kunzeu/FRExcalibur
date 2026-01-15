
import { Pool } from 'pg';

// Use a global variable to store the pool in development to avoid multiple connections during hot reloading
let pool: Pool;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.warn('DATABASE_URL environment variable is not set. Database features will not work.');
}

if (process.env.NODE_ENV === 'production') {
    pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
} else {
    // In development, use a global variable so that we don't spam the database with connections
    if (!(global as any).postgresPool) {
        (global as any).postgresPool = new Pool({
            connectionString,
            // ssl: false, // Usually local dev doesn't use SSL, but depends on setup
        });
    }
    pool = (global as any).postgresPool;
}

export default pool;
