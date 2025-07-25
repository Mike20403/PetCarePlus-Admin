<template>
  <AppModal :isOpen="isOpen" title="Edit User" @close="close">
    <div v-if="loading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <form v-else @submit.prevent="onSave">
      <!-- Personal Information -->
      <div class="row">
        <div class="col-md-6">
          <FormInput label="Name" name="name" v-model="form.name" />
        </div>
        <div class="col-md-6">
          <FormInput label="Last Name" name="lastName" v-model="form.lastName" />
        </div>
      </div>
      
      <!-- Contact and Role -->
      <div class="row">
        <div class="col-md-8">
          <FormInput label="Email" name="email" :modelValue="form.email" readonly type="email" />
        </div>
        <div class="col-md-4">
          <FormSelect label="Role" name="role" v-model="form.role" :options="roleOptions" />
        </div>
      </div>
      <div class="d-flex gap-2 mt-3">
        <button type="submit" class="btn btn-success">Save</button>
        <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { FormInput, FormSelect } from '../forms'
import type { User } from '@/types/user'
import { useUsers } from '@/hooks/useUsers'

import AppModal from '@/components/AppModal.vue'

const emit = defineEmits(['save'])
const { getUserById } = useUsers()

const loading = ref(false)
const isOpen = ref(false)

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
  { value: 'SERVICE_PROVIDER', text: 'Service Provider' },
  { value: 'USER', text: 'User' }
])

function open(id: string) {
  isOpen.value = true
  form.value = {
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
  }

  if (id) {
    loadUser(id)
  }
}

async function loadUser(id: string) {
  loading.value = true
  const user = await getUserById(id)
  if (user) {
    form.value = { ...user, phoneNumber: user.phoneNumber || '' }
  }
  loading.value = false
}

function close() {
  isOpen.value = false
}

function onSave() {
  emit('save', { ...form.value, phoneNumber: form.value.phoneNumber || '' })
  close()
}

defineExpose({
  open,
  close,
})
</script>
