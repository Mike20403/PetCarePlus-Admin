import { api } from './axios'
import type { Pet, PetRequest, PetPatchRequest, ListPetResponse } from '@/types/pet'

export interface PetCriteria {
  query?: string;
  species?: string;
  userId?: string;
}

export class PetsService {
  private static readonly BASE_URL = '/admin/pets'

  /**
   * Get all pets with pagination
   */
  static async getPets(
    criteria?: PetCriteria,
    page: number = 1,
    size: number = 10,
    sortBy: string = 'createdAt',
    sort: 'asc' | 'desc' = 'asc'
  ): Promise<ListPetResponse> {
    const params = { ...criteria, page, size, sortBy, sort }
    const response = await api.get<ListPetResponse>(this.BASE_URL, { params })
    return response.data
  }

  /**
   * Get a single pet by ID
   */
  static async getPet(id: string): Promise<Pet> {
    const response = await api.get<Pet>(`${this.BASE_URL}/${id}`)
    
    if (response.status === 200 && response.data) {
      return response.data
    }
    
    throw new Error(response.statusText || 'Failed to get pet')
  }

  /**
   * Create a new pet
   */
  static async createPet(petData: PetRequest): Promise<Pet> {
    const response = await api.post<Pet>(`${this.BASE_URL}/add`, petData)
    
    if ((response.status === 200 || response.status === 201) && response.data) {
      return response.data
    }
    
    console.error('Create pet failed:', response)
    throw new Error(response.statusText || 'Failed to create pet')
  }

  /**
   * Update an existing pet
   */
  static async updatePet(id: string, petData: PetPatchRequest): Promise<Pet> {
    const response = await api.patch<Pet>(`${this.BASE_URL}/${id}`, petData)
    
    if (response.status === 200 && response.data) {
      return response.data
    }
    
    throw new Error(response.statusText || 'Failed to update pet')
  }

  /**
   * Delete a pet
   */
  static async deletePet(id: string): Promise<void> {
    const response = await api.delete(`${this.BASE_URL}/${id}`)
    
    if (response.status !== 200 && response.status !== 204) {
      console.error('Delete pet failed:', response)
      throw new Error(response.statusText || 'Failed to delete pet')
    }
  }

  /**
   * Get pets by user ID
   */
  static async getPetsByUserId(
    userId: string,
    page: number = 1,
    size: number = 10,
    sortBy: string = 'createdAt',
    sort: 'asc' | 'desc' = 'asc'
  ): Promise<ListPetResponse> {
    const params = { page, size, sortBy, sort }
    const response = await api.get<ListPetResponse>(`${this.BASE_URL}/user/${userId}`, { params })
    return response.data
  }
} 