<template>
  <AppModal :isOpen="isOpen" title="User Detail" @close="onClose">
    <div>
      <FormInput disabled label="Name" name="name" :modelValue="user?.name" readonly />
      <FormInput disabled label="Last Name" name="lastName" :modelValue="user?.lastName" readonly />
      <FormInput disabled label="Email" name="email" :modelValue="user?.email" readonly type="email" />
      <FormInput disabled label="Phone Number" name="phoneNumber" :modelValue="user?.phoneNumber" readonly type="tel" />
      <FormInput disabled label="Role" name="role" :modelValue="user?.role" readonly />
      <FormInput disabled label="Created At" name="createdAt" :modelValue="user?.createdAt" readonly />
      <FormInput disabled label="Updated At" name="updatedAt" :modelValue="user?.updatedAt" readonly />
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { FormInput } from '../forms'
import type { User } from '@/types/user'
import AppModal from '@/components/AppModal.vue'

const props = defineProps<{
  isOpen: boolean
  user: User | null
  loading?: boolean
}>()
const emit = defineEmits(['close'])

function onClose() {
  emit('close')
}
</script>

<style scoped>
.btn[disabled] {
  pointer-events: none;
  opacity: 0.6;
}
</style>
