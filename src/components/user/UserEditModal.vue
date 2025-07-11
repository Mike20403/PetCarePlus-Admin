<template>
  <AppModal :isOpen="isOpen" title="Edit User" @close="onClose">
    <form @submit.prevent="onSave">
      <FormInput label="Name" name="name" v-model="form.name" />
      <FormInput label="Last Name" name="lastName" v-model="form.lastName" />
      <FormInput label="Email" name="email" :modelValue="form.email" readonly type="email" />
      <FormInput label="Phone Number" name="phoneNumber" v-model="form.phoneNumber" type="tel" />
      <FormSelect label="Role" name="role" v-model="form.role" :options="roleOptions" />
      <FormInput label="Created At" name="createdAt" :modelValue="form.createdAt" readonly />
      <FormInput label="Updated At" name="updatedAt" :modelValue="form.updatedAt" readonly />
      <div class="d-flex gap-2 mt-3">
        <button type="submit" class="btn btn-success">Save</button>
        <button type="button" class="btn btn-secondary" @click="onClose">Cancel</button>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { FormInput, FormSelect } from '../forms'
import type { User } from '@/types/user'
import AppModal from '@/components/AppModal.vue'

const props = defineProps<{
  isOpen: boolean
  user: User | null
  loading?: boolean
}>()
const emit = defineEmits(['close', 'save'])

const form = ref<User>({
  id: '',
  email: '',
  name: '',
  lastName: '',
  phoneNumber: '',
  role: '',
  emailVerifiedAt: null,
  blockedAt: null,
  createdAt: '',
  updatedAt: '',
  deletedAt: null
})

const roleOptions = computed(() => [
  { value: 'ADMIN', text: 'Admin' },
  { value: 'MANAGER', text: 'Manager' },
  { value: 'USER', text: 'User' }
])

watch(() => props.user, (val) => {
  if (val) form.value = { ...val, phoneNumber: val.phoneNumber || '' }
})

function onClose() {
  emit('close')
}

function onSave() {
  emit('save', { ...form.value, phoneNumber: form.value.phoneNumber || '' })
}
</script>
