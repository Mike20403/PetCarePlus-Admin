<template>
  <AppModal :isOpen="isOpen" :title="isCreate ? 'Thêm thú cưng' : 'Chỉnh sửa thú cưng'" @close="close" :key="`pet-modal-${isCreate ? 'create' : 'edit'}`" size="lg">
    <div v-if="loading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <form v-else @submit.prevent="onSave" class="pet-edit-form">
      <!-- Image Preview Section -->
      <div v-if="form.imageUrl" class="image-preview-section mb-4">
        <div class="image-preview">
          <img :src="form.imageUrl" :alt="form.name" class="img-fluid rounded" />
        </div>
      </div>

      <!-- Basic Information -->
      <div class="form-section mb-4">
        <h6 class="section-title">Thông tin cơ bản</h6>
        <div class="row g-3">
          <div class="col-md-8">
            <FormInput label="Tên thú cưng" name="pet-name" v-model="form.name" required />
          </div>
          <div class="col-md-4">
            <FormInput label="Tuổi" name="pet-age" v-model="form.age" type="number" required min="0" max="50" />
          </div>
        </div>
        <div class="row g-3 mt-2">
          <div class="col-md-4">
            <FormSelect label="Loài" name="pet-species" v-model="form.species" :options="speciesOptions" required />
          </div>
          <div class="col-md-4">
            <FormInput label="Giống" name="pet-breed" v-model="form.breed" required />
          </div>
          <div class="col-md-4">
            <FormSelect label="Giới tính" name="pet-gender" v-model="form.gender" :options="genderOptions" required />
          </div>
        </div>
      </div>

      <!-- Physical Information -->
      <div class="form-section mb-4">
        <h6 class="section-title">Thông tin vật lý</h6>
        <div class="row g-3">
          <div class="col-md-6">
            <FormSelect label="Kích thước" name="pet-size" v-model="form.size" :options="sizeOptions" required />
          </div>
          <div class="col-md-6">
            <FormInput label="Ngày sinh" name="pet-dayOfBirth" v-model="form.dayOfBirth" type="date" required />
          </div>
        </div>
      </div>

      <!-- Additional Information -->
      <div class="form-section mb-4">
        <h6 class="section-title">Thông tin bổ sung</h6>
        <div class="row g-3">
          <div class="col-12">
            <FormTextarea label="Mô tả" name="pet-description" v-model="form.description" :rows="3" placeholder="Mô tả thêm về thú cưng..." />
          </div>
          <div class="col-12">
            <FormInput label="URL hình ảnh" name="pet-imageUrl" v-model="form.imageUrl" placeholder="https://example.com/image.jpg" />
          </div>
          <div v-if="isCreate" class="col-12">
            <FormInput label="ID chủ sở hữu" name="pet-ownerId" v-model="form.ownerId" required placeholder="Nhập ID của chủ sở hữu" />
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions d-flex gap-2 justify-content-end">
        <button type="button" class="btn btn-outline-secondary" @click="close" :disabled="loading">
          <i class="ti ti-x me-1"></i>
          Hủy
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <i v-else class="ti ti-check me-1"></i>
          {{ isCreate ? 'Tạo mới' : 'Lưu thay đổi' }}
        </button>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { FormInput, FormSelect, FormTextarea } from '@/components/forms'
import { usePets } from '@/hooks/usePets'
import { useToast } from '@/hooks/useToast'
import AppModal from '@/components/AppModal.vue'

const emit = defineEmits(['save'])
const { getPet, updatePet, createPet } = usePets()
const { toast } = useToast()

const loading = ref(false)
const isOpen = ref(false)
const isCreate = ref(false)

const form = ref({
  id: '',
  name: '',
  age: 0,
  species: 'DOG' as 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'HAMSTER' | 'FISH' | 'OTHER',
  breed: '',
  gender: '',
  size: '',
  dayOfBirth: '',
  description: '',
  imageUrl: '',
  ownerId: ''
})

const speciesOptions = computed(() => [
  { value: 'DOG', text: 'Chó' },
  { value: 'CAT', text: 'Mèo' },
  { value: 'BIRD', text: 'Chim' },
  { value: 'RABBIT', text: 'Thỏ' },
  { value: 'HAMSTER', text: 'Chuột hamster' },
  { value: 'FISH', text: 'Cá' },
  { value: 'OTHER', text: 'Khác' }
])

const genderOptions = computed(() => [
  { value: 'Male', text: 'Đực' },
  { value: 'Female', text: 'Cái' }
])

const sizeOptions = computed(() => [
  { value: 'Small', text: 'Nhỏ' },
  { value: 'Medium', text: 'Trung bình' },
  { value: 'Large', text: 'Lớn' },
  { value: 'Extra Large', text: 'Rất lớn' }
])

function open(id: string | null) {
  isOpen.value = true
  isCreate.value = !id
  
  // Reset form completely
  form.value = {
    id: '',
    name: '',
    age: 0,
    species: 'DOG',
    breed: '',
    gender: '',
    size: '',
    dayOfBirth: '',
    description: '',
    imageUrl: '',
    ownerId: ''
  }
  
  // Use nextTick to ensure form is reset before loading data
  if (id) {
    setTimeout(() => {
      loadPet(id)
    }, 50)
  }
}

async function loadPet(id: string) {
  loading.value = true
  try {
    const found = await getPet(id)
    if (found) {
      form.value = {
        id: found.id,
        name: found.name,
        age: found.age,
        species: found.species,
        breed: found.breed,
        gender: found.gender,
        size: found.size,
        dayOfBirth: found.dayOfBirth,
        description: found.description,
        imageUrl: found.imageUrl,
        ownerId: found.userId
      }
    }
  } catch (error: unknown) {
    toast({ type: 'error', message: (error as Error).message || 'Failed to load pet' })
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
      await createPet({
        ownerId: form.value.ownerId,
        name: form.value.name,
        age: form.value.age,
        dayOfBirth: form.value.dayOfBirth,
        species: form.value.species,
        breed: form.value.breed,
        gender: form.value.gender,
        size: form.value.size,
        imageUrl: form.value.imageUrl,
        description: form.value.description
      })
      toast({ type: 'success', message: 'Thú cưng đã được tạo thành công' })
    } else {
      await updatePet(form.value.id, {
        name: form.value.name,
        age: form.value.age,
        species: form.value.species,
        breed: form.value.breed,
        dayOfBirth: form.value.dayOfBirth,
        gender: form.value.gender,
        size: form.value.size,
        description: form.value.description,
        imageUrl: form.value.imageUrl
      })
      toast({ type: 'success', message: 'Thú cưng đã được cập nhật thành công' })
    }
    emit('save')
    close()
  } catch (error: unknown) {
    toast({ type: 'error', message: (error as Error).message || 'Không thể lưu thông tin thú cưng' })
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
.pet-edit-form {
  max-width: 100%;
}

.image-preview-section {
  text-align: center;
}

.image-preview {
  display: inline-block;
  width: 120px;
  height: 120px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid var(--tblr-border-color);
  background-color: var(--tblr-bg-surface-secondary);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-section {
  border: 1px solid var(--tblr-border-color);
  border-radius: 0.5rem;
  padding: 1.25rem;
  background-color: var(--tblr-bg-surface);
}

.section-title {
  color: var(--tblr-primary);
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--tblr-primary);
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 20px;
  background-color: var(--tblr-primary);
  margin-right: 0.5rem;
  border-radius: 2px;
}

.form-actions {
  border-top: 1px solid var(--tblr-border-color);
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.form-actions .btn {
  min-width: 120px;
  font-weight: 500;
}

.form-actions .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Form styling improvements */
.pet-edit-form .form-control:focus {
  border-color: var(--tblr-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--tblr-primary-rgb), 0.15);
}

.pet-edit-form .form-select:focus {
  border-color: var(--tblr-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--tblr-primary-rgb), 0.15);
}

.pet-edit-form .form-label {
  font-weight: 500;
  color: var(--tblr-body-color);
  margin-bottom: 0.5rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .image-preview {
    width: 100px;
    height: 100px;
  }
  
  .form-section {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions .btn {
    width: 100%;
  }
}

/* Input validation states */
.pet-edit-form .form-control:invalid {
  border-color: var(--tblr-danger);
}

.pet-edit-form .form-control:valid {
  border-color: var(--tblr-success);
}
</style> 