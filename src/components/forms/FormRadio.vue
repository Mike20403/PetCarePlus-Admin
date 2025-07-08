<template>
	<div class="mb-3">
		<label v-if="label" class="form-label">{{ label }}</label>
		<div v-for="option in options" :key="option.value" class="form-check">
			<input class="form-check-input" type="radio" :name="name" :id="`${name}-${option.value}`"
				:value="option.value" :checked="modelValue === option.value"
				@change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
			<label class="form-check-label" :for="`${name}-${option.value}`">
				{{ option.text }}
			</label>
		</div>
		<div v-if="error" class="invalid-feedback d-block">
			{{ error }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'

interface RadioOption {
	value: string | number
	text: string
}

export default defineComponent({
	name: 'FormRadio',
	props: {
		label: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			required: true,
		},
		modelValue: {
			type: [String, Number],
			default: '',
		},
		options: {
			type: Array as PropType<RadioOption[]>,
			required: true,
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
/* Add any specific styling for FormRadio here if needed */
</style>