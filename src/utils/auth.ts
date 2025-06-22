import type { LoginResponse, RefreshTokenResponse } from '@/types/api'

// Token storage keys
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user_data'

// Token management utilities
export class TokenManager {
	// Get access token
	static getAccessToken(): string | null {
		return localStorage.getItem(TOKEN_KEY)
	}

	// Set access token
	static setToken(token: string): void {
		localStorage.setItem(TOKEN_KEY, token)
	}

	// Remove access token
	static removeToken(): void {
		localStorage.removeItem(TOKEN_KEY)
	}

	// Get refresh token
	static getRefreshToken(): string | null {
		return localStorage.getItem(REFRESH_TOKEN_KEY)
	}

	// Set refresh token
	static setRefreshToken(refreshToken: string): void {
		localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
	}

	// Remove refresh token
	static removeRefreshToken(): void {
		localStorage.removeItem(REFRESH_TOKEN_KEY)
	}

	// Get user data
	static getUser(): any | null {
		const userData = localStorage.getItem(USER_KEY)
		return userData ? JSON.parse(userData) : null
	}

	// Set user data
	static setUser(user: any): void {
		localStorage.setItem(USER_KEY, JSON.stringify(user))
	}

	// Remove user data
	static removeUser(): void {
		localStorage.removeItem(USER_KEY)
	}

	// Store login response
	static storeLoginResponse(response: LoginResponse): void {
		this.setToken(response.accessToken)
		if (response.refreshToken) {
			this.setRefreshToken(response.refreshToken)
		}
		this.setUser(response.user)
	}

	// Store refresh response
	static storeRefreshResponse(response: RefreshTokenResponse): void {
		this.setToken(response.accessToken)
		if (response.refreshToken) {
			this.setRefreshToken(response.refreshToken)
		}
	}

	// Clear all auth data
	static clearAuth(): void {
		this.removeToken()
		this.removeRefreshToken()
		this.removeUser()
	}

	// Check if user is authenticated
	static isAuthenticated(): boolean {
		return !!this.getAccessToken()
	}

	// Check if token is expired (basic check - you might want to decode JWT)
	static isTokenExpired(): boolean {
		const token = this.getAccessToken()
		if (!token) return true

		try {
			// Basic JWT expiration check
			const payload = JSON.parse(atob(token.split('.')[1]))
			const currentTime = Date.now() / 1000
			return payload.exp < currentTime
		} catch {
			return true
		}
	}
}

// Session storage alternative for sensitive data
export class SessionTokenManager {
	private static readonly TOKEN_KEY = 'session_auth_token'
	private static readonly REFRESH_TOKEN_KEY = 'session_refresh_token'

	static getToken(): string | null {
		return sessionStorage.getItem(this.TOKEN_KEY)
	}

	static setToken(token: string): void {
		sessionStorage.setItem(this.TOKEN_KEY, token)
	}

	static removeToken(): void {
		sessionStorage.removeItem(this.TOKEN_KEY)
	}

	static getRefreshToken(): string | null {
		return sessionStorage.getItem(this.REFRESH_TOKEN_KEY)
	}

	static setRefreshToken(refreshToken: string): void {
		sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
	}

	static removeRefreshToken(): void {
		sessionStorage.removeItem(this.REFRESH_TOKEN_KEY)
	}

	static clearAuth(): void {
		this.removeToken()
		this.removeRefreshToken()
	}
}