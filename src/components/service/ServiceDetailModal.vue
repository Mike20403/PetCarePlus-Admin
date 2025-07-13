<template>
  <AppModal :isOpen="isOpen" title="Service Detail" @close="close">
    <div v-if="isLoading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div v-else>
      <FormInput disabled label="Name" name="name" :modelValue="service?.name" readonly />
      <FormInput disabled label="Description" name="description" :modelValue="service?.description" readonly />
      <FormInput disabled label="Icon URL" name="iconUrl" :modelValue="service?.iconUrl" readonly />
      <FormInput disabled label="Base Price" name="basePrice" :modelValue="service?.basePrice" readonly />
      <FormInput disabled label="Created At" name="createdAt" :modelValue="service?.createdAt" readonly />
      <FormInput disabled label="Updated At" name="updatedAt" :modelValue="service?.updatedAt" readonly />
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInput } from '@/components/forms'
import AppModal from '@/components/AppModal.vue'
import type { Service } from '@/types/service'
import { useServices } from '@/hooks/useServices'

const { getService } = useServices()

const isOpen = ref(false)
const isLoading = ref(false)
const service = ref<Service | null>(null)

async function loadService(id: string) {
  isLoading.value = true
  const found = await getService(id)
  if (found) service.value = { ...found }
  isLoading.value = false
}

function open(id: string) {
  isOpen.value = true
  loadService(id)
}

function close() {
  isOpen.value = false
}

defineExpose({
  open,
  close
})
</script> 