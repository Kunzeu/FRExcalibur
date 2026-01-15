import { ServerAuthService } from '@/lib/services/server-auth.service';
import { redirect } from 'next/navigation';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Chip,
    Stack,
    Alert,
    Avatar,
    Divider,
} from '@mui/material';
import {
    Verified,
    Security,
    Logout,
    Person,
    Email,
    Dashboard,
    Settings,
    Notifications,
} from '@mui/icons-material';

export default async function Home() {
    const session = await ServerAuthService.getSession();

    if (!session) {
        redirect('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-[#F6F6F6]">
            {/* Header */}


            {/* Content */}
            <Container maxWidth="lg" className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
                {/* Welcome Section */}
                <Card className="mb-4 sm:mb-6 shadow-md rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-gray-100">
                    <div className="bg-gradient-to-r from-primary-main to-primary-light p-4 sm:p-6 lg:p-8 text-black">
                        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
                            <Avatar
                                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 border-2 sm:border-4 border-white shadow-md"
                                sx={{ bgcolor: 'white', color: 'primary.main' }}
                            >
                                <Person sx={{ fontSize: { xs: 32, sm: 40, lg: 48 } }} />
                            </Avatar>
                            <div className="text-center sm:text-left">
                                <Typography variant="h3" className="font-bold mb-2 text-xl sm:text-2xl lg:text-3xl">
                                    Welcome, {session.user.name}! 👋
                                </Typography>
                                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        <Email className="text-sm opacity-80" sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                        <Typography variant="body1" className="opacity-90 text-sm sm:text-base">
                                            {session.user.email}
                                        </Typography>
                                    </div>
                                    {session.user.emailVerified && (
                                        <Chip
                                            icon={<Verified sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                                            label="Verified"
                                            size="small"
                                            className="bg-black/10 text-black border-none"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {/* Stats Cards */}
                    <Card className="shadow-md rounded-2xl bg-white border border-gray-100">
                        <CardContent className="text-center p-6">
                            <div className="w-16 h-16 bg-primary-gold-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Person className="text-primary-main text-3xl" />
                            </div>
                            <Typography variant="h4" className="font-bold mb-2 text-black">
                                1
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active User
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md rounded-2xl bg-white border border-gray-100">
                        <CardContent className="text-center p-6">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Security className="text-green-600 text-3xl" />
                            </div>
                            <Typography variant="h4" className="font-bold mb-2 text-black">
                                100%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Security
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md rounded-2xl bg-white border border-gray-100">
                        <CardContent className="text-center p-6">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Verified className="text-gray-600 text-3xl" />
                            </div>
                            <Typography variant="h4" className="font-bold mb-2 text-black">
                                {session.user.emailVerified ? 'Yes' : 'No'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Email Verified
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <Card className="shadow-md rounded-2xl bg-white border border-gray-100">
                        <CardContent className="p-6">
                            <Typography variant="h6" className="font-bold mb-4 flex items-center gap-2 text-black">
                                <Person className="text-primary-main" />
                                Session Information
                            </Typography>
                            <Divider className="mb-4" />
                            <Stack spacing={3}>
                                <div>
                                    <Typography variant="caption" color="text.secondary" className="block mb-1">
                                        User ID
                                    </Typography>
                                    <Typography variant="body2" className="font-mono bg-gray-50 p-2 rounded text-black">
                                        {session.user.id}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="caption" color="text.secondary" className="block mb-1">
                                        Email
                                    </Typography>
                                    <Typography variant="body2" className="font-mono bg-gray-50 p-2 rounded text-black">
                                        {session.user.email}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography variant="caption" color="text.secondary" className="block mb-1">
                                        Status
                                    </Typography>
                                    <Chip
                                        icon={<Security />}
                                        label="Authenticated"
                                        color="success"
                                        size="small"
                                    />
                                </div>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md rounded-2xl bg-white border border-gray-100">
                        <CardContent className="p-6">
                            <Typography variant="h6" className="font-bold mb-4 flex items-center gap-2 text-black">
                                <Security className="text-green-600" />
                                Implemented Security
                            </Typography>
                            <Divider className="mb-4" />
                            <Stack spacing={2}>
                                <Alert severity="success" className="rounded-lg">
                                    <Typography variant="body2">
                                        Tokens in httpOnly cookies
                                    </Typography>
                                </Alert>
                                <Alert severity="success" className="rounded-lg">
                                    <Typography variant="body2">
                                        CSRF Protection Active
                                    </Typography>
                                </Alert>
                                <Alert severity="success" className="rounded-lg">
                                    <Typography variant="body2">
                                        Automatic refresh every 15 min
                                    </Typography>
                                </Alert>
                                <Alert severity="success" className="rounded-lg">
                                    <Typography variant="body2">
                                        Security Headers Configured
                                    </Typography>
                                </Alert>
                            </Stack>
                        </CardContent>
                    </Card>
                </div>

                {/* Tech Stack */}
                <Card className="mt-4 sm:mt-6 shadow-md rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-gold-50 to-white border border-gray-100">
                    <CardContent className="p-4 sm:p-6">
                        <Typography variant="h6" className="font-bold mb-3 sm:mb-4 text-black text-lg sm:text-xl">
                            🚀 Technology Stack
                        </Typography>
                        <div className="flex flex-wrap gap-2">
                            <Chip label="Next.js 15" color="primary" variant="outlined" />
                            <Chip label="TypeScript" color="primary" variant="outlined" />
                            <Chip label="Material UI" color="secondary" variant="outlined" />
                            <Chip label="Tailwind CSS" color="secondary" variant="outlined" />
                            <Chip label="AWS Cognito" color="success" variant="outlined" />
                            <Chip label="Zod" color="info" variant="outlined" />
                            <Chip label="Secure Cookies" color="warning" variant="outlined" />
                        </div>
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}
