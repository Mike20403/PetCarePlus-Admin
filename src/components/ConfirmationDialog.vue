<template>
  <AppModal :isOpen="isOpen" :title="title" @close="cancel">
    <p>{{ message }}</p>
    <template #footer>
      <button type="button" class="btn btn-link link-secondary" @click="cancel">No</button>
      <button type="button" class="btn btn-primary ms-auto" @click="confirm">Yes</button>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from './AppModal.vue';
import { ref } from 'vue';

const props = defineProps<{
  isOpen?: boolean;
}>();

const isOpen = ref(props.isOpen || false)
const message = ref('Are you sure you want to perform this action?')
const title = ref('Confirm Action')
const callback = ref<() => void>()

const open = (m: string, t: string, cb: () => void) => {
  message.value = m || 'Are you sure you want to perform this action?'
  title.value = t || 'Confirm Action'
  isOpen.value = true
  callback.value = cb
}

const close = () => {
  isOpen.value = false
}

const confirm = () => {
  callback.value?.()
  close()
};

const cancel = () => {
  close()
};

defineExpose({
  open,
  close
})
</script>
