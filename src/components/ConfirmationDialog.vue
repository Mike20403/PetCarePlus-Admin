<template>
	<Modal :is-open="isOpen" :title="title" @close="cancel">
		<p>{{ message }}</p>
		<template #footer>
			<button type="button" class="btn btn-link link-secondary" @click="cancel">{{ cancelText }}</button>
			<button type="button" class="btn btn-primary ms-auto" @click="confirm">{{ confirmText }}</button>
		</template>
	</Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
	isOpen: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: 'Confirm Action',
	},
	message: {
		type: String,
		default: 'Are you sure you want to perform this action?',
	},
	confirmText: {
		type: String,
		default: 'Confirm',
	},
	cancelText: {
		type: String,
		default: 'Cancel',
	},
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
	emit('confirm');
};

const cancel = () => {
	emit('cancel');
};
</script>