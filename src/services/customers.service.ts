import { api } from '@/axios'
import type { Customer, PaginationParams, ListResponse } from '@/types/api'

export class CustomersService {
	private static readonly BASE_URL = '/customers'

	// Get all customers with pagination
	static async getCustomers(params: PaginationParams = {}): Promise<ListResponse<Customer>> {
		const response = await api.get<Customer[]>(this.BASE_URL, { params })
		return response.data as ListResponse<Customer>
	}

	// Get customer by ID
	static async getCustomer(id: number): Promise<Customer> {
		const response = await api.get<Customer>(`${this.BASE_URL}/${id}`)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to get customer')
	}

	// Create new customer
	static async createCustomer(customerData: Omit<Customer, 'id' | 'pets' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
		const response = await api.post<Customer>(this.BASE_URL, customerData)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to create customer')
	}

	// Update customer
	static async updateCustomer(id: number, customerData: Partial<Customer>): Promise<Customer> {
		const response = await api.put<Customer>(`${this.BASE_URL}/${id}`, customerData)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to update customer')
	}

	// Delete customer
	static async deleteCustomer(id: number): Promise<void> {
		const response = await api.delete(`${this.BASE_URL}/${id}`)

		if (!response.data.success) {
			throw new Error(response.data.message || 'Failed to delete customer')
		}
	}

	// Search customers
	static async searchCustomers(query: string, params: PaginationParams = {}): Promise<ListResponse<Customer>> {
		const response = await api.get<Customer[]>(`${this.BASE_URL}/search`, {
			params: { q: query, ...params }
		})
		return response.data as ListResponse<Customer>
	}

	// Get customer with pets
	static async getCustomerWithPets(id: number): Promise<Customer> {
		const response = await api.get<Customer>(`${this.BASE_URL}/${id}/with-pets`)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to get customer with pets')
	}

	// Get customer statistics
	static async getCustomerStats(): Promise<any> {
		const response = await api.get<any>(`${this.BASE_URL}/stats`)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to get customer statistics')
	}
}