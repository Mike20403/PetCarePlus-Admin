// Export all services for easy importing
export { AuthService } from './auth.service'
export { PetsService } from './pets.service'
export { CustomersService } from './customers.service'
export { AppointmentsService } from './appointments.service'
export { getDashboardStats, getMonthlyAppointments, getMonthlyRevenue } from './dashboard.service'
export { userService } from './user.service'
export { settingsService } from './settings.service'

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