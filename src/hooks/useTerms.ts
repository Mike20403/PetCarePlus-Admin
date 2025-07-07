import { ref } from 'vue'
import { TermsService } from '@/api/terms.service'
import type { Term, CreateTermsRequest, UpdateTermsRequest, TermsType } from '@/types/term'

export function useTerms() {
  const terms = ref<Term[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTerms(language = 'en') {
    loading.value = true
    error.value = null
    try {
      terms.value = await TermsService.getAllTerms(language)
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch terms'
    } finally {
      loading.value = false
    }
  }

  async function createTerm(data: CreateTermsRequest) {
    return TermsService.createTerm(data)
  }

  async function updateTerm(id: string, data: UpdateTermsRequest) {
    return TermsService.updateTerm(id, data)
  }

  async function getTermsByType(type: TermsType, language = 'en') {
    return TermsService.getTermsByType(type, language)
  }

  return {
    terms,
    loading,
    error,
    fetchTerms,
    createTerm,
    updateTerm,
    getTermsByType
  }
} 