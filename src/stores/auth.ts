import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LoginResponse, RefreshTokenResponse } from '@/types/auth'
import type { User } from '@/types/user'
import { TokenManager } from '@/utils/auth'
import { AuthService } from '@/api/auth.service'

export const useAuthStore = defineStore('auth', () => {
	const user = ref<User | null>(TokenManager.getUser())
	const token = ref<string | null>(TokenManager.getAccessToken())
	const refreshToken = ref<string | null>(TokenManager.getRefreshToken())
	
	const isAuthenticated = computed(() => {
		const hasToken = !!token.value
		const tokenValid = !TokenManager.isTokenExpired()
		return hasToken && tokenValid
	})
	
	const roles = ref<string[]>([])
	const permissions = ref<string[]>([])
	const tokenExpiry = ref<number | null>(TokenManager.getTokenExpiry())
	const refreshTokenExpiry = ref<number | null>(TokenManager.getRefreshTokenExpiry())

	function setAuthData(data: LoginResponse) {
		token.value = data.token
		refreshToken.value = data.refreshToken || null
	
		if (data.expiresIn) {
			tokenExpiry.value = data.expiresIn.token ? Date.now() + data.expiresIn.token : null
			refreshTokenExpiry.value = data.expiresIn.refreshToken ? Date.now() + data.expiresIn.refreshToken : null
		}
		
		TokenManager.storeLoginResponse({
			...data,
			expiresIn: data.expiresIn
		})
	}

	function setTokens(data: RefreshTokenResponse) {
		token.value = data.token
		if (data.refreshToken) {
			refreshToken.value = data.refreshToken
		}
		
		if (data.expiresIn) {
			tokenExpiry.value = data.expiresIn.token ? Date.now() + data.expiresIn.token : null
			if (data.expiresIn.refreshToken) {
				refreshTokenExpiry.value = Date.now() + data.expiresIn.refreshToken
			}
		}
		
		TokenManager.storeRefreshResponse({
			...data,
			expiresIn: data.expiresIn
		})
	}

	function setUserData(userData: User) {
		user.value = userData
		if (userData?.role) {
			roles.value = [userData.role]
		}
		TokenManager.setUser(userData)
	}

	function clearAuthData() {
		user.value = null
		token.value = null
		refreshToken.value = null
		roles.value = []
		permissions.value = []
		tokenExpiry.value = null
		refreshTokenExpiry.value = null
		TokenManager.clearAuth()
	}

	function hasRole(roleName: string): boolean {
		if (!roles.value || roles.value.length === 0) {
			return true
		}
		return roles.value.includes(roleName)
	}

	function hasPermission(permissionName: string): boolean {
		if (!permissions.value || permissions.value.length === 0) {
			return true
		}
		return permissions.value.includes(permissionName)
	}
	
	async function refreshAuthToken(): Promise<boolean> {
		try {
			if (!refreshToken.value || TokenManager.isRefreshTokenExpired()) {
				clearAuthData()
				return false
			}
			
			const response = await AuthService.refreshToken()
			setTokens(response)
			return true
		} catch {
			clearAuthData()
			return false
		}
	}
	
	function isTokenExpired(): boolean {
		return TokenManager.isTokenExpired()
	}

	return {
		user,
		token,
		refreshToken,
		isAuthenticated,
		roles,
		permissions,
		tokenExpiry,
		refreshTokenExpiry,
		setAuthData,
		setTokens,
		setUserData,
		clearAuthData,
		hasRole,
		hasPermission,
		refreshAuthToken,
		isTokenExpired
	}
})