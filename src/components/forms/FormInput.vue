<template>
	<div class="mb-3">
		<label :for="name" class="form-label">{{ label }}</label>
		<input :type="type" :name="name" :id="name" :placeholder="placeholder" :value="modelValue"
			@input="$emit('update:modelValue', $event.target.value)" class="form-control"
			:class="{ 'is-invalid': error }" />
		<div v-if="error" class="invalid-feedback">
			{{ error }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'FormInput',
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
			type: [String, Number],
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
		type: {
			type: String,
			default: 'text',
			validator: (value: string) => ['text', 'email', 'password'].includes(value),
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
/* Add any specific styling for FormInput here if needed */
</style>