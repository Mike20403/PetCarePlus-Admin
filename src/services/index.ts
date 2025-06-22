// Export all services for easy importing
export { AuthService } from '@/api/auth.service'
export { PetsService } from '@/api/pets.service'
export { CustomersService } from '@/api/customers.service'
export { AppointmentsService } from '@/api/appointments.service'
export { getDashboardStats, getMonthlyAppointments, getMonthlyRevenue } from '@/api/dashboard.service'
export { userService } from '@/api/user.service'
export { settingsService } from '@/api/settings.service'

// Re-export types for convenience
export type { ApiResponse, ApiError } from '@/types/api'
export type {
	Pet,
	Customer,
	Appointment,
	LoginRequest,
	LoginResponse,
	PaginationParams,
	ListResponse,
	User,
	Role,
	UserRequest,
	AppSettings
} from '@/types/api'