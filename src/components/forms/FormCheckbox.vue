<template>
	<div class="mb-3">
		<div class="form-check">
			<input class="form-check-input" type="checkbox" :id="name" :name="name" :checked="modelValue"
				@change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)" />
			<label class="form-check-label" :for="name">
				{{ label }}
			</label>
			<div v-if="error" class="invalid-feedback d-block">
				{{ error }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'FormCheckbox',
	props: {
		label: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		modelValue: {
			type: Boolean,
			default: false,
		},
		error: {
			type: String,
			default: '',
		},
	},
	emits: ['update:modelValue'],
})
</script>

<style scoped>
/* Add any specific styling for FormCheckbox here if needed */
</style>