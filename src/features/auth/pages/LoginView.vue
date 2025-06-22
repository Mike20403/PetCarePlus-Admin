<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/api/auth.service'
import { TokenManager } from '@/utils/auth'

const router = useRouter()

const form = reactive({ email: "", password: "" })
const errorMessage = ref<string | null>(null)
const loading = ref(false)

async function submit() {
	loading.value = true
	errorMessage.value = null
	try {
		const response = await AuthService.login(form)
		if (response.token) {
			TokenManager.setToken(response.token)
			if (response.refreshToken) {
				TokenManager.setRefreshToken(response.refreshToken)
			}
			if (response.user) {
				TokenManager.setUser(response.user)
			}
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
	<div class="page page-center">
		<div class="container container-tight py-4">
			<div class="text-center mb-4">
				<a href="." class="navbar-brand navbar-brand-autodark">
					<img src="../assets/logo.svg" height="36" alt="">
				</a>
			</div>
			<div class="card card-md">
				<div class="card-body">
					<h2 class="h2 text-center mb-4">Login to your account</h2>
					<form @submit.prevent="submit" autocomplete="off" novalidate>
						<div class="mb-3">
							<label class="form-label">Email address</label>
							<input v-model.trim="form.email" type="email" class="form-control"
								placeholder="your@email.com" autocomplete="off">
						</div>
						<div class="mb-2">
							<label class="form-label">
								Password
								<span class="form-label-description">
									<a href="./forgot-password.html">I forgot password</a>
								</span>
							</label>
							<div class="input-group input-group-flat">
								<input v-model.trim="form.password" type="password" class="form-control"
									placeholder="Your password" autocomplete="off">
								<span class="input-group-text">
									<a href="#" class="link-secondary" data-bs-toggle="tooltip"
										aria-label="Show password" data-bs-original-title="Show password">
										<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
											viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
											stroke-linecap="round" stroke-linejoin="round">
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
											<path
												d="M21 12c-2.7 3.5 -5.8 4 -9 4c-3.2 0 -6.3 -0.5 -9 -4c2.7 -3.5 5.8 -4 9 -4c3.2 0 6.3 0.5 9 4" />
										</svg>
									</a>
								</span>
							</div>
						</div>
						<div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
							{{ errorMessage }}
						</div>
						<div class="form-footer">
							<button type="submit" class="btn btn-primary w-100" :disabled="loading">
								<span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
									aria-hidden="true"></span>
								Sign in
							</button>
						</div>
					</form>
				</div>
			</div>
			<div class="text-center text-secondary mt-3">
				Don't have account yet? <a href="./sign-up.html" tabindex="-1">Sign up</a>
			</div>
		</div>
	</div>
</template>