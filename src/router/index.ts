import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/login',
			name: 'login',
			component: () => import('@/pages/auth/LoginView.vue'),
			meta: { public: true, title: 'Login' }
		},
		{
			path: '/',
			name: 'dashboard',
			component: () => import('@/pages/dashboard/DashboardView.vue'),
			meta: { requiresAuth: true, title: 'Dashboard', permissions: ['dashboard:view'] }
		},
		{
			path: '/profile',
			name: 'profile',
			component: () => import('@/pages/profile/ProfileView.vue'),
			meta: { requiresAuth: true, title: 'Profile' }
		},
		{
			path: '/settings',
			name: 'settings',
			component: () => import('@/pages/settings/SettingsView.vue'),
			meta: { requiresAuth: true, title: 'Settings', roles: ['ADMIN'] }
		},
		{
			path: '/users',
			name: 'users',
			component: () => import('@/pages/users/UsersView.vue'),
			meta: { requiresAuth: true, title: 'Users', roles: ['ADMIN'] }
		},
		{
			path: '/bookings',
			name: 'bookings',
			component: () => import('@/pages/bookings/BookingsView.vue'),
			meta: { requiresAuth: true, title: 'Bookings', roles: ['ADMIN'] }
		},
		{
			path: '/services',
			name: 'services',
			component: () => import('@/pages/services/ServicesView.vue'),
			meta: { requiresAuth: true, title: 'Services', roles: ['ADMIN'] }
		},
		{
			path: '/pets',
			name: 'pets',
			component: () => import('@/pages/pets/PetsView.vue'),
			meta: { requiresAuth: true, title: 'Pets', roles: ['ADMIN'] }
		},
		{
			path: '/terms',
			name: 'terms',
			component: () => import('@/pages/terms/TermsView.vue'),
			meta: { requiresAuth: true, title: 'Terms & Policies', roles: ['ADMIN'] }
		},
		{
			path: '/withdrawals',
			name: 'withdrawals',
			component: () => import('@/pages/withdrawals/WithdrawalsView.vue'),
			meta: { requiresAuth: true, title: 'Withdrawals', roles: ['ADMIN'] }
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'not-found',
			component: () => import('@/pages/NotFoundView.vue'),
			meta: { title: 'Not Found' }
		},
	] as RouteRecordRaw[],
})

router.beforeEach(async (to, from, next) => {
	const authStore = useAuthStore()
	const isAuthenticated = authStore.isAuthenticated
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
	const isPublic = to.matched.some(record => record.meta.public)
	const requiredRoles = to.meta.roles as string[] | undefined
	const requiredPermissions = to.meta.permissions as string[] | undefined

	// Prevent infinite redirects by checking if we're already going to the target
	if (from.path === to.path) {
		next()
		return
	}

	// Check if user is authenticated for protected routes
	if (requiresAuth && !isAuthenticated) {
		// Only redirect to login if not already going there
		if (to.name !== 'login') {
			next({ name: 'login' })
		} else {
			next()
		}
		return
	}

	// Redirect authenticated users away from login page
	if (isAuthenticated && isPublic && to.name === 'login') {
		next({ name: 'dashboard' })
		return
	}

	// For authenticated users, check roles and permissions
	if (isAuthenticated && requiresAuth) {
		let hasAccess = true

		// Check required roles
		if (requiredRoles && requiredRoles.length > 0) {
			hasAccess = requiredRoles.some(role => authStore.hasRole(role))
		}

		// Check required permissions (if roles check passed)
		if (hasAccess && requiredPermissions && requiredPermissions.length > 0) {
			hasAccess = requiredPermissions.some(permission => authStore.hasPermission(permission))
		}

		if (!hasAccess) {
			// Only redirect to dashboard if not already there
			if (to.name !== 'dashboard') {
				next({ name: 'dashboard' })
			} else {
				// If already on dashboard but no permissions, still allow access
				next()
			}
			return
		}
	}

	next()
})

export default router
