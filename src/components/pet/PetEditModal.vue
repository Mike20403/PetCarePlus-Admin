<template>
  <AppModal :isOpen="isOpen" :title="isCreate ? 'Create Pet' : 'Edit Pet'" @close="close" :key="`pet-modal-${isCreate ? 'create' : 'edit'}`">
    <div v-if="loading">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <form v-else @submit.prevent="onSave" class="pet-edit-form">
      <FormInput label="Name" name="pet-name" v-model="form.name" required />
      <FormInput label="Age" name="pet-age" v-model="form.age" type="number" required />
      <FormSelect label="Species" name="pet-species" v-model="form.species" :options="speciesOptions" required />
      <FormInput label="Breed" name="pet-breed" v-model="form.breed" required />
      <FormInput label="Gender" name="pet-gender" v-model="form.gender" required />
      <FormInput label="Size" name="pet-size" v-model="form.size" required />
      <FormInput label="Day of Birth" name="pet-dayOfBirth" v-model="form.dayOfBirth" type="date" required />
      <FormTextarea label="Description" name="pet-description" v-model="form.description" />
      <FormInput label="Image URL" name="pet-imageUrl" v-model="form.imageUrl" />
      <FormInput v-if="isCreate" label="Owner ID" name="pet-ownerId" v-model="form.ownerId" required />
      <div class="form-actions d-flex gap-2 mt-3">
        <button type="submit" class="btn btn-success" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isCreate ? 'Create' : 'Save' }}
        </button>
        <button type="button" class="btn btn-secondary" @click="close" :disabled="loading">Cancel</button>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { FormInput, FormSelect, FormTextarea } from '@/components/forms'
import type { Pet } from '@/types/pet'
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
  { value: 'DOG', text: 'Dog' },
  { value: 'CAT', text: 'Cat' },
  { value: 'BIRD', text: 'Bird' },
  { value: 'RABBIT', text: 'Rabbit' },
  { value: 'HAMSTER', text: 'Hamster' },
  { value: 'FISH', text: 'Fish' },
  { value: 'OTHER', text: 'Other' }
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
  } catch (error) {
    toast({ type: 'error', message: 'Failed to load pet' })
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
      toast({ type: 'success', message: 'Pet created successfully' })
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
      toast({ type: 'success', message: 'Pet updated successfully' })
    }
    emit('save')
    close()
  } catch (error) {
    console.error('Error saving pet:', error)
    toast({ type: 'error', message: (error as Error).message || 'Failed to save pet' })
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

.form-actions {
  border-top: 1px solid var(--tblr-border-color);
  padding-top: 1rem;
  margin-top: 1.5rem;
}

.form-actions .btn {
  min-width: 80px;
}

.form-actions .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Ensure form inputs don't interfere with each other */
.pet-edit-form .form-control:focus {
  border-color: var(--tblr-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--tblr-primary-rgb), 0.25);
}

.pet-edit-form .form-select:focus {
  border-color: var(--tblr-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--tblr-primary-rgb), 0.25);
}
</style> 