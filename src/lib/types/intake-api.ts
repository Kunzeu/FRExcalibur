export type IntakeType = 'PIMM' | 'L2M' | 'LEGAL' | 'WORKERS_COMP' | 'GENERAL';
export type IntakeStatus = 'PENDING' | 'QUALIFIED' | 'REJECTED' | 'CONVERTED' | 'FOLLOW_UP';
export type RejectedReason = 
    | 'NO_INJURY' 
    | 'OUT_OF_STATE' 
    | 'STATUTE_EXPIRED' 
    | 'NO_LIABILITY' 
    | 'CLIENT_DECLINED' 
    | 'DUPLICATE' 
    | 'INSUFFICIENT_INFO' 
    | 'OTHER';

export type ReferralMethod = 
    | 'TV' 
    | 'RADIO' 
    | 'SOCIAL_MEDIA' 
    | 'REFERRAL' 
    | 'BILLBOARD' 
    | 'INTERNET' 
    | 'WALK_IN' 
    | 'OTHER';

export interface IntakeResponse {
    id: string;
    intakeNumber: string;
    tenantId: string;
    intakeType: IntakeType;
    status: IntakeStatus;
    statusNote?: string;
    rejectedReason?: RejectedReason;
    brandId: string;
    brandName?: string;
    caseTypeId?: string;
    clientUserId?: string;
    campaignId?: string;
    subsourceId?: string;
    subsourceName?: string;
    referrerUrl?: string;
    subsourceText?: string;
    inboundPhoneNumber?: string;
    referralMethod?: ReferralMethod;
    referralDetails?: string;
    referredBy?: string;
    accidentDate?: string; // ISO date format
    accidentLocation?: string;
    description?: string;
    qualifiedAt?: string; // ISO date-time format
    convertedAt?: string; // ISO date-time format
    typeSpecificData?: Record<string, any>;
    version: number;
    createdBy: string;
    updatedBy?: string;
    createdAt: string; // ISO date-time format
    updatedAt?: string; // ISO date-time format
}

export interface IntakeCreateRequest {
    intakeType: IntakeType;
    brandId: string;
    caseTypeId?: string;
    campaignId?: string;
    referrerUrl?: string;
    subsourceId?: string;
    subsourceText?: string;
    inboundPhoneNumber?: string;
    referralMethod?: ReferralMethod;
    referralDetails?: string;
    referredBy?: string;
    accidentDate?: string; // ISO date format
    accidentLocation?: string;
    description: string;
    typeSpecificData?: Record<string, any>;
}

export interface IntakeUpdateRequest {
    status?: IntakeStatus;
    statusNote?: string;
    rejectedReason?: RejectedReason;
    campaignId?: string;
    referrerUrl?: string;
    subsourceText?: string;
    referralMethod?: ReferralMethod;
    referralDetails?: string;
    referredBy?: string;
    accidentDate?: string; // ISO date format
    accidentLocation?: string;
    description?: string;
    typeSpecificData?: Record<string, any>;
}

export interface Pageable {
    page: number;
    size: number;
    sort?: string[];
}

export interface Sort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}

export interface PageableInfo {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    offset: number;
    sort: Sort;
}

export interface Page<T> {
    totalPages: number;
    totalElements: number;
    pageable: PageableInfo;
    first: boolean;
    last: boolean;
    size: number;
    content: T[];
    number: number;
    sort: Sort;
    numberOfElements: number;
    empty: boolean;
}

export interface PageIntakeResponse extends Page<IntakeResponse> {}

export interface UserResponse {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    phoneNumber?: string;
    userType?: string;
    tenantId?: string;
    brandId?: string;
    roleId?: string;
    roleName?: string;
    timezone?: string;
    preferredLanguage?: string;
    profilePictureUrl?: string;
    isActive?: boolean;
    canAuthenticate?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

// Authentication types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    redirectUrl?: string;
}

export interface ResetPasswordRequest {
    email: string;
    confirmationCode: string;
    newPassword: string;
}

export interface ConfirmEmailRequest {
    email: string;
    confirmationCode: string;
}

// User management types
export type UserType = 'STAFF' | 'CUSTOMER' | 'PROFESSIONAL' | 'SCREENER' | 'ADMIN' | 'SYSTEM';

export interface CreateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    userType: UserType;
    roleId?: string;
    brandId?: string;
    sendInvitation?: boolean;
}

export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    roleId?: string;
    brandId?: string;
    timezone?: string;
    preferredLanguage?: string;
    isActive?: boolean;
}

