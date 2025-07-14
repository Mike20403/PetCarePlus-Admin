import type { PaginationResponse } from './pagination'

export interface Pet {
  id: string
  userId: string
  name: string
  age: number
  dayOfBirth: string
  species: 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'HAMSTER' | 'FISH' | 'OTHER'
  breed: string
  gender: string
  size: string
  description: string
  imageUrl: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface PetRequest {
  ownerId: string
  name: string
  age: number
  dayOfBirth: string
  species: 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'HAMSTER' | 'FISH' | 'OTHER'
  breed: string
  gender: string
  size: string
  imageUrl: string
  description: string
}

export interface PetPatchRequest {
  name?: string
  age?: number
  species?: 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'HAMSTER' | 'FISH' | 'OTHER'
  breed?: string
  dayOfBirth?: string
  gender?: string
  size?: string
  description?: string
  imageUrl?: string
}

export interface ListPetResponse extends PaginationResponse<Pet> {}

// Keep backward compatibility
export interface LegacyListPetResponse {
  page: number
  pages: number
  size: number
  total: number
  items: Pet[]
} 