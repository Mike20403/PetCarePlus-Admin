import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginResponse } from '@/types/api'
import { TokenManager } from '@/utils/auth'

export const useAuthStore = defineStore('auth', () => {
	const user = ref<LoginResponse['user'] | null>(TokenManager.getUser())
	const accessToken = ref<string | null>(TokenManager.getAccessToken())
	const refreshToken = ref<string | null>(TokenManager.getRefreshToken())
	const isAuthenticated = ref<boolean>(TokenManager.isAuthenticated())
	const roles = ref<string[]>(user.value?.roles || [])
	const permissions = ref<string[]>(user.value?.permissions || [])

	function setAuthData(data: LoginResponse) {
		user.value = data.user
		accessToken.value = data.accessToken
		refreshToken.value = data.refreshToken || null
		isAuthenticated.value = true
		roles.value = data.user?.roles || []
		permissions.value = data.user?.permissions || []
		TokenManager.storeLoginResponse(data)
	}

	function setTokens(data: { accessToken: string; refreshToken?: string }) {
		accessToken.value = data.accessToken
		if (data.refreshToken) {
			refreshToken.value = data.refreshToken
		}
		TokenManager.storeRefreshResponse(data)
	}

	function setUserData(userData: LoginResponse['user']) {
		user.value = userData
		roles.value = userData?.roles || []
		permissions.value = userData?.permissions || []
		TokenManager.setUser(userData)
	}

	function clearAuthData() {
		user.value = null
		accessToken.value = null
		refreshToken.value = null
		isAuthenticated.value = false
		roles.value = []
		permissions.value = []
		TokenManager.clearAuth()
	}

	function hasRole(roleName: string): boolean {
		return roles.value.includes(roleName)
	}

	function hasPermission(permissionName: string): boolean {
		return permissions.value.includes(permissionName)
	}

	return {
		user,
		accessToken,
		refreshToken,
		isAuthenticated,
		roles,
		permissions,
		setAuthData,
		setTokens,
		setUserData,
		clearAuthData,
		hasRole,
		hasPermission
	}
})