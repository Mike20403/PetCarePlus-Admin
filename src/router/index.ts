import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/login',
			name: 'login',
			component: () => import('@/views/LoginView.vue'),
			meta: { public: true, title: 'Login' }
		},
		{
			path: '/',
			name: 'dashboard',
			component: () => import('@/views/DashboardView.vue'),
			meta: { requiresAuth: true, title: 'Dashboard', permissions: ['dashboard:view'] }
		},
		{
			path: '/pets',
			name: 'pets',
			component: () => import('@/views/PetsView.vue'),
			meta: { requiresAuth: true, title: 'Pets', permissions: ['pets:view'] }
		},
		{
			path: '/appointments',
			name: 'appointments',
			component: () => import('@/views/AppointmentsView.vue'),
			meta: { requiresAuth: true, title: 'Appointments', permissions: ['appointments:view'] }
		},
		{
			path: '/customers',
			name: 'customers',
			component: () => import('@/views/CustomersView.vue'),
			meta: { requiresAuth: true, title: 'Customers', permissions: ['customers:view'] }
		},
		{
			path: '/reports',
			name: 'reports',
			component: () => import('@/views/ReportsView.vue'),
			meta: { requiresAuth: true, title: 'Reports', permissions: ['reports:view'] }
		},
		{
			path: '/profile',
			name: 'profile',
			component: () => import('@/views/ProfileView.vue'),
			meta: { requiresAuth: true, title: 'Profile' }
		},
		{
			path: '/settings',
			name: 'settings',
			component: () => import('@/views/SettingsView.vue'),
			meta: { requiresAuth: true, title: 'Settings', roles: ['ADMIN'] }
		},
		{
			path: '/test-table',
			name: 'test-table',
			component: () => import('@/views/TestTableView.vue'),
			meta: { requiresAuth: true, title: 'Test Table', roles: ['ADMIN'] }
		},
		{
			path: '/users',
			name: 'users',
			component: () => import('@/views/UsersView.vue'),
			meta: { requiresAuth: true, title: 'Users', roles: ['ADMIN'] }
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'not-found',
			component: () => import('@/views/NotFoundView.vue'),
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
