// API Response Types
export interface ApiResponse<T = any> {
	success: boolean
	data: T
	message?: string
	errors?: string[]
	pagination?: {
		page: number
		size: number
		total: number
		totalPages: number
	}
}

export interface ApiError {
	message: string
	code?: string
	status?: number
	details?: any
}

// Authentication Types
export interface LoginRequest {
	email: string
	password: string
}

export interface LoginResponse {
	accessToken: string
	refreshToken?: string
	user: {
		id: number
		email: string
		name: string
		role: string
		roles: string[]
		permissions: string[]
	}
}

export interface RefreshTokenRequest {
	refreshToken: string
}

export interface RefreshTokenResponse {
	accessToken: string
	refreshToken?: string
}

// User Management Types
export interface Role {
	id: number
	name: string
}

export interface User {
	id: number
	name: string
	email: string
	role: Role
	createdAt: string
	updatedAt: string
}

export interface UserRequest {
	name: string
	email: string
	password?: string
	roleId: number
}

// Common Entity Types
export interface Pet {
	id: number
	name: string
	species: string
	breed: string
	age: number
	ownerId: number
	createdAt: string
	updatedAt: string
}

export interface Customer {
	id: number
	name: string
	email: string
	phone: string
	address: string
	pets: Pet[]
	createdAt: string
	updatedAt: string
}

export interface Appointment {
	id: number
	petId: number
	customerId: number
	veterinarianId: number
	scheduledAt: string
	status: 'scheduled' | 'completed' | 'cancelled'
	notes?: string
	createdAt: string
	updatedAt: string
}

// Request/Response pagination
export interface PaginationParams {
	page?: number
	size?: number
	sort?: string
	direction?: 'asc' | 'desc'
}

export interface ListResponse<T> extends ApiResponse<T[]> {
	pagination: {
		page: number
		size: number
		total: number
		totalPages: number
	}
}
export interface AppSettings {
	generalSetting1: string;
	generalSetting2: boolean;
	emailSetting1: string;
	emailSetting2: number;
	apiKey: string;
	systemVersion: string;
}