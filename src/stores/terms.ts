import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TermsService, type Term } from '@/api'
import { useToast } from '@/composables/useToast'
import { TermsType } from '@/types'

export const useTermsStore = defineStore('terms', () => {
  const terms = ref<Term[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedTerm = ref<Term | null>(null)
  const { showToast } = useToast()

  const totalTerms = computed(() => terms.value.length)
  
  const activeTerms = computed(() => 
    terms.value.filter(term => term.isActive)
  )
  
  const inactiveTerms = computed(() => 
    terms.value.filter(term => !term.isActive)
  )
  
  const termsByType = computed(() => {
    const result: Record<Term['type'], Term[]> = {
      [TermsType.USER_TERMS]: [],
      [TermsType.PRIVACY_POLICY]: [],
      [TermsType.REFUND_POLICY]: [],
      [TermsType.OTHER]: []
    }
    
    terms.value.forEach(term => {
      result[term.type].push(term)
    })
    
    return result
  })

  async function fetchTerms() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await TermsService.getTerms()
      terms.value = response
    } catch (err) {
      error.value = 'Failed to fetch terms'
      showToast('Failed to fetch terms', 'error')
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTermById(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await TermsService.getTerm(id)
      selectedTerm.value = response
      return response
    } catch (err) {
      error.value = 'Failed to fetch term details'
      showToast('Failed to fetch term details', 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createTerm(termData: Omit<Term, 'id' | 'createdAt' | 'updatedAt'>) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await TermsService.createTerm(termData)
      terms.value.push(response)
      showToast('Term created successfully', 'success')
      return response
    } catch (err) {
      error.value = 'Failed to create term'
      showToast('Failed to create term', 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateTerm(id: string, termData: Partial<Term>) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await TermsService.updateTerm(id, termData)
      
      // Update the term in the local state
      const index = terms.value.findIndex(term => term.id === id)
      if (index !== -1) {
        terms.value[index] = response
      }
      
      showToast('Term updated successfully', 'success')
      return response
    } catch (err) {
      error.value = 'Failed to update term'
      showToast('Failed to update term', 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function toggleTermStatus(id: string, isActive: boolean) {
    return updateTerm(id, { isActive })
  }

  async function deleteTerm(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      await TermsService.deleteTerm(id)
      
      // Remove the term from the local state
      terms.value = terms.value.filter(term => term.id !== id)
      
      showToast('Term deleted successfully', 'success')
      return true
    } catch (err) {
      error.value = 'Failed to delete term'
      showToast('Failed to delete term', 'error')
      console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function getLatestTermByType(type: Term['type']) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await TermsService.getLatestTermByType(type)
      return response
    } catch (err) {
      error.value = `Failed to fetch latest ${type} term`
      showToast(`Failed to fetch latest ${type} term`, 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    terms,
    isLoading,
    error,
    selectedTerm,
    totalTerms,
    activeTerms,
    inactiveTerms,
    termsByType,
    fetchTerms,
    fetchTermById,
    createTerm,
    updateTerm,
    toggleTermStatus,
    deleteTerm,
    getLatestTermByType
  }
})