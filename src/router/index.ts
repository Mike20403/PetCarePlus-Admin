import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/login',
			name: 'login',
			component: () => import('@/features/auth/pages/LoginView.vue'),
			meta: { public: true, title: 'Login' }
		},
		{
			path: '/',
			name: 'dashboard',
			component: () => import('@/features/dashboard/pages/DashboardView.vue'),
			meta: { requiresAuth: false, title: 'Dashboard', permissions: ['dashboard:view'] }
		},
		{
			path: '/pets',
			name: 'pets',
			component: () => import('@/features/pets/pages/PetsView.vue'),
			meta: { requiresAuth: false, title: 'Pets', permissions: ['pets:view'] }
		},
		{
			path: '/appointments',
			name: 'appointments',
			component: () => import('@/features/appointments/pages/AppointmentsView.vue'),
			meta: { requiresAuth: false, title: 'Appointments', permissions: ['appointments:view'] }
		},
		{
			path: '/customers',
			name: 'customers',
			component: () => import('@/features/customers/pages/CustomersView.vue'),
			meta: { requiresAuth: false, title: 'Customers', permissions: ['customers:view'] }
		},
		{
			path: '/reports',
			name: 'reports',
			component: () => import('@/features/reports/pages/ReportsView.vue'),
			meta: { requiresAuth: false, title: 'Reports', permissions: ['reports:view'] }
		},
		{
			path: '/profile',
			name: 'profile',
			component: () => import('@/features/profile/pages/ProfileView.vue'),
			meta: { requiresAuth: false, title: 'Profile' }
		},
		{
			path: '/settings',
			name: 'settings',
			component: () => import('@/features/settings/pages/SettingsView.vue'),
			meta: { requiresAuth: false, title: 'Settings', roles: ['ADMIN'] }
		},
		{
			path: '/test-table',
			name: 'test-table',
			component: () => import('@/features/test-table/pages/TestTableView.vue'),
			meta: { requiresAuth: false, title: 'Test Table', roles: ['ADMIN'] }
		},
		{
			path: '/users',
			name: 'users',
			component: () => import('@/features/users/pages/UsersView.vue'),
			meta: { requiresAuth: false, title: 'Users', roles: ['ADMIN'] }
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'not-found',
			component: () => import('@/features/error/pages/NotFoundView.vue'),
			meta: { title: 'Not Found' }
		},
	] as RouteRecordRaw[],
})

router.beforeEach((to, from, next) => {
	const authStore = useAuthStore()
	const isAuthenticated = authStore.isAuthenticated
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
	const isPublic = to.matched.some(record => record.meta.public)
	const requiredRoles = to.meta.roles as string[] | undefined
	const requiredPermissions = to.meta.permissions as string[] | undefined

	if (requiresAuth && !isAuthenticated) {
		next({ name: 'login' })
	} else if (isAuthenticated && isPublic && to.name === 'login') {
		next({ name: 'dashboard' })
	} else if (isAuthenticated) {
		let hasRequiredRole = true
		if (requiredRoles && requiredRoles.length > 0) {
			hasRequiredRole = requiredRoles.some(role => authStore.hasRole(role))
		}

		let hasRequiredPermission = true
		if (requiredPermissions && requiredPermissions.length > 0) {
			hasRequiredPermission = requiredPermissions.some(permission =>
				authStore.hasPermission(permission)
			)
		}

		if (hasRequiredRole && hasRequiredPermission) {
			next()
		} else {
			next({ name: 'dashboard' })
		}
	} else {
		next()
	}
})

export default router
