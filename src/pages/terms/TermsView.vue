<template>
  <DashboardLayout title="Terms & Policies" subtitle="Manage legal documents and policies">
    <template #actions>
      <button @click="openCreateTermModal" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        New Document
      </button>
    </template>

        <DataTable
          :headers="termTableHeaders"
          :items="mappedTerms"
          :loading="fetchLoading"
          :hasActions="true"
          :hideSearch="false"
          title="Terms & Policies"
          @update:sort="() => {}"
        >
          <template #customFilters>
            <div class="d-flex gap-2">
              <select class="form-select w-auto" v-model="selectedType" @change="handleTypeFilter">
                <option value="">All Types</option>
                <option value="USER_TERMS">User Terms</option>
                <option value="PROVIDER_TERMS">Provider Terms</option>
                <option value="PRIVACY_POLICY">Privacy Policy</option>
                <option value="PAYMENT_TERMS">Payment Terms</option>
              </select>
              <select class="form-select w-auto" v-model="selectedLanguage" @change="handleLanguageFilter">
                <option value="">All Languages</option>
                <option value="vi">Vietnamese</option>
                <option value="en">English</option>
              </select>
            </div>
          </template>
      <template #rowActions="{ item }">
        <button class="btn btn-sm btn-outline-primary" @click.prevent="openTermDetail(item as unknown as Term)">
          View
        </button>
        <button class="btn btn-sm btn-primary" @click.prevent="openTermEdit(item as unknown as Term)">
          Edit
        </button>
              </template>
      </DataTable>

    <TermDetailModal ref="detailTermModal" />
    <TermEditModal ref="editTermModal" @success="handleEditSuccess" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DataTable, { type DataTableHeader } from '@/components/ui/DataTable.vue'
import { useTerms } from '@/hooks/useTerms'
import { useToast } from '@/hooks/useToast'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import type { Term, TermsType } from '@/types/term'
import { TermDetailModal, TermEditModal } from '@/components/term'

const { terms, fetchAllTerms, getTermsByType, loading } = useTerms()
const { toast } = useToast()
const selectedType = ref('')
const selectedLanguage = ref('')
const fetchLoading = loading

const termTableHeaders: DataTableHeader[] = [
  { key: 'title', title: 'Title', sortable: true },
  { key: 'typeLabel', title: 'Type', sortable: true },
  { key: 'languageLabel', title: 'Language', sortable: true },
  { key: 'version', title: 'Version', sortable: false },
  { key: 'statusLabel', title: 'Status', sortable: true, type: 'status' },
  { key: 'createdAt', title: 'Created', sortable: true, type: 'date' }
]

const mappedTerms = computed(() => {
  return terms.value.map(term => ({
    ...term,
    typeLabel: getTermTypeLabel(term.type),
    languageLabel: term.language.toUpperCase(),
    statusLabel: term.active ? 'Active' : 'Inactive',
    // Keep original data for modal usage
    originalTerm: term
  }))
})

async function fetchAndSetTerms() {
  try {
    await fetchAllTerms()
  } catch (error) {
    console.error('Error fetching terms:', error)
  }
}

onMounted(fetchAndSetTerms)

const detailTermModal = ref<InstanceType<typeof TermDetailModal> | null>(null)
const editTermModal = ref<InstanceType<typeof TermEditModal> | null>(null)

const openTermDetail = (termData: Term) => {
  // Close other modals first
  editTermModal.value?.close()
  
  detailTermModal.value?.open(termData)
}

const openTermEdit = (termData: Term) => {
  // Close other modals first
  detailTermModal.value?.close()
  
  editTermModal.value?.open(termData)
}

const openCreateTermModal = () => {
  // Close other modals first
  detailTermModal.value?.close()
  
  editTermModal.value?.open()
}

const handleEditSuccess = async () => {
  await fetchAndSetTerms()
}

const handleTypeFilter = async () => {
  if (selectedType.value && selectedLanguage.value) {
    try {
      const term = await getTermsByType(selectedType.value as TermsType, selectedLanguage.value)
      terms.value = [term]
    } catch (error) {
      console.error('Error fetching term by type:', error)
      toast({ type: 'error', message: 'Failed to fetch term by type' })
    }
  } else {
    await fetchAndSetTerms()
  }
}

const handleLanguageFilter = async () => {
  if (selectedType.value && selectedLanguage.value) {
    try {
      const term = await getTermsByType(selectedType.value as TermsType, selectedLanguage.value)
      terms.value = [term]
    } catch (error) {
      console.error('Error fetching term by type:', error)
      toast({ type: 'error', message: 'Failed to fetch term by type' })
    }
  } else {
    await fetchAndSetTerms()
  }
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
</script>

<style scoped>
.avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-size: cover;
	background-position: center;
}
</style>