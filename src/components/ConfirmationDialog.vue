<template>
	<AppModal :is-open="isOpen" :title="title" @close="cancel">
		<p>{{ message }}</p>
		<template #footer>
			<button type="button" class="btn btn-link link-secondary" @click="cancel">{{ cancelText }}</button>
			<button type="button" class="btn btn-primary ms-auto" @click="confirm">{{ confirmText }}</button>
		</template>
	</AppModal>
</template>

<script setup lang="ts">
import AppModal from './AppModal.vue';

const { 
	isOpen = false, 
	title = 'Confirm Action', 
	message = 'Are you sure you want to perform this action?',
	confirmText = 'Confirm',
	cancelText = 'Cancel'
} = defineProps<{
	isOpen?: boolean;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
}>();

const emit = defineEmits<{
	(e: 'confirm'): void;
	(e: 'cancel'): void;
}>();

const confirm = () => {
	emit('confirm');
};

const cancel = () => {
	emit('cancel');
};
</script>