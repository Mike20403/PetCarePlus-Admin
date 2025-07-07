import type { LoginResponse, RefreshTokenResponse } from '@/types/api'

// Token storage keys
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user_data'
const TOKEN_EXPIRY_KEY = 'token_expiry'
const REFRESH_TOKEN_EXPIRY_KEY = 'refresh_token_expiry'

// Token management utilities
export class TokenManager {
	// Get access token
	static getAccessToken(): string | null {
		return localStorage.getItem(TOKEN_KEY)
	}

	// Set access token
	static setToken(token: string, expiresIn?: number): void {
		localStorage.setItem(TOKEN_KEY, token)
		
		// If expiration time is provided, store it
		if (expiresIn) {
			const expiryTime = Date.now() + expiresIn
			localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
		}
	}

	// Remove access token
	static removeToken(): void {
		localStorage.removeItem(TOKEN_KEY)
		localStorage.removeItem(TOKEN_EXPIRY_KEY)
	}

	// Get refresh token
	static getRefreshToken(): string | null {
		return localStorage.getItem(REFRESH_TOKEN_KEY)
	}

	// Set refresh token
	static setRefreshToken(refreshToken: string, expiresIn?: number): void {
		localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
		
		// If expiration time is provided, store it
		if (expiresIn) {
			const expiryTime = Date.now() + expiresIn
			localStorage.setItem(REFRESH_TOKEN_EXPIRY_KEY, expiryTime.toString())
		}
	}

	// Remove refresh token
	static removeRefreshToken(): void {
		localStorage.removeItem(REFRESH_TOKEN_KEY)
		localStorage.removeItem(REFRESH_TOKEN_EXPIRY_KEY)
	}

	// Get token expiry time
	static getTokenExpiry(): number | null {
		const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
		return expiry ? parseInt(expiry) : null
	}

	// Get refresh token expiry time
	static getRefreshTokenExpiry(): number | null {
		const expiry = localStorage.getItem(REFRESH_TOKEN_EXPIRY_KEY)
		return expiry ? parseInt(expiry) : null
	}

	// Get user data
	static getUser(): any | null {
		const userData = localStorage.getItem(USER_KEY);

		if (!userData || userData === 'null' || userData === 'undefined') {
			return null;
		}

		const user = JSON.parse(userData);
		if (!user) {
			return null;
		}
		
		return user;
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
		this.setToken(response.token, response.expiresIn?.token)
		if (response.refreshToken) {
			this.setRefreshToken(response.refreshToken, response.expiresIn?.refreshToken)
		}
	}

	// Store refresh response
	static storeRefreshResponse(response: RefreshTokenResponse): void {
		this.setToken(response.token, response.expiresIn?.token)
		if (response.refreshToken) {
			this.setRefreshToken(response.refreshToken, response.expiresIn?.refreshToken)
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
		return !!this.getAccessToken() && !this.isTokenExpired()
	}

	// Check if token is expired
	static isTokenExpired(): boolean {
		// First check stored expiry time
		const expiryTime = this.getTokenExpiry()
		if (expiryTime && Date.now() >= expiryTime) {
			return true
		}
		
		// Fallback to JWT payload check
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
	
	// Check if refresh token is expired
	static isRefreshTokenExpired(): boolean {
		// First check stored expiry time
		const expiryTime = this.getRefreshTokenExpiry()
		if (expiryTime && Date.now() >= expiryTime) {
			return true
		}
		
		// Fallback to JWT payload check
		const token = this.getRefreshToken()
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