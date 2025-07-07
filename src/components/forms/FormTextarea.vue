<template>
	<div class="mb-3">
		<label :for="name" class="form-label">{{ label }}</label>
		<textarea :name="name" :id="name" :placeholder="placeholder" :value="modelValue"
			@input="updateValue($event)" class="form-control"
			:class="{ 'is-invalid': error }" :rows="rows"></textarea>
		<div v-if="error" class="invalid-feedback">
			{{ error }}
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'FormTextarea',
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
			type: String,
			default: '',
		},
		placeholder: {
			type: String,
			default: '',
		},
		rows: {
			type: Number,
			default: 3,
		},
		error: {
			type: String,
			default: '',
		},
	},
	emits: ['update:modelValue'],
	methods: {
		updateValue(event: Event) {
			const target = event.target as HTMLTextAreaElement;
			if (target) {
				this.$emit('update:modelValue', target.value);
			}
		}
	}
})
</script>

<style scoped>
/* Add any specific styling for FormTextarea here if needed */
</style>