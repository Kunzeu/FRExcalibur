'use client';

import { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import {
    Container,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    InputAdornment,
    IconButton,
    Divider,
    Chip,
    LinearProgress,
} from '@mui/material';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const passwordStrength = () => {
        const { password } = formData;
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength += 25;
        return strength;
    };

    const getStrengthColor = () => {
        const strength = passwordStrength();
        if (strength < 50) return 'error';
        if (strength < 75) return 'warning';
        return 'success';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('Password must contain at least 8 characters, including uppercase, lowercase, number and special character');
            return;
        }

        setLoading(true);

        try {
            const { isSignUpComplete, nextStep } = await signUp({
                username: formData.email,
                password: formData.password,
                options: {
                    userAttributes: {
                        name: formData.name,
                        email: formData.email,
                    },
                },
            });

            if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
                window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
            } else if (isSignUpComplete) {
                window.location.href = '/login';
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <Typography variant="h3" className="font-bold mb-2 text-primary-main">
                        Create Account
                    </Typography>
                    <Typography variant="body1" className="text-black dark:text-white">
                        Join FR EXCALIBUR
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
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                size="medium"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </InputAdornment>
                                    ),
                                    style: { padding: '8px 0' }
                                }}
                                className="bg-gray-50"
                            />

                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

                            <div>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    size="medium"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        style: { padding: '8px 0' }
                                    }}
                                    className="bg-gray-50"
                                />
                                {formData.password && (
                                    <Box className="mt-2">
                                        <LinearProgress
                                            variant="determinate"
                                            value={passwordStrength()}
                                            color={getStrengthColor()}
                                            className="rounded-full h-2"
                                        />
                                        <Typography variant="caption" color="text.secondary" className="mt-1 block">
                                            Strength: {passwordStrength()}%
                                        </Typography>
                                    </Box>
                                )}
                            </div>

                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
                                helperText={
                                    formData.confirmPassword !== '' && formData.password !== formData.confirmPassword
                                        ? 'Passwords do not match'
                                        : ''
                                }
                                size="medium"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </IconButton>
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
                                {loading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>

                        <Typography variant="body2" className="text-center mt-6 text-black dark:text-white">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold">
                                Sign in
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>

                <Typography variant="caption" className="text-center block mt-6 text-black dark:text-white">
                    © {new Date().getFullYear()} FR EXCALIBUR. All rights reserved.
                </Typography>
            </Container>
        </div>
    );
}
