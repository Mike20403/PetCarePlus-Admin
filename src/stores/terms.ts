import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TermsService, type Term } from '@/api'
import { TermsType } from '@/types'
import { useToast } from '@/hooks/useToast'

export const useTermsStore = defineStore('terms', () => {
  const terms = ref<Term[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedTerm = ref<Term | null>(null)
  const { toast } = useToast()

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
      toast({
        type: 'error',
        message: 'Failed to fetch terms'
      })
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
      toast({
        type: 'error',
        message: 'Failed to fetch term details'
      })
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
      toast({
        type: 'success',
        message: 'Term created successfully'
      })
      return response
    } catch (err) {
      error.value = 'Failed to create term'
      toast({
        type: 'error',
        message: 'Failed to create term'
      })
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

      toast({
        type: 'success',
        message: 'Term updated successfully'
      })
      return response
    } catch (err) {
      error.value = 'Failed to update term'
      toast({
        type: 'error',
        message: 'Failed to update term'
      })
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

      toast({
        type: 'success',
        message: 'Term deleted successfully'
      })
      return true
    } catch (err) {
      error.value = 'Failed to delete term'
      toast({
        type: 'error',
        message: 'Failed to delete term'
      })
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
      toast({
        type: 'error',
        message: `Failed to fetch latest ${type} term`
      })
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
