import '@tabler/core/dist/css/tabler.min.css'
import '@tabler/core/dist/js/tabler.min.js'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth store after pinia is setup
const authStore = useAuthStore()

// Wait for router to be ready and then handle initial auth state
router.isReady().then(() => {
	const currentRoute = router.currentRoute.value
	const requiresAuth = currentRoute.matched.some(record => record.meta.requiresAuth)
	const isPublic = currentRoute.matched.some(record => record.meta.public)
	
	// If user is not authenticated and trying to access a protected route
	if (requiresAuth && !authStore.isAuthenticated) {
		router.push('/login')
	} 
	// If user is authenticated and on login page, redirect to dashboard
	else if (authStore.isAuthenticated && isPublic && currentRoute.name === 'login') {
		router.push('/')
	}
})
app.mount('#app')
