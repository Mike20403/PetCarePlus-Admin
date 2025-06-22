import { api } from '@/axios'
import type { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse, ApiResponse } from '@/types/api'
import { TokenManager } from '@/utils/auth'

export class AuthService {
	private static readonly BASE_URL = '/auth'

	// Login user
	static async login(credentials: LoginRequest): Promise<LoginResponse> {
		const response = await api.post<ApiResponse<LoginResponse>>(`${this.BASE_URL}/login`, credentials)

		if (response.data.success && response.data.data) {
			TokenManager.storeLoginResponse(response.data.data)
			return response.data.data
		}

		throw new Error(response.data.message || 'Login failed')
	}

	// Logout user
	static async logout(): Promise<void> {
		try {
			await api.post(`${this.BASE_URL}/logout`)
		} finally {
			TokenManager.clearAuth()
		}
	}

	// Refresh access token
	static async refreshToken(): Promise<RefreshTokenResponse> {
		const refreshToken = TokenManager.getRefreshToken()
		if (!refreshToken) {
			throw new Error('No refresh token available')
		}

		const response = await api.post<ApiResponse<RefreshTokenResponse>>(`${this.BASE_URL}/refresh`, {
			refreshToken
		})

		if (response.data.success && response.data.data) {
			TokenManager.storeRefreshResponse(response.data.data)
			return response.data.data
		}

		throw new Error(response.data.message || 'Token refresh failed')
	}

	// Get current user profile
	static async getCurrentUser(): Promise<any> {
		const response = await api.get<ApiResponse<LoginResponse['user']>>(`${this.BASE_URL}/me`)

		if (response.data.success && response.data.data) {
			TokenManager.setUser(response.data.data)
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to get user profile')
	}

	// Update user profile
	static async updateProfile(profileData: any): Promise<any> {
		const response = await api.put(`${this.BASE_URL}/profile`, profileData)

		if (response.data.success && response.data.data) {
			TokenManager.setUser(response.data.data)
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to update profile')
	}

	// Change password
	static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
		const response = await api.post(`${this.BASE_URL}/change-password`, {
			currentPassword,
			newPassword
		})

		if (!response.data.success) {
			throw new Error(response.data.message || 'Failed to change password')
		}
	}

	// Check if user is authenticated
	static isAuthenticated(): boolean {
		return TokenManager.isAuthenticated() && !TokenManager.isTokenExpired()
	}

	// Get stored user data
	static getCurrentUserData(): any | null {
		return TokenManager.getUser()
	}
}