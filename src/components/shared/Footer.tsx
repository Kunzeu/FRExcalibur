'use client';

import { Box, Typography, Container, Link } from '@mui/material';

export default function Footer() {
    return (
        <Box component="footer" className="bg-white dark:bg-black py-8 border-t border-gray-100 dark:border-gray-800 mt-auto">
            <Container maxWidth="lg">
                <Box className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <Typography variant="body2" className="text-black dark:text-white text-center md:text-left">
                        © {new Date().getFullYear()} FR Excalibur. All rights reserved.
                    </Typography>
                    <Box className="flex gap-6">
                        <Link href="#" className="text-sm text-black dark:text-white hover:text-yellow-500 no-underline transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="text-sm text-black dark:text-white hover:text-yellow-500 no-underline transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="text-sm text-black dark:text-white hover:text-yellow-500 no-underline transition-colors">
                            Support
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
