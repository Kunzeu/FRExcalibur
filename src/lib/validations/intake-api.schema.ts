import { z } from 'zod';

// Intake Type enum
export const IntakeTypeSchema = z.enum(['PIMM', 'L2M', 'LEGAL', 'WORKERS_COMP', 'GENERAL']);

// Intake Status enum
export const IntakeStatusSchema = z.enum(['PENDING', 'QUALIFIED', 'REJECTED', 'CONVERTED', 'FOLLOW_UP']);

// Rejected Reason enum
export const RejectedReasonSchema = z.enum([
    'NO_INJURY',
    'OUT_OF_STATE',
    'STATUTE_EXPIRED',
    'NO_LIABILITY',
    'CLIENT_DECLINED',
    'DUPLICATE',
    'INSUFFICIENT_INFO',
    'OTHER'
]);

// Referral Method enum
export const ReferralMethodSchema = z.enum([
    'TV',
    'RADIO',
    'SOCIAL_MEDIA',
    'REFERRAL',
    'BILLBOARD',
    'INTERNET',
    'WALK_IN',
    'OTHER'
]);

// User Type enum
export const UserTypeSchema = z.enum(['STAFF', 'CUSTOMER', 'PROFESSIONAL', 'SCREENER', 'ADMIN', 'SYSTEM']);

// Login Request Schema
export const LoginRequestSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida')
});

// Register Request Schema
export const RegisterRequestSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    firstName: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es demasiado largo'),
    lastName: z.string().min(1, 'El apellido es requerido').max(100, 'El apellido es demasiado largo'),
    phoneNumber: z.string().optional()
});

// Reset Password Request Schema
export const ResetPasswordRequestSchema = z.object({
    email: z.string().email('Email inválido'),
    confirmationCode: z.string().min(1, 'El código de confirmación es requerido'),
    newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

// Confirm Email Request Schema
export const ConfirmEmailRequestSchema = z.object({
    email: z.string().email('Email inválido'),
    confirmationCode: z.string().min(1, 'El código de confirmación es requerido')
});

// Create User Request Schema
export const CreateUserRequestSchema = z.object({
    email: z.string().email('Email inválido'),
    firstName: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es demasiado largo'),
    lastName: z.string().min(1, 'El apellido es requerido').max(100, 'El apellido es demasiado largo'),
    phoneNumber: z.string().optional(),
    userType: UserTypeSchema,
    roleId: z.string().uuid('ID de rol inválido').optional(),
    brandId: z.string().uuid('ID de marca inválido').optional(),
    sendInvitation: z.boolean().optional()
});

// Update User Request Schema
export const UpdateUserRequestSchema = z.object({
    firstName: z.string().max(100, 'El nombre es demasiado largo').optional(),
    lastName: z.string().max(100, 'El apellido es demasiado largo').optional(),
    phoneNumber: z.string().optional(),
    roleId: z.string().uuid('ID de rol inválido').optional(),
    brandId: z.string().uuid('ID de marca inválido').optional(),
    timezone: z.string().optional(),
    preferredLanguage: z.string().optional(),
    isActive: z.boolean().optional()
});

// Intake Create Request Schema
export const IntakeCreateRequestSchema = z.object({
    intakeType: IntakeTypeSchema,
    brandId: z.string().uuid('ID de marca inválido'),
    caseTypeId: z.string().uuid('ID de tipo de caso inválido').optional(),
    campaignId: z.string().uuid('ID de campaña inválido').optional(),
    referrerUrl: z.string().max(500, 'URL demasiado larga').optional(),
    subsourceId: z.string().uuid('ID de subfuente inválido').optional(),
    subsourceText: z.string().max(200, 'Texto de subfuente demasiado largo').optional(),
    inboundPhoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Número de teléfono inválido').optional(),
    referralMethod: ReferralMethodSchema.optional(),
    referralDetails: z.string().max(200, 'Detalles de referencia demasiado largos').optional(),
    referredBy: z.string().max(200, 'Referido por demasiado largo').optional(),
    accidentDate: z.string().date('Fecha de accidente inválida').optional(),
    accidentLocation: z.string().max(1000, 'Ubicación demasiado larga').optional(),
    description: z.string().min(1, 'La descripción es requerida').max(5000, 'Descripción demasiado larga'),
    typeSpecificData: z.record(z.any()).optional()
});

// Intake Update Request Schema
export const IntakeUpdateRequestSchema = z.object({
    status: IntakeStatusSchema.optional(),
    statusNote: z.string().max(1000, 'Nota de estado demasiado larga').optional(),
    rejectedReason: RejectedReasonSchema.optional(),
    campaignId: z.string().uuid('ID de campaña inválido').optional(),
    referrerUrl: z.string().max(500, 'URL demasiado larga').optional(),
    subsourceText: z.string().max(200, 'Texto de subfuente demasiado largo').optional(),
    referralMethod: ReferralMethodSchema.optional(),
    referralDetails: z.string().max(200, 'Detalles de referencia demasiado largos').optional(),
    referredBy: z.string().max(200, 'Referido por demasiado largo').optional(),
    accidentDate: z.string().date('Fecha de accidente inválida').optional(),
    accidentLocation: z.string().max(1000, 'Ubicación demasiado larga').optional(),
    description: z.string().max(5000, 'Descripción demasiado larga').optional(),
    typeSpecificData: z.record(z.any()).optional()
});

// Pageable Schema
export const PageableSchema = z.object({
    page: z.number().int().min(0, 'La página debe ser mayor o igual a 0'),
    size: z.number().int().min(1, 'El tamaño debe ser mayor o igual a 1'),
    sort: z.array(z.string()).optional()
});

