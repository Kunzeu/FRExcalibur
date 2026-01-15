'use client';

import { useState } from 'react';
import {
    Container,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    Link,
} from '@mui/material';
import { resetPassword } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const output = await resetPassword({ username: email });
            const { nextStep } = output;

            if (nextStep.resetPasswordStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
                router.push(`/reset-password?email=${encodeURIComponent(email)}`);
            } else if (nextStep.resetPasswordStep === 'DONE') {
                // Sucedió algo raro si ya termino sin código, pero manejarlo
                router.push('/login');
            }
        } catch (err: any) {
            console.error('Reset password error:', err);
            setError(err.message || 'Failed to send reset code. Please check the email and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
            <Container maxWidth="sm">
                <Box className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-main rounded-2xl mb-4 shadow-lg">
                        <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 19.464a2.56 2.56 0 21-3.636 0L5.429 17a2.56 2.56 0 210-3.636l1.243 1.243a4 4 0 115.195-5.195" />
                        </svg>
                    </div>
                    <Typography variant="h3" className="font-bold mb-2 text-primary-main">
                        Forgot Password?
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Enter your email to reset your password
                    </Typography>
                </Box>

                <Card className="shadow-xl rounded-2xl overflow-hidden bg-white border border-gray-100">
                    <CardContent className="p-8">
                        {error && (
                            <Alert severity="error" className="mb-6 rounded-lg">
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                size="medium"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </InputAdornment>
                                    ),
                                    style: { padding: '8px 0' }
                                }}
                                className="bg-gray-50"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                className="bg-primary-main hover:bg-primary-dark text-black font-bold shadow-lg py-3 rounded-xl"
                            >
                                {loading ? 'Sending Code...' : 'Send Reset Code'}
                            </Button>
                        </form>

                        <Box className="mt-6 text-center">
                            <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-primary-main no-underline">
                                Back to Login
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}
