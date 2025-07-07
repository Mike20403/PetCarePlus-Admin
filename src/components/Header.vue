<template>
	<header class="app-header" :style="{ left: sidebarStore.sidebarWidth + 'px' }">
		<div class="header-content">
			<div class="header-title">
				<h1 class="page-title">{{ currentPageTitle }}</h1>
			</div>
			<div class="header-actions">
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
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { AuthService } from '@/api/auth.service'
import { TokenManager } from '@/utils/auth'
import { useSidebarStore } from '@/stores/sidebar'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()
const sidebarStore = useSidebarStore()

// Get the current page title from route meta
const currentPageTitle = computed(() => {
	return route.meta.title || 'Dashboard'
})

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
.app-header {
	position: fixed;
	top: 0;
	right: 0;
	height: 60px;
	background-color: white;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	z-index: 900;
	transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 100%;
	padding: 0 1.5rem;
}

.header-title {
	display: flex;
	align-items: center;
}

.page-title {
	font-size: 1.25rem;
	font-weight: 600;
	margin: 0;
	color: var(--tblr-dark);
}

.header-actions {
	display: flex;
	align-items: center;
}

.avatar {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	border-radius: 50%;
	background-color: var(--tblr-primary);
	color: white;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
	.app-header {
		left: 0 !important;
	}
	
	.header-content {
		padding: 0 1rem;
	}
}
</style>