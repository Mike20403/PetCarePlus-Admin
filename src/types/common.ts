// Common API Response Types
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