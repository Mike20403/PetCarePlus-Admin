<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/api/auth.service'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ email: "", password: "" })
const errorMessage = ref<string | null>(null)
const loading = ref(false)
const showPassword = ref(false)

async function submit() {
	loading.value = true
	errorMessage.value = null
	try {
		const response = await AuthService.login(form)
		if (response.token) {
			authStore.setAuthData(response)
			router.push('/')
		} else {
			errorMessage.value = "Login failed: No token received."
		}
	} catch (error: any) {
		errorMessage.value = error.message || "An unexpected error occurred during login."
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<AuthLayout>
		<div class="container container-tight py-4">
			<div class="text-center mb-4">
				<a href="." class="navbar-brand navbar-brand-autodark">
					<img src="/logo.png" alt="PetCare+ Admin" class="logo-image">
				</a>
			</div>
			<div class="card card-md">
				<div class="card-body">
					<h2 class="h2 text-center mb-4">Login to your account</h2>
					<form @submit.prevent="submit" autocomplete="off" novalidate>
						<div class="mb-3">
							<label class="form-label">Email address</label>
							<input 
								v-model.trim="form.email" 
								type="email" 
								class="form-control"
								placeholder="your@email.com" 
								autocomplete="off"
								:disabled="loading"
							>
						</div>
						<div class="mb-2">
							<label class="form-label">
								Password
								<span class="form-label-description">
									<a href="#" tabindex="-1">I forgot password</a>
								</span>
							</label>
							<div class="input-group input-group-flat">
								<input 
									v-model.trim="form.password" 
									:type="showPassword ? 'text' : 'password'" 
									class="form-control"
									placeholder="Your password" 
									autocomplete="off"
									:disabled="loading"
								>
								<span class="input-group-text">
									<a 
										href="#" 
										class="link-secondary" 
										@click.prevent="showPassword = !showPassword"
										:title="showPassword ? 'Hide password' : 'Show password'"
									>
										<svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
											viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
											stroke-linecap="round" stroke-linejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
											<path d="M21 12c-2.7 3.5 -5.8 4 -9 4c-3.2 0 -6.3 -0.5 -9 -4c2.7 -3.5 5.8 -4 9 -4c3.2 0 6.3 0.5 9 4" />
										</svg>
										<svg v-else xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
											viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
											stroke-linecap="round" stroke-linejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
											<path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.2 0 -6.3 -0.5 -9 -4c1.837 -2.415 3.865 -3.63 5.927 -3.958" />
											<path d="M11.5 8.065a8.937 8.937 0 0 1 1.5 -.065c3.2 0 6.3 0.5 9 4c-.666 .875 -1.36 1.611 -2.064 2.199" />
											<path d="M3 3l18 18" />
										</svg>
									</a>
								</span>
							</div>
						</div>
						<div class="mb-2">
							<label class="form-check">
								<input type="checkbox" class="form-check-input" />
								<span class="form-check-label">Remember me on this device</span>
							</label>
						</div>
						<div v-if="errorMessage" class="alert alert-danger" role="alert">
							<div class="d-flex">
								<div>
									<svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none" />
										<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
										<path d="M12 8v4" />
										<path d="M12 16h.01" />
									</svg>
								</div>
								<div>
									{{ errorMessage }}
								</div>
							</div>
						</div>
						<div class="form-footer">
							<button type="submit" class="btn btn-primary w-100" :disabled="loading">
								<svg v-if="loading" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-loader-2" 
									width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
									fill="none" stroke-linecap="round" stroke-linejoin="round">
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<path d="M12 3a9 9 0 1 0 9 9" />
								</svg>
								{{ loading ? 'Signing in...' : 'Sign in' }}
							</button>
						</div>
					</form>
				</div>
			</div>
			<div class="text-center text-secondary mt-3">
				Don't have account yet? <a href="#" tabindex="-1">Sign up</a>
			</div>
		</div>
	</AuthLayout>
</template>

<style scoped>
@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.icon-tabler-loader-2 {
	animation: rotate 1s linear infinite;
}

.btn:disabled {
	opacity: 0.65;
	cursor: not-allowed;
}

.container-tight {
	max-width: 30rem;
	margin: 0 auto;
}

.navbar-brand h1 {
	font-size: 1.75rem;
	font-weight: 600;
	color: var(--tblr-primary);
}

.card {
	box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
	border: 1px solid var(--tblr-border-color);
}

.form-label-description {
	float: right;
	font-weight: 400;
	font-size: 0.875rem;
}

.form-label-description a {
	color: var(--tblr-secondary);
	text-decoration: none;
}

.form-label-description a:hover {
	color: var(--tblr-primary);
	text-decoration: underline;
}

.alert {
	margin-bottom: 1rem;
}

.alert-icon {
	margin-right: 0.5rem;
}
</style>