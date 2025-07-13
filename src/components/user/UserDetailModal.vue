<template>
  <AppModal :isOpen="isOpen" title="User Detail" @close="close">
    <div v-if="isLoading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- Personal Information -->
      <div class="row">
        <div class="col-md-6">
          <FormInput disabled label="Name" name="name" :modelValue="user?.name" readonly />
        </div>
        <div class="col-md-6">
          <FormInput disabled label="Last Name" name="lastName" :modelValue="user?.lastName" readonly />
        </div>
      </div>
      
      <!-- Contact Information -->
      <div class="row">
        <div class="col-md-8">
          <FormInput disabled label="Email" name="email" :modelValue="user?.email" readonly type="email" />
        </div>
        <div class="col-md-4">
          <FormInput disabled label="Role" name="role" :modelValue="user?.role" readonly />
        </div>
      </div>
      
      <!-- System Information -->
      <div class="row">
        <div class="col-md-6">
          <FormInput disabled label="Created At" name="createdAt" :modelValue="user?.createdAt" readonly />
        </div>
        <div class="col-md-6">
          <FormInput disabled label="Updated At" name="updatedAt" :modelValue="user?.updatedAt" readonly />
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInput } from '../forms'
import AppModal from '@/components/AppModal.vue'
import type { User } from '@/types/user'
import { useUsers } from '@/hooks/useUsers'

const { getUserById } = useUsers()

const isOpen = ref(false)
const isLoading = ref(false)
const user = ref<User | null>(null)

async function loadUser(id: string) {
  isLoading.value = true
  const u = await getUserById(id)

  if (u) {
    user.value = { ...u, phoneNumber: u.phoneNumber || '' }
  }
  isLoading.value = false
}

function open(id: string) {
  isOpen.value = true
  loadUser(id)
}

function close() {
  isOpen.value = false
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.btn[disabled] {
  pointer-events: none;
  opacity: 0.6;
}
</style>
