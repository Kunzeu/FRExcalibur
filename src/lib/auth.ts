import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CognitoProvider from 'next-auth/providers/cognito';

async function refreshAccessToken(token: JWT) {
    try {
        // Construct the token endpoint. Ideally COGNITO_DOMAIN is set.
        // If not, we might fail or need to rely on the SDK, but OAuth refresh requires the domain endpoint.
        const domain = process.env.COGNITO_DOMAIN;
        const url = `https://${domain}/oauth2/token`;

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + Buffer.from(
                    process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID + ":" + process.env.COGNITO_CLIENT_SECRET
                ).toString("base64")
            },
            method: "POST",
            body: new URLSearchParams({
                grant_type: "refresh_token",
                client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
                refresh_token: token.refreshToken
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            throw refreshedTokens;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + (refreshedTokens.expires_in as number)),
            // Fall back to old refresh token if new one is not provided
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CognitoProvider({
            clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
            clientSecret: process.env.COGNITO_CLIENT_SECRET || '',
            issuer: process.env.COGNITO_ISSUER || `https://cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`,
            authorization: {
                params: {
                    scope: "openid email phone profile offline_access",
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, account, user }) {
            // Initial sign in
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token!,
                    refreshToken: account.refresh_token!,
                    expiresAt: account.expires_at ?? Math.floor(Date.now() / 1000 + (account.expires_in as number || 3600)),
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    }
                } as JWT;
            }

            // Return previous token if the access token has not expired yet
            // buffer of 1 minute (60s)
            if (Date.now() < (token.expiresAt * 1000 - 60000)) {
                return token;
            }

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.error = token.error;
            if (session.user && token.user) {
                session.user.id = token.user.id;
            }
            return session;
        },
    },
};
