<template>
  <div class="mb-3">
    <label :for="uniqueId" class="form-label">{{ label }}</label>
    <input :type="type" :name="name" :id="uniqueId" :placeholder="placeholder" :value="modelValue" :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" class="form-control"
      :class="{ 'is-invalid': error }" />
    <div v-if="error" class="invalid-feedback">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

let idCounter = 0

export default defineComponent({
  name: 'FormInput',
  props: {
    label: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      validator: (value: string) => [
        'text', 'email', 'password', 'number', 'date', 'datetime-local', 
        'time', 'tel', 'url', 'search', 'color', 'range', 'file'
      ].includes(value),
    },
    error: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      uniqueId: `${this.name}-${++idCounter}`
    }
  }
})
</script>

<style scoped>
/* Add any specific styling for FormInput here if needed */
</style>
