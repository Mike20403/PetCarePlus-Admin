import { api } from './axios'
import type { Service, ServiceRequest, ServicePatchRequest, ListServiceResponse } from '@/types/service'

export interface ServiceCriteria {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class ServicesService {
	private static readonly BASE_URL = '/admin/services'

	/**
	 * Get all services with pagination and basic search
	 */
	static async getServices(
		criteria?: ServiceCriteria,
		page: number = 1,
		size: number = 10,
		sortBy: string = 'createdAt',
		sort: 'asc' | 'desc' = 'asc'
	): Promise<ListServiceResponse> {
		const params = { ...criteria, page, size, sortBy, sort }
		const response = await api.get<ListServiceResponse>(this.BASE_URL, { params })
		return response.data
	}

	/**
	 * Advanced search services with all filters
	 */
	static async searchServicesAdvanced(
		criteria: ServiceCriteria,
		page: number = 1,
		size: number = 10,
		sortBy: string = 'createdAt',
		sort: 'asc' | 'desc' = 'asc'
	): Promise<ListServiceResponse> {
		const params = {
			...criteria,
			page,
			size,
			sortBy,
			sort
		}
		
		console.log('Advanced search API call with params:', params)
		
		try {
			const response = await api.get<ListServiceResponse>(`${this.BASE_URL}/search/advanced`, { params })
			console.log('Advanced search response:', response.data)
			return response.data
		} catch (error) {
			console.error('Advanced search API error:', error)
			throw error
		}
	}

	/**
	 * Get a single service by ID
	 */
	static async getService(id: string): Promise<Service> {
		const response = await api.get<Service>(`${this.BASE_URL}/${id}`)
		
		if (response.status === 200 && response.data) {
			return response.data
		}
		
		throw new Error(response.statusText || 'Failed to get service')
	}

	/**
	 * Create a new service
	 */
	static async createService(serviceData: ServiceRequest): Promise<Service> {
		const response = await api.post<Service>(this.BASE_URL, serviceData)
		
		if ((response.status === 200 || response.status === 201) && response.data) {
			return response.data
		}
		
		console.error('Create service failed:', response)
		throw new Error(response.statusText || 'Failed to create service')
	}

	/**
	 * Update an existing service
	 */
	static async updateService(id: string, serviceData?: ServicePatchRequest): Promise<Service> {
		const response = await api.patch<Service>(`${this.BASE_URL}/${id}`, serviceData)
		
		if (response.status === 200 && response.data) {
			return response.data
		}
		
		throw new Error(response.statusText || 'Failed to update service')
	}

	/**
	 * Delete a service
	 */
	static async deleteService(id: string): Promise<void> {
		const response = await api.delete<Service>(`${this.BASE_URL}/${id}`)
		
		if (response.status !== 200 && response.status !== 204) {
			console.error('Delete service failed:', response)
			throw new Error(response.statusText || 'Failed to delete service')
		}
	}
}