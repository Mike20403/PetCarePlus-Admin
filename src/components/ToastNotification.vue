<template>
	<div class="toast-container position-fixed bottom-0 end-0 p-3">
		<div v-for="notification in notifications" :key="notification.id"
			:class="['toast', 'show', `bg-${notification.type}-lt`]" role="alert" aria-live="assertive"
			aria-atomic="true">
			<div class="toast-header">
				<strong class="me-auto">{{ capitalize(notification.type) }}</strong>
				<button type="button" class="btn-close" @click="notificationStore.removeNotification(notification.id)"
					aria-label="Close"></button>
			</div>
			<div class="toast-body">
				{{ notification.message }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification';
import { computed } from 'vue';

const notificationStore = useNotificationStore();
const notifications = computed(() => notificationStore.notifications);

const capitalize = (s: string) => {
	return s.charAt(0).toUpperCase() + s.slice(1);
};
</script>

<style scoped>
.toast-container {
	z-index: 1050;
	/* Ensure it's above other content */
}
</style>