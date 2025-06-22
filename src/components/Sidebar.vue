<template>
	<header class="navbar-expand-md">
		<div class="collapse navbar-collapse" id="navbar-menu">
			<div class="navbar">
				<div class="container-xl">
					<ul class="navbar-nav">
						<li class="nav-item" v-if="authStore.hasPermission('dashboard:view')">
							<RouterLink to="/" class="nav-link" active-class="active">
								<span class="nav-link-icon d-md-none d-lg-inline-block">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="m0 0h24v24H0z" fill="none" />
										<path d="M5 12l-2 0l9 -9l9 9l-2 0" />
										<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
										<path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
									</svg>
								</span>
								<span class="nav-link-title">Dashboard</span>
							</RouterLink>
						</li>
						<li class="nav-item" v-if="authStore.hasPermission('pets:view')">
							<RouterLink to="/pets" class="nav-link" active-class="active">
								<span class="nav-link-icon d-md-none d-lg-inline-block">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="m0 0h24v24H0z" fill="none" />
										<path d="M11 5h2" />
										<path d="M19 12c-.667 5.333 -2.333 8 -5 8h0c-2.667 0 -4.333 -2.667 -5 -8" />
										<path d="M11 3c6 0 9 4 9 9c0 .8 -.15 1.4 -.3 2" />
										<path d="M10 11c0 .667 .333 1 1 1s1 -.333 1 -1h-2z" />
										<path d="M8 11c0 .667 .333 1 1 1s1 -.333 1 -1h-2z" />
									</svg>
								</span>
								<span class="nav-link-title">Pets</span>
							</RouterLink>
						</li>
						<li class="nav-item" v-if="authStore.hasPermission('appointments:view')">
							<RouterLink to="/appointments" class="nav-link" active-class="active">
								<span class="nav-link-icon d-md-none d-lg-inline-block">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="m0 0h24v24H0z" fill="none" />
										<path
											d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
										<path d="M16 3v4" />
										<path d="M8 3v4" />
										<path d="M4 11h16" />
										<path d="M7 14h.013" />
										<path d="M10.01 14h.005" />
										<path d="M13.01 14h.005" />
										<path d="M16.015 14h.005" />
										<path d="M13.015 17h.005" />
										<path d="M7.01 17h.005" />
										<path d="M10.01 17h.005" />
									</svg>
								</span>
								<span class="nav-link-title">Appointments</span>
							</RouterLink>
						</li>
						<li class="nav-item" v-if="authStore.hasPermission('customers:view')">
							<RouterLink to="/customers" class="nav-link" active-class="active">
								<span class="nav-link-icon d-md-none d-lg-inline-block">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="m0 0h24v24H0z" fill="none" />
										<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
										<path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
									</svg>
								</span>
								<span class="nav-link-title">Customers</span>
							</RouterLink>
						</li>
						<li class="nav-item" v-if="authStore.hasPermission('reports:view')">
							<RouterLink to="/reports" class="nav-link" active-class="active">
								<span class="nav-link-icon d-md-none d-lg-inline-block">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="m0 0h24v24H0z" fill="none" />
										<path
											d="M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
										<path
											d="M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
										<path
											d="M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
										<path d="M4 20l14 0" />
									</svg>
								</span>
								<span class="nav-link-title">Reports</span>
							</RouterLink>
						</li>
						<li class="nav-item" v-if="authStore.hasRole('ADMIN')">
							<RouterLink to="/users" class="nav-link" active-class="active">
								<span class="nav-link-icon d-md-none d-lg-inline-block">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="m0 0h24v24H0z" fill="none" />
										<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
										<path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
									</svg>
								</span>
								<span class="nav-link-title">Users</span>
							</RouterLink>
						</li>
						<li class="nav-item" v-if="authStore.hasRole('ADMIN')">
							<RouterLink to="/settings" class="nav-link" active-class="active">
								<span class="nav-link-icon d-md-none d-lg-inline-block">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="m0 0h24v24H0z" fill="none" />
										<path
											d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37a1.724 1.724 0 0 0 2.572 -1.065z" />
										<path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
									</svg>
								</span>
								<span class="nav-link-title">Settings</span>
							</RouterLink>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.nav-link.active {
	background-color: var(--tblr-primary);
	color: white !important;
	border-radius: 0.375rem;
}

.nav-link.active .nav-link-icon {
	color: white !important;
}
</style>