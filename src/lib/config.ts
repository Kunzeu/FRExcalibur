import { z } from 'zod';

// Esquema para desarrollo: permite valores vacíos
const cognitoConfigSchemaDev = z.object({
    region: z.string().default('us-east-1'),
    userPoolId: z.string().default(''),
    clientId: z.string().default(''),
    clientSecret: z.string().optional(),
});

// Esquema para producción: requiere todos los valores
const cognitoConfigSchemaProd = z.object({
    region: z.string().min(1, 'AWS Region es requerida'),
    userPoolId: z.string().min(1, 'User Pool ID es requerido'),
    clientId: z.string().min(1, 'Client ID es requerido'),
    clientSecret: z.string().optional(),
});

const cookieConfigSchema = z.object({
    domain: z.string().default('localhost'),
    secure: z.boolean().default(process.env.NODE_ENV === 'production'),
    accessTokenDuration: z.number().default(900),
    refreshTokenDuration: z.number().default(2592000),
    secret: z.string().min(32, 'Cookie secret debe tener al menos 32 caracteres'),
});

// Usar esquema apropiado según el entorno
const isDevelopment = process.env.NODE_ENV !== 'production';
const cognitoSchema = isDevelopment ? cognitoConfigSchemaDev : cognitoConfigSchemaProd;

export const cognitoConfig = cognitoSchema.parse({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    clientSecret: process.env.COGNITO_CLIENT_SECRET,
});

// Helper para verificar si Cognito está configurado
export const isCognitoConfigured = () => {
    return !!(cognitoConfig.userPoolId && cognitoConfig.clientId && cognitoConfig.region);
};

// Helper para verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
    return !!process.env.SUPABASE_DATABASE_URL;
};

export const cookieConfig = cookieConfigSchema.parse({
    domain: process.env.COOKIE_DOMAIN,
    secure: process.env.COOKIE_SECURE === 'true',
    accessTokenDuration: parseInt(process.env.ACCESS_TOKEN_DURATION || '900'),
    refreshTokenDuration: parseInt(process.env.REFRESH_TOKEN_DURATION || '2592000'),
    secret: process.env.COOKIE_SECRET,
});

export const COOKIE_NAMES = {
    ACCESS_TOKEN: '__Host-access-token',
    REFRESH_TOKEN: '__Host-refresh-token',
    USER_INFO: '__Host-user-info',
} as const;

export const APP_CONFIG = {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
} as const;
