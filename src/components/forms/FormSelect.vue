<template>
	<div class="mb-3">
		<label :for="uniqueId" class="form-label">{{ label }}</label>
		<select :name="name" :id="uniqueId" :value="modelValue" @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
			class="form-select" :class="{ 'is-invalid': error }">
			<option v-if="placeholder" value="" disabled selected>{{ placeholder }}</option>
			<option v-for="option in options" :key="option.value" :value="option.value">
				{{ option.text }}
			</option>
		</select>
		<div v-if="error" class="invalid-feedback">
			{{ error }}
		</div>
	</div>
</template>

<script setup lang="ts">
interface SelectOption {
	value: string | number;
	text: string;
}

const props = defineProps({
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
	options: {
		type: Array as () => SelectOption[],
		required: true,
	},
	error: {
		type: String,
		default: '',
	},
});

defineEmits(['update:modelValue']);

// Generate unique ID for this instance
let selectIdCounter = 0
const uniqueId = `${props.name}-${++selectIdCounter}`
</script>

<style scoped>
/* Add any specific styling for FormSelect here if needed */
</style>