import { PetsService, type PetCriteria } from '@/api/pets.service'
import type { Pet, PetRequest, PetPatchRequest } from '@/types/pet'
import { ref } from 'vue'

export function usePets() {
  const pets = ref<Pet[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const pages = ref(1)
  const currentPage = ref(1)
  const pageSize = ref(10)

  async function fetchPets(criteria?: PetCriteria, page = 1, size = 10, sortBy = 'createdAt', sort: 'asc' | 'desc' = 'asc') {
    loading.value = true
    error.value = null
    try {
      const res = await PetsService.getPets(criteria, page, size, sortBy, sort)
      pets.value = res.items
      total.value = res.total
      pages.value = res.pages
      pageSize.value = res.size
      return res
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch pets'
    } finally {
      loading.value = false
    }
  }

  async function createPet(data: PetRequest) {
    return PetsService.createPet(data)
  }

  async function updatePet(id: string, data: PetPatchRequest) {
    return PetsService.updatePet(id, data)
  }

  async function deletePet(id: string) {
    return PetsService.deletePet(id)
  }

  async function getPet(id: string) {
    return PetsService.getPet(id)
  }

  async function getPetsByUserId(userId: string, page = 1, size = 10, sortBy = 'createdAt', sort: 'asc' | 'desc' = 'asc') {
    return PetsService.getPetsByUserId(userId, page, size, sortBy, sort)
  }

  return {
    pets, loading, error, total, pages, currentPage, pageSize,
    fetchPets, createPet, updatePet, deletePet, getPet, getPetsByUserId
  }
} 