// Export all services for easy importing
export { AuthService } from '@/api/auth.service'
export { UserService, userService } from '@/api/user.service'
export { settingsService } from '@/api/settings.service'

// Admin services
export { BookingsService, type BookingCriteria } from '@/api/bookings.service'
export { ServicesService, type ServiceCriteria } from '@/api/services.service'
export { PetsService, type PetCriteria } from '@/api/pets.service'
export { TermsService } from '@/api/terms.service'
export { WithdrawalsService, type WithdrawalCriteria } from '@/api/withdrawals.service'

// Re-export types for convenience from the new type files
export type { ApiResponse, ApiError, PaginationParams, ListResponse, AppSettings } from '@/types/common'
export type { LoginRequest, LoginResponse, AuthTokenExpiry, RefreshTokenResponse } from '@/types/auth'
export type { Role, User, UserRequest } from '@/types/user'
export type { Pet, Customer, Appointment, Booking } from '@/types/booking'
export type { Service, ServiceRequest, ServicePatchRequest } from '@/types/service'
export type { Pet as PetType, PetRequest, PetPatchRequest, ListPetResponse } from '@/types/pet'
export type { Term, CreateTermsRequest, UpdateTermsRequest } from '@/types/term'
export type {
	Withdrawal,
	WithdrawalRequest,
	WithdrawalActionRequest,
	ListWithdrawalResponse
} from '@/types/withdrawal'

// User service types
export type {
	UserCriteria,
	UpdateUserRequest,
	ChangeUserRoleRequest
} from '@/api/user.service'