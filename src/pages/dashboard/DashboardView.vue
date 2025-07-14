<template>
	<DashboardLayout title="Dashboard" subtitle="">
		<div class="dashboard-video-full-wrapper">
			<video class="dashboard-full-video" src="/dog.webm" autoplay loop muted playsinline></video>
		</div>
	</DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
</script>

<style scoped>
.dashboard-video-full-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 70vh;
	width: 100%;
	background: #fff;
}
.dashboard-full-video {
	width: 500px;
	height: 500px;
	object-fit: contain;
	border-radius: 2rem;
}
</style>