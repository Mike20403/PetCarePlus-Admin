<template>
	<div class="mb-3">
		<label :for="name" class="form-label">{{ label }}</label>
		<select :name="name" :id="name" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)"
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
import { defineProps, defineEmits } from 'vue';

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

const emit = defineEmits(['update:modelValue']);
</script>

<style scoped>
/* Add any specific styling for FormSelect here if needed */
</style>