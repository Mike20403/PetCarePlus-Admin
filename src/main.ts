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

const authStore = useAuthStore()

router.isReady().then(() => {
	if (!authStore.isAuthenticated && router.currentRoute.value.meta.requiresAuth) {
		router.push('/login')
	}
})

app.mount('#app')
