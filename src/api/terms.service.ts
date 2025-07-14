import { api } from './axios'
import type { Term, TermsType, CreateTermsRequest, UpdateTermsRequest } from '@/types/term'

export class TermsService {
	private static readonly BASE_URL = '/admin/terms'

	/**
	 * Get all terms for a specific language
	 */
	static async getTerms(language: string = 'vi'): Promise<Term[]> {
		const response = await api.get<Term[]>(this.BASE_URL, {
			params: { language }
		})
		
		if (response.status === 200 && response.data) {
			return response.data
		}
		
		throw new Error(response.statusText || 'Failed to get terms')
	}

	/**
	 * Get all terms for all languages
	 */
	static async getTermsAllLanguages(): Promise<Term[]> {
		const response = await api.get<Term[]>(`${this.BASE_URL}/all-languages`)
		
		if (response.status === 200 && response.data) {
			return response.data
		}
		
		throw new Error(response.statusText || 'Failed to get terms for all languages')
	}

	/**
	 * Get terms by type and language
	 */
	static async getTermsByType(type: TermsType, language: string = 'vi'): Promise<Term> {
		const response = await api.get<Term>(`${this.BASE_URL}/${type}`, {
			params: { language }
		})
		
		if (response.status === 200 && response.data) {
			return response.data
		}
		
		throw new Error(response.statusText || 'Failed to get terms by type')
	}

	/**
	 * Create a new term
	 */
	static async createTerm(termData: CreateTermsRequest): Promise<Term> {
		const response = await api.post<Term>(this.BASE_URL, termData)
		
		if ((response.status === 200 || response.status === 201) && response.data) {
			return response.data
		}
		
		throw new Error(response.statusText || 'Failed to create term')
	}

	/**
	 * Update an existing term
	 */
	static async updateTerm(id: string, termData: UpdateTermsRequest): Promise<Term> {
		const response = await api.patch<Term>(`${this.BASE_URL}/${id}`, termData)
		
		if ((response.status === 200 || response.status === 201) && response.data) {
			return response.data
		}
		
		throw new Error(response.statusText || 'Failed to update term')
	}




}