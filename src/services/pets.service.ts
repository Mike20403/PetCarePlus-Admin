import { api } from '@/axios'
import type { Pet, PaginationParams, ListResponse, ApiResponse } from '@/types/api'

export class PetsService {
	private static readonly BASE_URL = '/pets'

	// Get all pets with pagination
	static async getPets(params: PaginationParams = {}): Promise<ListResponse<Pet>> {
		const response = await api.get<Pet[]>(this.BASE_URL, { params })
		return response.data as ListResponse<Pet>
	}

	// Get pet by ID
	static async getPet(id: number): Promise<Pet> {
		const response = await api.get<Pet>(`${this.BASE_URL}/${id}`)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to get pet')
	}

	// Create new pet
	static async createPet(petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> {
		const response = await api.post<Pet>(this.BASE_URL, petData)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to create pet')
	}

	// Update pet
	static async updatePet(id: number, petData: Partial<Pet>): Promise<Pet> {
		const response = await api.put<Pet>(`${this.BASE_URL}/${id}`, petData)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to update pet')
	}

	// Delete pet
	static async deletePet(id: number): Promise<void> {
		const response = await api.delete(`${this.BASE_URL}/${id}`)

		if (!response.data.success) {
			throw new Error(response.data.message || 'Failed to delete pet')
		}
	}

	// Get pets by owner ID
	static async getPetsByOwner(ownerId: number): Promise<Pet[]> {
		const response = await api.get<Pet[]>(`${this.BASE_URL}/owner/${ownerId}`)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to get pets by owner')
	}

	// Search pets
	static async searchPets(query: string, params: PaginationParams = {}): Promise<ListResponse<Pet>> {
		const response = await api.get<Pet[]>(`${this.BASE_URL}/search`, {
			params: { q: query, ...params }
		})
		return response.data as ListResponse<Pet>
	}

	// Get pet medical history
	static async getPetMedicalHistory(id: number): Promise<any[]> {
		const response = await api.get<any[]>(`${this.BASE_URL}/${id}/medical-history`)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to get medical history')
	}

	// Upload pet photo
	static async uploadPetPhoto(id: number, file: File): Promise<string> {
		const formData = new FormData()
		formData.append('photo', file)

		const response = await api.upload<{ photoUrl: string }>(`${this.BASE_URL}/${id}/photo`, formData)

		if (response.data.success && response.data.data) {
			return response.data.data.photoUrl
		}

		throw new Error(response.data.message || 'Failed to upload pet photo')
	}
}