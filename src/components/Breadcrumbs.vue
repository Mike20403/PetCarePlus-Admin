<template>
	<div class="page-header d-print-none">
		<div class="container-xl">
			<div class="row g-2 align-items-center">
				<div class="col">
					<!-- Page pre-title -->
					<div class="page-pretitle">Overview</div>
					<h2 class="page-title">{{ currentRouteName }}</h2>
				</div>
				<!-- Page title actions -->
				<div class="col-auto ms-auto d-print-none">
					<div class="btn-list">
						<a href="#" class="btn btn-primary d-none d-sm-inline-block" @click.prevent="goBack">
							<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
								viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
								stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1" />
							</svg>
							Go back
						</a>
						<a href="#" class="btn btn-primary d-sm-none btn-icon" @click.prevent="goBack"
							aria-label="Go back">
							<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
								viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
								stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M9 11l-4 4l4 4m-4 -4h11a4 4 0 0 0 0 -8h-1" />
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentRouteName = computed(() => {
	if (route.meta && route.meta.title) {
		return route.meta.title
	}
	return route.name ? String(route.name).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Dashboard'
})

const goBack = () => {
	router.back()
}
</script>

<style scoped></style>