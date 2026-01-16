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
    Link,
    Alert,
    InputAdornment,
    IconButton,
    Divider,
    Chip,
} from '@mui/material';
import { signIn, fetchAuthSession } from 'aws-amplify/auth';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Sign in with Amplify (Client Side)
            const { isSignedIn, nextStep } = await signIn({ username: email, password });

            if (isSignedIn) {
                // 2. Get tokens
                const session = await fetchAuthSession();
                const tokens = session.tokens;

                if (!tokens) {
                    throw new Error('No tokens retrieved');
                }

                // 3. Sync session with server (Set Cookies)
                const response = await fetch('/api/auth/sync-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        accessToken: tokens.accessToken.toString(),
                        refreshToken: tokens.idToken?.toString(), // Using idToken as refresh token placeholder? No, wait.
                        idToken: tokens.idToken?.toString(),
                    }),
                });

                // IMPORTANT: The original ServerAuthService.setAuthCookies expects (accessToken, refreshToken, idToken)
                // Amplify V6 tokens object has accessToken and idToken clearly. Refresh token is internal but accessible via string?
                // Actually, Amplify V6 doesn't always expose refresh token string easily to public API to prevent theft.
                // However, ServerAuthService USES the access token to get user info. 
                // AND ServerAuthService mints NEW JWTs. It doesn't actually store the Cognito Refresh Token in the final cookie 
                // (it stores its OWN minted refresh token).
                // So I just need to pass the Access Token and ID Token so ServerAuthService can validate the user.
                // For the "refreshToken" argument of setAuthCookies, I will pass the idToken or empty string if it's not strictly used for validation there.
                // Looking at ServerAuthService: it calls CognitoAuthService.getUser(cognitoAccessToken). 
                // It does NOT use cognitoRefreshToken for anything other than maybe passing it through? 
                // Let's re-read ServerAuthService.
                // Line 36: cognitoRefreshToken: string.
                // Line 47: getUser(cognitoAccessToken). 
                // It DOES NOT use cognitoRefreshToken to validate.
                // It does not seem to likely use it for anything critical if it generates its own tokens.
                // So passing idToken or a placeholder is fine.

                if (response.ok) {
                    window.location.href = '/';
                } else {
                    setError('Failed to create session');
                }
            } else {
                if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
                    setError('Please confirm your account first.');
                } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
                    setError('New password required. Please contact support or use the full login flow.');
                } else {
                    setError(`Login step: ${nextStep.signInStep}`);
                }
            }
        } catch (err: any) {
            console.error('Login error', err);
            if (err.name === 'NotAuthorizedException') {
                setError('Incorrect username or password.');
            } else if (err.name === 'UserNotFoundException') {
                setError('User not found.');
            } else {
                setError(err.message || 'Connection error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4 py-8 sm:py-12">
            <Container maxWidth="sm" className="px-4 sm:px-6">
                <Box className="text-center mb-6 sm:mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary-main rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <Typography variant="h3" className="font-bold mb-2 text-primary-main text-2xl sm:text-3xl lg:text-4xl">
                        FR EXCALIBUR
                    </Typography>
                    <Typography variant="body1" color="text.secondary" className="text-sm sm:text-base">
                        Sign in to continue
                    </Typography>
                </Box>

                <Card className="shadow-xl rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-gray-100">
                    <CardContent className="p-6 sm:p-8">
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

                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
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

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember-me"
                                        className="mr-2 w-4 h-4 accent-primary-main"
                                    />
                                    <label htmlFor="remember-me">
                                        <Typography variant="body2" className="text-white dark:text-black cursor-pointer">
                                            Remember me
                                        </Typography>
                                    </label>
                                </div>
                                <Link href="/forgot-password" className="text-sm text-primary-dark hover:underline">
                                    Forgot your password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                className="bg-primary-main hover:bg-primary-dark text-black font-bold shadow-lg py-3 rounded-xl"
                            >
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <Typography variant="caption" className="text-center block mt-6 text-white dark:text-black">
                        Don&apos;t have an account?{' '}
                            <Link href="/register" className="font-semibold">
                                Sign up here
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>

                <Typography variant="caption" className="text-center block mt-6 text-white dark:text-black">
                    © {new Date().getFullYear()} FR EXCALIBUR. All rights reserved.
                </Typography>
            </Container>
        </div>
    );
}
