'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
    IconButton,
} from '@mui/material';
import { confirmResetPassword } from 'aws-amplify/auth';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const emailFromUrl = searchParams.get('email') || '';

    const [email, setEmail] = useState(emailFromUrl);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await confirmResetPassword({
                username: email,
                confirmationCode: code,
                newPassword: newPassword
            });

            setMessage('Password has been reset successfully! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err: any) {
            console.error('Confirm reset password error:', err);
            setError(err.message || 'Failed to reset password. Please check your code and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-xl rounded-2xl overflow-hidden bg-white border border-gray-100 max-w-md w-full">
            <CardContent className="p-8">
                <Box className="text-center mb-6">
                    <Typography variant="h4" className="font-bold mb-2 text-primary-main">
                        Reset Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Enter the code sent to your email and your new password
                    </Typography>
                </Box>

                {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                {message && <Alert severity="success" className="mb-4">{message}</Alert>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={!!emailFromUrl}
                        size="medium"
                        className="bg-gray-50"
                    />

                    <TextField
                        fullWidth
                        label="Confirmation Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        size="medium"
                        className="bg-gray-50"
                    />

                    <TextField
                        fullWidth
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        size="medium"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        className="bg-gray-50"
                    />

                    <TextField
                        fullWidth
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        size="medium"
                        error={confirmPassword !== '' && newPassword !== confirmPassword}
                        helperText={confirmPassword !== '' && newPassword !== confirmPassword ? 'Passwords do not match' : ''}
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
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
            <Container maxWidth="sm" className="flex justify-center">
                <Suspense fallback={<div>Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </Container>
        </div>
    );
}
