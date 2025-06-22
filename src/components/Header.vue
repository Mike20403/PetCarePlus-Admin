<template>
	<header class="navbar navbar-expand-md d-print-none" data-bs-theme="dark">
		<div class="container-xl">
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu"
				aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
				<RouterLink to="/">
					PetCare+ Admin
				</RouterLink>
			</h1>
			<div class="navbar-nav flex-row order-md-last">
				<div class="nav-item dropdown">
					<a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown"
						aria-label="Open user menu">
						<span class="avatar avatar-sm">
							<!-- User avatar placeholder -->
							<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
								viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
								stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="m0 0h24v24H0z" fill="none" />
								<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
								<path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
							</svg>
						</span>
						<div class="d-none d-xl-block ps-2">
							<div>Admin User</div>
							<div class="mt-1 small text-secondary">Administrator</div>
						</div>
					</a>
					<div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
						<RouterLink to="/profile" class="dropdown-item">Profile</RouterLink>
						<RouterLink to="/settings" class="dropdown-item">Settings</RouterLink>
						<div class="dropdown-divider"></div>
						<a href="#" class="dropdown-item" @click.prevent="logout">Logout</a>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { AuthService } from '@/services/auth.service'
import { TokenManager } from '@/utils/auth'

const router = useRouter()

async function logout() {
	try {
		await AuthService.logout()
		TokenManager.clearAuth()
		router.push('/login')
	} catch (error) {
		console.error('Logout failed:', error)
	}
}
</script>

<style scoped>
.navbar-brand a {
	color: inherit;
	text-decoration: none;
}
</style>