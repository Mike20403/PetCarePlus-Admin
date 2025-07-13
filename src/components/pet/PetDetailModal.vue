<template>
  <AppModal :isOpen="isOpen" title="Pet Detail" @close="close" key="pet-detail-modal">
    <div v-if="isLoading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div v-else class="pet-detail-form">
      <FormInput disabled label="Name" name="pet-detail-name" :modelValue="pet?.name" readonly />
      <FormInput disabled label="Age" name="pet-detail-age" :modelValue="pet?.age?.toString()" readonly />
      <FormInput disabled label="Species" name="pet-detail-species" :modelValue="pet?.species" readonly />
      <FormInput disabled label="Breed" name="pet-detail-breed" :modelValue="pet?.breed" readonly />
      <FormInput disabled label="Gender" name="pet-detail-gender" :modelValue="pet?.gender" readonly />
      <FormInput disabled label="Size" name="pet-detail-size" :modelValue="pet?.size" readonly />
      <FormInput disabled label="Day of Birth" name="pet-detail-dayOfBirth" :modelValue="pet?.dayOfBirth" readonly />
      <FormTextarea disabled label="Description" name="pet-detail-description" :modelValue="pet?.description" readonly />
      <FormInput disabled label="Image URL" name="pet-detail-imageUrl" :modelValue="pet?.imageUrl" readonly />
      <FormInput disabled label="Owner ID" name="pet-detail-userId" :modelValue="pet?.userId" readonly />
      <FormInput disabled label="Created At" name="pet-detail-createdAt" :modelValue="pet?.createdAt" readonly />
      <FormInput disabled label="Updated At" name="pet-detail-updatedAt" :modelValue="pet?.updatedAt" readonly />
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInput, FormTextarea } from '@/components/forms'
import AppModal from '@/components/AppModal.vue'
import type { Pet } from '@/types/pet'
import { usePets } from '@/hooks/usePets'

const { getPet } = usePets()

const isOpen = ref(false)
const isLoading = ref(false)
const pet = ref<Pet | null>(null)

async function loadPet(id: string) {
  isLoading.value = true
  try {
    const found = await getPet(id)
    if (found) pet.value = { ...found }
  } catch (error) {
    console.error('Failed to load pet:', error)
  } finally {
    isLoading.value = false
  }
}

function open(id: string) {
  isOpen.value = true
  loadPet(id)
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
.pet-detail-form {
  max-width: 100%;
}

.pet-detail-form .form-control[readonly] {
  background-color: var(--tblr-bg-surface-secondary);
  border-color: var(--tblr-border-color);
}

.pet-detail-form .form-control[disabled] {
  background-color: var(--tblr-bg-surface-secondary);
  border-color: var(--tblr-border-color);
  opacity: 1;
}
</style> 