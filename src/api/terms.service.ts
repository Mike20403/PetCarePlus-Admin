import { api } from './axios'
import type { Term, TermsType, CreateTermsRequest, UpdateTermsRequest } from '@/types/term'
import type { ApiResponse } from '@/types/common'

export class TermsService {
	private static readonly BASE_URL = '/admin/terms'

	/**
	 * Get all terms for a specific language
	 */
	static async getTerms(language: string = 'en'): Promise<Term[]> {
		const response = await api.get<ApiResponse<Term[]>>(this.BASE_URL, {
			params: { language }
		})
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to get terms')
	}

	static async getTerm(id: string): Promise<Term> {
		const response = await api.get<ApiResponse<Term>>(`${this.BASE_URL}/${id}`)
		return response.data.data
	}

	/**
	 * Get all terms for all languages
	 */
	static async getTermsAllLanguages(): Promise<Term[]> {
		const response = await api.get<ApiResponse<Term[]>>(`${this.BASE_URL}/all-languages`)
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to get terms for all languages')
	}

	/**
	 * Get terms by type and language
	 */
	static async getTermsByType(type: TermsType, language: string = 'en'): Promise<Term> {
		const response = await api.get<ApiResponse<Term>>(`${this.BASE_URL}/${type}`, {
			params: { language }
		})
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to get terms by type')
	}

	/**
	 * Create a new term
	 */
	static async createTerm(termData: CreateTermsRequest): Promise<Term> {
		const response = await api.post<ApiResponse<Term>>(this.BASE_URL, termData)
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to create term')
	}

	/**
	 * Update an existing term
	 */
	static async updateTerm(id: string, termData: UpdateTermsRequest): Promise<Term> {
		const response = await api.patch<ApiResponse<Term>>(`${this.BASE_URL}/${id}`, termData)
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to update term')
	}

	static async getLatestTermByType(type: TermsType): Promise<Term> {
		const response = await api.get<ApiResponse<Term>>(`${this.BASE_URL}/latest/${type}`)
		return response.data.data
	}

	static async deleteTerm(id: string): Promise<void> {
		await api.delete<ApiResponse<void>>(`${this.BASE_URL}/${id}`)
	}
}