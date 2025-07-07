import type { LoginRequest, LoginResponse, RefreshTokenResponse, UserInfo } from '@/types/auth'
import { TokenManager } from '@/utils/auth'
import { api } from './axios'

export class AuthService {
	private static readonly BASE_URL = '/auth'

	// Login user
	static async login(credentials: LoginRequest): Promise<LoginResponse> {
		const response = await api.post<LoginResponse>(`${this.BASE_URL}/login`, credentials)

		if (response.data) {
			// Store the login response
			TokenManager.storeLoginResponse(response.data)
			return response.data
		}

		throw new Error('Login failed')
	}

	// Logout user
	static async logout(): Promise<void> {
		try {
			const token = TokenManager.getAccessToken();
			if (!token) {
				throw new Error('No access token available');
			}
			
			// Backend expects a GET request with Authorization header
			await api.get(`${this.BASE_URL}/logout`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
		} finally {
			TokenManager.clearAuth();
		}
	}

	// Refresh access token
	static async refreshToken(): Promise<RefreshTokenResponse> {
		const refreshToken = TokenManager.getRefreshToken()
		if (!refreshToken) {
			throw new Error('No refresh token available')
		}

		// Backend expects a GET request with refreshToken in the request body
		const response = await api.get<RefreshTokenResponse>(`${this.BASE_URL}/refresh`, {
			data: { refreshToken }  // This will be sent as the request body even in a GET request
		})

		if (response.data) {
			// Store the refresh response
			TokenManager.storeRefreshResponse(response.data)
			return response.data
		}

		throw new Error('Token refresh failed')
	}

	// Get current user profile
	static async getCurrentUser(): Promise<UserInfo> {
		const response = await api.get<UserInfo>(`${this.BASE_URL}/me`)

		if (response.data) {
			TokenManager.setUser(response.data)
			return response.data
		}

		throw new Error('Failed to get user profile')
	}

	// Update user profile
	static async updateProfile(profileData: any): Promise<UserInfo> {
		const response = await api.put<UserInfo>(`${this.BASE_URL}/profile`, profileData)

		if (response.data) {
			TokenManager.setUser(response.data)
			return response.data
		}

		throw new Error('Failed to update profile')
	}

	// Change password
	static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
		const response = await api.post(`${this.BASE_URL}/change-password`, {
			currentPassword,
			newPassword
		})

		if (response.status !== 200) {
			throw new Error('Failed to change password')
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
	
	// Parse JWT token to get expiration time
	static parseJwt(token: string): any {
		try {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
			
			return JSON.parse(jsonPayload);
		} catch (e) {
			return null;
		}
	}
}