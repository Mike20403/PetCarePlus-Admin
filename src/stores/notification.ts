import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Notification {
	id: number;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	timeout?: number; // in milliseconds
}

export const useNotificationStore = defineStore('notification', () => {
	const notifications = ref<Notification[]>([]);
	let nextId = 0;

	const addNotification = (notification: Omit<Notification, 'id'>) => {
		const id = nextId++;
		notifications.value.push({ ...notification, id });
		if (notification.timeout) {
			setTimeout(() => removeNotification(id), notification.timeout);
		}
	};

	const removeNotification = (id: number) => {
		notifications.value = notifications.value.filter(n => n.id !== id);
	};

	return {
		notifications,
		addNotification,
		removeNotification,
	};
});