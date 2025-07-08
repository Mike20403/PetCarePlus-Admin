import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import type { ApiResponse, ApiError } from '@/types/common'
import type { AuthTokenExpiry, RefreshTokenResponse } from '@/types/auth'
import { TokenManager } from '@/utils/auth'
import { logger } from '@/utils/logger'

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
	timeout: parseInt(import.meta.env.VITE_API_TIMEOUT as string) || 10000,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	withCredentials: false
})

let isRefreshing = false
let failedQueue: Array<{
	resolve: (value?: any) => void
	reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error)
		} else {
			resolve(token)
		}
	})

	failedQueue = []
}

// Refresh token function
const refreshAuthToken = async (): Promise<string | null> => {
	try {
		const refreshToken = TokenManager.getRefreshToken()
		if (!refreshToken) {
			throw new Error('No refresh token available')
		}

		const response = await axios.get<RefreshTokenResponse>(
			`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
			{
				data: { refreshToken },
				headers: { 'Content-Type': 'application/json' },
				timeout: 5000
			}
		)

		if (response.status === 200 && response.data) {
			TokenManager.storeRefreshResponse(response.data as RefreshTokenResponse & { expiresIn?: AuthTokenExpiry })
			return response.data.token
		}

		throw new Error('Failed to refresh token')
	} catch (error) {
		logger.error('Token refresh failed', error)
		TokenManager.clearAuth()
		return null
	}
}

// Request interceptor for adding auth token and logging
axiosInstance.interceptors.request.use(
	(config) => {
		// Add auth token if available
		const token = TokenManager.getAccessToken()
		if (token && !TokenManager.isTokenExpired()) {
			config.headers.Authorization = `Bearer ${token}`
		}

		// Add request ID for tracing
		config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

		// Add environment info
		config.headers['X-Client-Version'] = import.meta.env.VITE_APP_VERSION || '1.0.0'
		config.headers['X-Client-Environment'] = import.meta.env.VITE_APP_ENV || 'development'

		// Log request in development
		logger.logRequest(config)

		return config
	},
	(error) => {
		logger.logError(error)
		return Promise.reject(error)
	}
)

// Response interceptor for handling common errors and token refresh
axiosInstance.interceptors.response.use(
	(response: AxiosResponse) => {
		// Log successful response in development
		logger.logResponse(response)
		return response
	},
	async (error: AxiosError) => {
		const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

		// Log error
		logger.logError(error)

		// Handle 401 Unauthorized
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// Queue the request if token refresh is in progress
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				}).then(token => {
					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${token}`
					}
					return axiosInstance(originalRequest)
				}).catch(err => {
					return Promise.reject(err)
				})
			}

			originalRequest._retry = true
			isRefreshing = true

			try {
				const newToken = await refreshAuthToken()
				if (newToken) {
					processQueue(null, newToken)

					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${newToken}`
					}

					return axiosInstance(originalRequest)
				} else {
					processQueue(new Error('Token refresh failed'), null)
					handleAuthenticationError()
					return Promise.reject(error)
				}
			} catch (refreshError) {
				processQueue(refreshError, null)
				handleAuthenticationError()
				return Promise.reject(refreshError)
			} finally {
				isRefreshing = false
			}
		}

		// Handle other HTTP errors
		return Promise.reject(createApiError(error))
	}
)

// Handle authentication errors
const handleAuthenticationError = () => {
	TokenManager.clearAuth()

	// Only redirect if we're not already on the login page
	if (window.location.pathname !== '/login') {
		logger.warn('Authentication failed, redirecting to login')
		window.location.href = '/login'
	}
}

// Create standardized API error
const createApiError = (error: AxiosError): ApiError => {
	if (error.response) {
		// Server responded with error status
		const responseData = error.response.data as any
		return {
			message: responseData?.message || `HTTP Error ${error.response.status}`,
			code: responseData?.code || error.response.status.toString(),
			status: error.response.status,
			details: responseData
		}
	} else if (error.request) {
		// Request was made but no response received
		return {
			message: 'Network error - please check your connection',
			code: 'NETWORK_ERROR',
			details: error.message
		}
	} else {
		// Something else happened
		return {
			message: error.message || 'An unexpected error occurred',
			code: 'UNKNOWN_ERROR',
			details: error
		}
	}
}

// Utility functions for common HTTP methods
export const api = {
	// GET request
	get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
		return axiosInstance.get(url, config)
	},

	// POST request
	post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
		return axiosInstance.post(url, data, config)
	},

	// PUT request
	put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
		return axiosInstance.put(url, data, config)
	},

	// PATCH request
	patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
		return axiosInstance.patch(url, data, config)
	},

	// DELETE request
	delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
		return axiosInstance.delete(url, config)
	},

	// Upload file
	upload: <T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
		return axiosInstance.post(url, formData, {
			...config,
			headers: {
				'Content-Type': 'multipart/form-data',
				...config?.headers
			}
		})
	}
}

// Export the configured axios instance as default
export default axiosInstance

// Export types for use in components
export type { ApiResponse, ApiError }