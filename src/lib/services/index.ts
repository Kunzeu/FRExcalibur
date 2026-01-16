// Export all services for easy importing
export { intakeService } from './intake.service';
export { authService } from './auth.service';
export { userService } from './user.service';

// Re-export types for convenience
export type {
    IntakeResponse,
    IntakeCreateRequest,
    IntakeUpdateRequest,
    Pageable,
    PageIntakeResponse,
    UserResponse,
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    ResetPasswordRequest,
    ConfirmEmailRequest,
    CreateUserRequest,
    UpdateUserRequest,
    UserType
} from '../types/intake-api';

