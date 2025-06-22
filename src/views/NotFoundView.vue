<template>
	<div class="page page-center">
		<div class="container container-tight py-4">
			<div class="empty">
				<div class="empty-header">404</div>
				<p class="empty-title">Oops… You just found an error page</p>
				<p class="empty-subtitle text-secondary">
					We are sorry but the page you are looking for was not found
				</p>
				<div class="empty-action">
					<RouterLink to="/" class="btn btn-primary">
						<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24"
							stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
							stroke-linejoin="round">
							<path stroke="none" d="m0 0h24v24H0z" fill="none" />
							<path d="M5 12l14 0" />
							<path d="M5 12l6 6" />
							<path d="M5 12l6 -6" />
						</svg>
						Take me home
					</RouterLink>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.page-center {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
}

.empty {
	text-align: center;
	padding: 3rem 1rem;
}

.empty-header {
	font-size: 6rem;
	font-weight: 300;
	line-height: 1;
	color: var(--tblr-secondary);
	margin-bottom: 1rem;
}

.empty-title {
	font-size: 1.5rem;
	font-weight: 600;
	margin-bottom: 1rem;
}

.empty-subtitle {
	margin-bottom: 2rem;
}

.empty-action {
	margin-top: 2rem;
}
</style>