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
      <!-- Basic Information -->
      <div class="row mb-3">
        <div class="col-12">
          <h6 class="mb-3 text-muted">Basic Information</h6>
        </div>
        <div class="col-md-6">
          <FormInput disabled label="Name" name="name" :modelValue="service?.name" readonly />
        </div>
        <div class="col-md-6">
          <FormInput disabled label="Base Price" name="basePrice" :modelValue="service?.basePrice" readonly />
        </div>
      </div>

      <!-- Description -->
      <div class="row mb-3">
        <div class="col-12">
          <FormTextarea disabled label="Description" name="description" :modelValue="service?.description" readonly :rows="4" />
        </div>
      </div>

      <!-- Icon Information -->
      <div class="row mb-3">
        <div class="col-12">
          <h6 class="mb-3 text-muted">Icon Information</h6>
        </div>
        <div class="col-12">
          <FormInput disabled label="Icon URL" name="iconUrl" :modelValue="service?.iconUrl" readonly />
        </div>
        <div class="col-12 mt-2" v-if="service?.iconUrl">
          <div class="d-flex align-items-center gap-2">
            <span class="text-muted">Preview:</span>
            <img :src="service.iconUrl" alt="Service Icon" class="service-icon-preview" />
          </div>
        </div>
      </div>

      <!-- System Information -->
      <div class="row">
        <div class="col-12">
          <h6 class="mb-3 text-muted">System Information</h6>
        </div>
        <div class="col-md-6">
          <FormInput disabled label="Created At" name="createdAt" :modelValue="service?.createdAt" readonly />
        </div>
        <div class="col-md-6">
          <FormInput disabled label="Updated At" name="updatedAt" :modelValue="service?.updatedAt" readonly />
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInput, FormTextarea } from '@/components/forms'
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

<style scoped>
.service-icon-preview {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border: 1px solid var(--tblr-border-color);
  border-radius: 4px;
  padding: 4px;
}

h6.text-muted {
  font-weight: 600;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--tblr-border-color-light);
  padding-bottom: 0.5rem;
}
</style> 