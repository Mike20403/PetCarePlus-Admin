// Authentication Types
export interface LoginRequest {
	email: string
	password: string
}

export interface AuthTokenExpiry {
	token: number
	refreshToken: number
}

export interface LoginResponse {
	token: string
	refreshToken?: string
	expiresIn?: AuthTokenExpiry
}

export interface RefreshTokenRequest {
	refreshToken: string
}

export interface RefreshTokenResponse {
	token: string
	refreshToken?: string
	expiresIn?: AuthTokenExpiry
}