<template>
  <AppModal :isOpen="isOpen" :title="modalTitle" @close="close" size="lg" :key="`term-edit-modal-${editingTerm?.id || 'new'}`">
    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <form v-else @submit.prevent="onSubmit" class="term-edit-form">
      <div class="row">
        <div class="col-md-6">
          <FormSelect
            label="Type"
            name="term-edit-type"
            v-model="form.type"
            :options="termTypeOptions"
            required
          />
        </div>
        <div class="col-md-6">
          <FormSelect
            label="Language"
            name="term-edit-language"
            v-model="form.language"
            :options="languageOptions"
            required
          />
        </div>
      </div>
      
      <FormInput
        label="Title"
        name="term-edit-title"
        v-model="form.title"
        placeholder="Enter document title"
        required
      />
      
      <FormTextarea
        label="Content"
        name="term-edit-content"
        v-model="form.content"
        placeholder="Enter document content"
        :rows="10"
        required
      />
      
      <div class="row">
        <div class="col-md-6">
          <FormInput
            label="Version"
            name="term-edit-version"
            v-model="form.version"
            placeholder="e.g., 1.0, 2.1"
          />
        </div>
        <div class="col-md-6">
          <FormCheckbox
            label="Active"
            name="term-edit-active"
            v-model="form.active"
          />
        </div>
      </div>
      
      <div class="form-actions d-flex gap-2 mt-3">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isEditing ? 'Update' : 'Create' }}
        </button>
        <button type="button" class="btn btn-secondary" @click="close" :disabled="loading">Cancel</button>
      </div>
    </form>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTerms } from '@/hooks/useTerms'
import { useToast } from '@/hooks/useToast'
import AppModal from '@/components/AppModal.vue'
import { FormInput, FormSelect, FormTextarea, FormCheckbox } from '@/components/forms'
import type { Term, TermsType, CreateTermsRequest, UpdateTermsRequest } from '@/types/term'

const emit = defineEmits(['success'])
const { createTerm, updateTerm } = useTerms()
const { toast } = useToast()

const loading = ref(false)
const isOpen = ref(false)
const editingTerm = ref<Term | null>(null)

const form = ref({
  type: 'USER_TERMS' as TermsType,
  language: 'vi',
  title: '',
  content: '',
  version: '1.0',
  active: true
})

const isEditing = computed(() => !!editingTerm.value)
const modalTitle = computed(() => isEditing.value ? 'Edit Term' : 'Create New Term')

const termTypeOptions = [
  { value: 'USER_TERMS', text: 'User Terms' },
  { value: 'PROVIDER_TERMS', text: 'Provider Terms' },
  { value: 'PRIVACY_POLICY', text: 'Privacy Policy' },
  { value: 'PAYMENT_TERMS', text: 'Payment Terms' }
]

const languageOptions = [
  { value: 'vi', text: 'Vietnamese' },
  { value: 'en', text: 'English' }
]

function open(termData?: Term) {
  isOpen.value = true
  if (termData) {
    // Edit mode
    editingTerm.value = { ...termData }
    form.value = {
      type: termData.type,
      language: termData.language,
      title: termData.title,
      content: termData.content,
      version: termData.version,
      active: termData.active
    }
  } else {
    // Create mode
    editingTerm.value = null
    form.value = {
      type: 'USER_TERMS' as TermsType,
      language: 'vi',
      title: '',
      content: '',
      version: '1.0',
      active: true
    }
  }
}

function close() {
  isOpen.value = false
  editingTerm.value = null
}

async function onSubmit() {
  loading.value = true
  try {
    if (isEditing.value && editingTerm.value) {
      const updateData: UpdateTermsRequest = {
        type: form.value.type,
        language: form.value.language,
        title: form.value.title,
        content: form.value.content,
        version: form.value.version,
        active: form.value.active
      }
      await updateTerm(editingTerm.value.id, updateData)
      toast({ type: 'success', message: 'Term updated successfully' })
    } else {
      const createData: CreateTermsRequest = {
        type: form.value.type,
        language: form.value.language,
        title: form.value.title,
        content: form.value.content
      }
      await createTerm(createData)
      toast({ type: 'success', message: 'Term created successfully' })
    }
    
    emit('success')
    close()
  } catch (error) {
    console.error('Error saving term:', error)
    toast({ 
      type: 'error', 
      message: (error as Error).message || `Failed to ${isEditing.value ? 'update' : 'create'} term` 
    })
  } finally {
    loading.value = false
  }
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.term-edit-form {
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
</style> 