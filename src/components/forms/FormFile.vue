<template>
	<div class="mb-3">
		<label :for="name" class="form-label">{{ label }}</label>
		<input class="form-control" :class="{ 'is-invalid': error }" type="file" :id="name" :name="name"
			@change="handleFileChange" :accept="accept" />
		<div v-if="error" class="invalid-feedback">
			{{ error }}
		</div>
		<div v-if="previewUrl" class="mt-2">
			<img :src="previewUrl" class="img-thumbnail" style="max-width: 200px; max-height: 200px;" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
	name: 'FormFile',
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
			type: [File, null],
			default: null,
		},
		accept: {
			type: String,
			default: '', // e.g., "image/*" for all image types
		},
		error: {
			type: String,
			default: '',
		},
	},
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		const previewUrl = ref<string | null>(null)

		const handleFileChange = (event: Event) => {
			const input = event.target as HTMLInputElement
			if (input.files && input.files[0]) {
				const file = input.files[0]
				emit('update:modelValue', file)

				// Create a preview URL for image files
				if (file.type.startsWith('image/')) {
					const reader = new FileReader()
					reader.onload = (e) => {
						previewUrl.value = e.target?.result as string
					}
					reader.readAsDataURL(file)
				} else {
					previewUrl.value = null
				}
			} else {
				emit('update:modelValue', null)
				previewUrl.value = null
			}
		}

		watch(
			() => props.modelValue,
			(newValue) => {
				if (!newValue) {
					previewUrl.value = null
				}
			},
		)

		return {
			previewUrl,
			handleFileChange,
		}
	},
})
</script>

<style scoped>
/* Add any specific styling for FormFile here if needed */
</style>