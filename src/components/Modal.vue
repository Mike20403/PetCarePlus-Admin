<template>
	<div v-if="isOpen" class="modal modal-blur fade show" tabindex="-1" style="display: block;" aria-modal="true"
		role="dialog">
		<div class="modal-dialog modal-dialog-centered" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">{{ title }}</h5>
					<button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<slot></slot>
				</div>
				<div v-if="$slots.footer" class="modal-footer">
					<slot name="footer"></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
	isOpen: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['close']);

const closeModal = () => {
	emit('close');
};
</script>

<style scoped>
/* Add any specific modal styling here if needed, though Tabler.io handles most of it */
.modal {
	background-color: rgba(0, 0, 0, 0.5);
}
</style>