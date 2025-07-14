<template>
  <AppModal :isOpen="isOpen" title="Pet Detail" @close="close" key="pet-detail-modal" size="lg">
    <div v-if="isLoading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div v-else class="pet-detail-form">
      <!-- Pet Image Section -->
      <div v-if="pet?.imageUrl" class="pet-image-section mb-4">
        <div class="pet-avatar">
          <img :src="pet.imageUrl" :alt="pet.name" class="img-fluid rounded" />
        </div>
      </div>

      <!-- Basic Information -->
      <div class="info-section mb-4">
        <h6 class="section-title">Thông tin cơ bản</h6>
        <div class="row g-3">
          <div class="col-md-6">
            <FormInput disabled label="Tên thú cưng" name="pet-detail-name" :modelValue="pet?.name" readonly />
          </div>
          <div class="col-md-3">
            <FormInput disabled label="Tuổi" name="pet-detail-age" :modelValue="pet?.age?.toString()" readonly />
          </div>
          <div class="col-md-3">
            <FormInput disabled label="Giới tính" name="pet-detail-gender" :modelValue="pet?.gender" readonly />
          </div>
        </div>
      </div>

      <!-- Physical Characteristics -->
      <div class="info-section mb-4">
        <h6 class="section-title">Đặc điểm vật lý</h6>
        <div class="row g-3">
          <div class="col-md-4">
            <FormInput disabled label="Loài" name="pet-detail-species" :modelValue="pet?.species" readonly />
          </div>
          <div class="col-md-4">
            <FormInput disabled label="Giống" name="pet-detail-breed" :modelValue="pet?.breed" readonly />
          </div>
          <div class="col-md-4">
            <FormInput disabled label="Kích thước" name="pet-detail-size" :modelValue="pet?.size" readonly />
          </div>
        </div>
        <div class="row g-3 mt-2">
          <div class="col-md-6">
            <FormInput disabled label="Ngày sinh" name="pet-detail-dayOfBirth" :modelValue="formatDate(pet?.dayOfBirth)" readonly />
          </div>
          <div class="col-md-6">
            <FormInput disabled label="Chủ sở hữu" name="pet-detail-userId" :modelValue="pet?.userId" readonly />
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="info-section mb-4">
        <h6 class="section-title">Thông tin bổ sung</h6>
        <div class="row g-3">
          <div class="col-12">
            <FormTextarea disabled label="Mô tả" name="pet-detail-description" :modelValue="pet?.description" readonly :rows="3" />
          </div>
        </div>
      </div>

      <!-- System Information -->
      <div class="info-section">
        <h6 class="section-title">Thông tin hệ thống</h6>
        <div class="row g-3">
          <div class="col-md-6">
            <FormInput disabled label="Ngày tạo" name="pet-detail-createdAt" :modelValue="formatDate(pet?.createdAt)" readonly />
          </div>
          <div class="col-md-6">
            <FormInput disabled label="Cập nhật lần cuối" name="pet-detail-updatedAt" :modelValue="formatDate(pet?.updatedAt)" readonly />
          </div>
        </div>
      </div>
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

function formatDate(dateString?: string) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
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

.pet-image-section {
  text-align: center;
}

.pet-avatar {
  display: inline-block;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--tblr-border-color);
  background-color: var(--tblr-bg-surface-secondary);
}

.pet-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  border: 1px solid var(--tblr-border-color);
  border-radius: 0.375rem;
  padding: 1rem;
  background-color: var(--tblr-bg-surface);
}

.section-title {
  color: var(--tblr-primary);
  font-weight: 600;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--tblr-border-color-light);
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

@media (max-width: 768px) {
  .pet-avatar {
    width: 100px;
    height: 100px;
  }
  
  .info-section {
    padding: 0.75rem;
  }
}
</style> 