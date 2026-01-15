'use client';

import { useState, Suspense } from 'react';
import { confirmSignUp } from 'aws-amplify/auth';
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
} from '@mui/material';

function VerifyEmailForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const emailFromUrl = searchParams.get('email') || '';

    const [email, setEmail] = useState(emailFromUrl);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const { isSignUpComplete } = await confirmSignUp({
                username: email,
                confirmationCode: code
            });

            if (isSignUpComplete) {
                setMessage('Email verified successfully! Redirecting to login...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                // Should ideally not happen for standard flows but handle it
                setMessage('Verification successful! You can now log in.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }

        } catch (err: any) {
            console.error('Verification error:', err);
            setError(err.message || 'Verification failed. Please check your code and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-xl rounded-2xl overflow-hidden bg-white border border-gray-100 max-w-md w-full">
            <CardContent className="p-8">
                <Typography variant="h4" className="font-bold mb-6 text-center text-primary-main">
                    Verify Email
                </Typography>

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
                    />
                    <TextField
                        fullWidth
                        label="Verification Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        className="bg-primary-main text-white py-3"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyEmailForm />
            </Suspense>
        </div>
    );
}
