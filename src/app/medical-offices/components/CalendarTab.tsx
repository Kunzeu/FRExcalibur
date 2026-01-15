'use client';

import { Box, Typography, Paper } from '@mui/material';

export default function CalendarTab() {
    return (
        <Paper className="p-8 shadow-sm rounded-[20px] bg-white dark:bg-gray-900 text-black dark:text-white border border-gray-100 dark:border-gray-800">
            <Typography variant="h5" className="font-bold mb-4">
                Calendar
            </Typography>
            <Typography className="text-gray-600 dark:text-gray-300">
                This section is currently under development.
            </Typography>
        </Paper>
    );
}
