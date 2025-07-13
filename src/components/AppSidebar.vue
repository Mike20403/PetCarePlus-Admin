<template>
	<aside class="sidebar" :class="{ 'sidebar-collapsed': sidebarStore.isCollapsed }">
		<div class="sidebar-header">
			<div class="logo-container">
				<RouterLink to="/" class="logo">
					<!-- Logo placeholders - will use actual logo files when provided -->
					<div v-if="!sidebarStore.isCollapsed" class="logo-expanded">
						<img src="/logo.png" alt="PetCare+ Admin" class="logo-image">
						<div class="logo-text">
							<span class="logo-main">PetCare+</span>
							<span class="logo-sub">Admin</span>
						</div>
					</div>
					<div v-else class="logo-collapsed">
						<img src="/logo.png" alt="PC+" class="logo-image-sm">
						<!-- <span class="logo-icon">PC+</span> -->
					</div>
				</RouterLink>
			</div>
			<button class="collapse-btn" @click="sidebarStore.toggleSidebar" title="Toggle Sidebar">
				<IconChevronLeft v-if="sidebarStore.isCollapsed" />
				<IconChevronRight v-else />
			</button>
		</div>

		<div class="sidebar-content">
			<!-- Main Section -->
			<div class="nav-section">
				<div class="nav-section-title" v-if="!sidebarStore.isCollapsed">Overview</div>
				<ul class="nav-items">
					<li class="nav-item">
						<RouterLink to="/" class="nav-link" active-class="active">
							<span class="nav-link-icon">
								<IconHome />
							</span>
							<span class="nav-link-title" v-if="!sidebarStore.isCollapsed">Dashboard</span>
						</RouterLink>
					</li>
				</ul>
			</div>

			<!-- Management Section -->
			<div class="nav-section">
				<div class="nav-section-title" v-if="!sidebarStore.isCollapsed">Management</div>
				<ul class="nav-items">
					<li class="nav-item" v-if="authStore.hasRole('ADMIN')">
						<RouterLink to="/users" class="nav-link" active-class="active">
							<span class="nav-link-icon">
								<IconUsers />
							</span>
							<span class="nav-link-title" v-if="!sidebarStore.isCollapsed">Users</span>
						</RouterLink>
					</li>
					<li class="nav-item" v-if="authStore.hasRole('ADMIN')">
						<RouterLink to="/bookings" class="nav-link" active-class="active">
							<span class="nav-link-icon">
								<IconCalendar />
							</span>
							<span class="nav-link-title" v-if="!sidebarStore.isCollapsed">Bookings</span>
						</RouterLink>
					</li>
					<li class="nav-item" v-if="authStore.hasRole('ADMIN')">
						<RouterLink to="/services" class="nav-link" active-class="active">
							<span class="nav-link-icon">
								<IconActivity />
							</span>
							<span class="nav-link-title" v-if="!sidebarStore.isCollapsed">Services</span>
						</RouterLink>
					</li>
					<li class="nav-item" v-if="authStore.hasRole('ADMIN')">
						<RouterLink to="/pets" class="nav-link" active-class="active">
							<span class="nav-link-icon">
								<IconPaw />
							</span>
							<span class="nav-link-title" v-if="!sidebarStore.isCollapsed">Pets</span>
						</RouterLink>
					</li>
				</ul>
			</div>

			<!-- Finance Section -->
			<div class="nav-section">
				<div class="nav-section-title" v-if="!sidebarStore.isCollapsed">Finance</div>
				<ul class="nav-items">
					<li class="nav-item" v-if="authStore.hasRole('ADMIN')">
						<RouterLink to="/withdrawals" class="nav-link" active-class="active">
							<span class="nav-link-icon">
								<IconFile />
							</span>
							<span class="nav-link-title" v-if="!sidebarStore.isCollapsed">Withdrawals</span>
						</RouterLink>
					</li>
				</ul>
			</div>

			<!-- System Section -->
			<div class="nav-section">
				<div class="nav-section-title" v-if="!sidebarStore.isCollapsed">System</div>
				<ul class="nav-items">
					<li class="nav-item" v-if="authStore.hasRole('ADMIN')">
						<RouterLink to="/notifications" class="nav-link" active-class="active">
							<span class="nav-link-icon">
								<IconBell />
							</span>
							<span class="nav-link-title" v-if="!sidebarStore.isCollapsed">Notifications</span>
						</RouterLink>
					</li>
					<li class="nav-item" v-if="authStore.hasRole('ADMIN')">
						<RouterLink to="/terms" class="nav-link" active-class="active">
							<span class="nav-link-icon">
								<IconFile />
							</span>
							<span class="nav-link-title" v-if="!sidebarStore.isCollapsed">Terms & Policies</span>
						</RouterLink>
					</li>
					<li class="nav-item" v-if="authStore.hasRole('ADMIN')">
						<RouterLink to="/settings" class="nav-link" active-class="active">
							<span class="nav-link-icon">
								<IconSettings />
							</span>
							<span class="nav-link-title" v-if="!sidebarStore.isCollapsed">Settings</span>
						</RouterLink>
					</li>
				</ul>
			</div>
		</div>

		<!-- Sidebar Footer -->
		<div class="sidebar-footer" v-if="!sidebarStore.isCollapsed">
			<div class="nav-item">
				<a href="#" class="nav-link" @click.prevent="logout">
					<span class="nav-link-icon">
						<IconLogout />
					</span>
					<span class="nav-link-title">Logout</span>
				</a>
			</div>
		</div>
	</aside>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSidebarStore } from '@/stores/sidebar'
import { onMounted } from 'vue'
import { AuthService } from '@/api/auth.service'
import { TokenManager } from '@/utils/auth'

import { 
	IconChevronLeft, 
	IconChevronRight, 
	IconHome, 
	IconUsers, 
	IconCalendar, 
	IconFile, 
	IconSettings, 
	IconLogout, 
	IconPaw,
	IconBell,
	IconActivity,
} from '@tabler/icons-vue'

const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const router = useRouter()

async function logout() {
	try {
		await AuthService.logout()
		TokenManager.clearAuth()
		authStore.clearAuthData()
		router.push('/login')
	} catch (error) {
		console.error('Logout failed:', error)
		// Force logout even if API call fails
		TokenManager.clearAuth()
		authStore.clearAuthData()
		router.push('/login')
	}
}

// Initialize sidebar state on mount
onMounted(() => {
	sidebarStore.initializeSidebarState()
})
</script>

<style scoped>
.sidebar {
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: 250px;
	background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
	color: white;
	transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	z-index: 1000;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	overflow-x: hidden;
	border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-collapsed {
	width: 70px;
}

.sidebar-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem;
	height: 60px;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	flex-shrink: 0;
}

.logo-container {
	overflow: hidden;
	flex: 1;
}

.logo {
	color: white;
	text-decoration: none;
	display: block;
}

.logo-expanded {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.logo-text {
	display: flex;
	flex-direction: column;
	line-height: 1.2;
}

.logo-main {
	font-size: 1.25rem;
	font-weight: 700;
	color: #60a5fa;
}

.logo-sub {
	font-size: 0.75rem;
	font-weight: 500;
	color: rgba(255, 255, 255, 0.7);
	margin-top: -2px;
}

.logo-collapsed {
	display: flex;
	align-items: center;
	justify-content: center;
}

.logo-icon {
	font-size: 1rem;
	font-weight: 700;
	color: #60a5fa;
}

.logo-image {
	height: 32px;
	width: auto;
}

.logo-image-sm {
	height: 24px;
	width: auto;
}

.collapse-btn {
	background: none;
	border: none;
	color: rgba(255, 255, 255, 0.7);
	cursor: pointer;
	padding: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.375rem;
	transition: all 0.2s ease;
	flex-shrink: 0;
}

.collapse-btn:hover {
	background-color: rgba(255, 255, 255, 0.1);
	color: white;
}

.sidebar-content {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	padding: 1rem 0;
	flex: 1;
	overflow-y: auto;
}

.sidebar-footer {
	padding: 1rem 0;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
	flex-shrink: 0;
}

.nav-section {
	display: flex;
	flex-direction: column;
}

.nav-section-title {
	font-size: 0.6875rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: rgba(255, 255, 255, 0.5);
	padding: 0 1rem 0.5rem 1rem;
	transition: opacity 0.3s ease;
}

.sidebar-collapsed .nav-section-title {
	opacity: 0;
	pointer-events: none;
}

.nav-items {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
}

.nav-item {
	/* No margin needed */
}

.nav-link {
	display: flex;
	align-items: center;
	padding: 0.75rem 1rem;
	color: rgba(255, 255, 255, 0.8);
	text-decoration: none;
	transition: all 0.2s ease;
	border-radius: 0.5rem;
	margin: 0 0.75rem;
	position: relative;
	font-size: 0.875rem;
	font-weight: 500;
}

.sidebar-collapsed .nav-link {
	padding: 0.75rem;
	justify-content: center;
	margin: 0 0.5rem;
}

.nav-link:hover {
	background-color: rgba(255, 255, 255, 0.1);
	color: white;
	transform: translateX(2px);
}

.nav-link.active {
	background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
	color: white;
	box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.nav-link.active::before {
	content: '';
	position: absolute;
	left: -0.75rem;
	top: 50%;
	transform: translateY(-50%);
	width: 3px;
	height: 20px;
	background: #60a5fa;
	border-radius: 0 2px 2px 0;
}

.nav-link-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 0.75rem;
	flex-shrink: 0;
	transition: margin-right 0.3s ease;
}

.sidebar-collapsed .nav-link-icon {
	margin-right: 0;
}

.nav-link-title {
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	transition: opacity 0.3s ease;
}

.nav-link-badge {
	font-size: 0.6875rem;
	font-weight: 600;
	padding: 0.125rem 0.375rem;
	border-radius: 0.25rem;
	transition: opacity 0.3s ease;
}

.sidebar-collapsed .nav-link-title,
.sidebar-collapsed .nav-link-badge {
	opacity: 0;
	width: 0;
	overflow: hidden;
}

/* Custom scrollbar */
.sidebar::-webkit-scrollbar {
	width: 4px;
}

.sidebar::-webkit-scrollbar-track {
	background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.2);
	border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
	background: rgba(255, 255, 255, 0.3);
}

/* Icon size consistency */
.icon {
	width: 20px;
	height: 20px;
	stroke-width: 1.5;
}

/* Badge colors */
.badge.bg-blue {
	background-color: #3b82f6 !important;
}

.badge.bg-yellow {
	background-color: #f59e0b !important;
}

.badge.bg-green {
	background-color: #10b981 !important;
}

.badge.bg-red {
	background-color: #ef4444 !important;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
	.sidebar {
		transform: translateX(-100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
	
	.sidebar.mobile-open {
		transform: translateX(0);
	}
}

/* Tooltip for collapsed state */
.sidebar-collapsed .nav-link {
	position: relative;
}

.sidebar-collapsed .nav-link:hover::after {
	content: attr(title);
	position: absolute;
	left: 100%;
	top: 50%;
	transform: translateY(-50%);
	background: #1f2937;
	color: white;
	padding: 0.5rem 0.75rem;
	border-radius: 0.375rem;
	font-size: 0.875rem;
	white-space: nowrap;
	margin-left: 0.5rem;
	z-index: 1000;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	pointer-events: none;
}
</style>