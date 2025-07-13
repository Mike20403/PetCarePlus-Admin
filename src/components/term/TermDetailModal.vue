<template>
  <AppModal :isOpen="isOpen" :title="modalTitle" @close="close" size="lg">
    <div v-if="term" class="term-detail">
      <div class="row mb-3">
        <div class="col-md-6">
          <strong>Type:</strong> {{ getTermTypeLabel(term.type) }}
        </div>
        <div class="col-md-6">
          <strong>Language:</strong> {{ term.language.toUpperCase() }}
        </div>
      </div>
      
      <div class="row mb-3">
        <div class="col-md-6">
          <strong>Version:</strong> {{ term.version }}
        </div>
        <div class="col-md-6">
          <strong>Status:</strong> 
          <span :class="term.active ? 'badge bg-success' : 'badge bg-secondary'">
            {{ term.active ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>
      
      <div class="mb-3">
        <strong>Title:</strong>
        <p class="mt-1">{{ term.title }}</p>
      </div>
      
      <div class="mb-3">
        <strong>Content:</strong>
        <div class="border rounded p-3 mt-1" style="max-height: 300px; overflow-y: auto;">
          <div v-html="term.content"></div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-6">
          <strong>Created:</strong> {{ formatDate(term.createdAt) }}
        </div>
        <div class="col-md-6">
          <strong>Updated:</strong> {{ formatDate(term.updatedAt) }}
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppModal from '@/components/AppModal.vue'
import type { Term, TermsType } from '@/types/term'

const isOpen = ref(false)
const term = ref<Term | null>(null)

const modalTitle = computed(() => {
  return term.value ? `${getTermTypeLabel(term.value.type)} - ${term.value.language.toUpperCase()}` : 'Term Details'
})

function open(termData: Term) {
  isOpen.value = true
  term.value = { ...termData }
}

function close() {
  isOpen.value = false
  term.value = null
}

function getTermTypeLabel(type: TermsType): string {
  const labels = {
    USER_TERMS: 'User Terms',
    PROVIDER_TERMS: 'Provider Terms',
    PRIVACY_POLICY: 'Privacy Policy',
    PAYMENT_TERMS: 'Payment Terms'
  }
  return labels[type] || type
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.term-detail {
  font-size: 14px;
}

.term-detail strong {
  color: var(--tblr-body-color);
  font-weight: 600;
}

.badge {
  font-size: 0.75rem;
}
</style> 