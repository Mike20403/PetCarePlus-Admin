<template>
  <AppModal :isOpen="isOpen" :title="isCreate ? 'Create Service' : 'Edit Service'" @close="close">
    <div v-if="loading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <form v-else @submit.prevent="onSave">
      <!-- Basic Information -->
      <div class="row mb-3">
        <div class="col-12">
          <h6 class="mb-3 text-muted">Basic Information</h6>
        </div>
        <div class="col-md-6">
          <FormInput label="Name" name="name" v-model="form.name" />
        </div>
        <div class="col-md-6">
          <FormInput label="Base Price" name="basePrice" v-model="form.basePrice" type="number" />
        </div>
      </div>

      <!-- Description -->
      <div class="row mb-3">
        <div class="col-12">
          <FormTextarea label="Description" name="description" v-model="form.description" :rows="4" />
        </div>
      </div>

      <!-- Icon Information -->
      <div class="row mb-3">
        <div class="col-12">
          <h6 class="mb-3 text-muted">Icon Information</h6>
        </div>
        <div class="col-12">
          <FormInput label="Icon URL" name="iconUrl" v-model="form.iconUrl" />
        </div>
        <div class="col-12 mt-2" v-if="form.iconUrl">
          <div class="d-flex align-items-center gap-2">
            <span class="text-muted">Preview:</span>
            <img :src="form.iconUrl" alt="Service Icon" class="service-icon-preview" />
          </div>
        </div>
      </div>

      <div class="d-flex gap-2 mt-3">
        <button type="submit" class="btn btn-success">{{ isCreate ? 'Create' : 'Save' }}</button>
        <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormInput, FormTextarea } from '../forms'
import type { Service } from '@/types/service'
import { useServices } from '@/hooks/useServices'
import { useToast } from '@/hooks/useToast'
import AppModal from '@/components/AppModal.vue'

const emit = defineEmits(['save'])
const { getService, updateService, createService } = useServices()
const { toast } = useToast()

const loading = ref(false)
const isOpen = ref(false)
const isCreate = ref(false)

const form = ref<Service>({
  id: '',
  name: '',
  description: '',
  iconUrl: '',
  basePrice: 0,
  createdAt: '',
  updatedAt: '',
  deletedAt: null
})

function open(id: string | null) {
  isOpen.value = true
  isCreate.value = !id
  form.value = {
    id: '',
    name: '',
    description: '',
    iconUrl: '',
    basePrice: 0,
    createdAt: '',
    updatedAt: '',
    deletedAt: null
  }
  if (id) {
    loadService(id)
  }
}

async function loadService(id: string) {
  loading.value = true
  try {
    const found = await getService(id)
    if (found) form.value = { ...found }
  } catch (error: unknown) {
    toast({ type: 'error', message: (error as Error).message || 'Failed to load service' })
  } finally {
    loading.value = false
  }
}

function close() {
  isOpen.value = false
}

async function onSave() {
  loading.value = true
  try {
    if (isCreate.value) {
      await createService({
        name: form.value.name,
        description: form.value.description,
        iconUrl: form.value.iconUrl,
        basePrice: form.value.basePrice
      })
      toast({ type: 'success', message: 'Service created successfully' })
    } else {
      await updateService(form.value.id, form.value)
      toast({ type: 'success', message: 'Service updated successfully' })
    }
    emit('save')
    close()
  } catch (error: unknown) {
    toast({ type: 'error', message: (error as Error).message || 'Failed to save service' })
  } finally {
    loading.value = false
  }
}

defineExpose({
  open,
  close,
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