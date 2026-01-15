'use client';

import { Amplify } from 'aws-amplify';

// Configure Amplify immediately
Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
            userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
            loginWith: {
                email: true,
                username: false,
                phone: false,
            }
        }
    }
});

export default function AmplifyConfig() {
    return null;
}
