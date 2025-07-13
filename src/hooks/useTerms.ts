import { ref } from 'vue'
import { TermsService } from '@/api/terms.service'
import type { Term, CreateTermsRequest, UpdateTermsRequest, TermsType } from '@/types/term'

export function useTerms() {
  const terms = ref<Term[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTerms(language = 'vi') {
    loading.value = true
    error.value = null
    try {
      terms.value = await TermsService.getTerms(language)
      return terms.value
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch terms'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchAllTerms() {
    loading.value = true
    error.value = null
    try {
      terms.value = await TermsService.getTermsAllLanguages()
      return terms.value
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch all terms'
      throw e
    } finally {
      loading.value = false
    }
  }



  async function getTermsByType(type: TermsType, language = 'vi') {
    return TermsService.getTermsByType(type, language)
  }

  async function createTerm(data: CreateTermsRequest) {
    return TermsService.createTerm(data)
  }

  async function updateTerm(id: string, data: UpdateTermsRequest) {
    return TermsService.updateTerm(id, data)
  }



  return {
    terms,
    loading,
    error,
    fetchTerms,
    fetchAllTerms,
    getTermsByType,
    createTerm,
    updateTerm
  }
} 