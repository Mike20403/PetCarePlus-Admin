import { api } from './axios'
import type { Service, ServiceRequest, ServicePatchRequest } from '@/types/service'
import type { ApiResponse } from '@/types/common'

export interface ServiceCriteria {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class ServicesService {
	private static readonly BASE_URL = '/admin/services'

	/**
	 * Get all services with pagination
	 */
	static async getServices(
		page: number = 1,
		size: number = 10,
		sortBy?: string,
		sort: 'asc' | 'desc' = 'asc'
	): Promise<Service[]> {
		const params = {
			page,
			size,
			sortBy,
			sort
		}
		
		const response = await api.get(this.BASE_URL, { params })
		return response.data as Service[]
	}

	/**
	 * Get a single service by ID
	 */
	static async getService(id: string): Promise<Service> {
		const response = await api.get<ApiResponse<Service>>(`${this.BASE_URL}/${id}`)
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to get service')
	}

	/**
	 * Create a new service
	 */
	static async createService(serviceData: ServiceRequest): Promise<Service> {
		const response = await api.post<ApiResponse<Service>>(this.BASE_URL, serviceData)
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to create service')
	}

	/**
	 * Update an existing service
	 */
	static async updateService(id: string, serviceData?: ServicePatchRequest): Promise<Service> {
		const response = await api.patch<ApiResponse<Service>>(`${this.BASE_URL}/${id}`, serviceData)
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to update service')
	}

	/**
	 * Delete a service
	 */
	static async deleteService(id: string): Promise<void> {
		const response = await api.delete<ApiResponse<Service>>(`${this.BASE_URL}/${id}`)
		
		if (!response.data.success) {
			throw new Error(response.data.message || 'Failed to delete service')
		}
	}

	/**
	 * Advanced search for services with filtering
	 */
	static async searchServices(
		criteria: ServiceCriteria,
		page: number = 1,
		size: number = 10,
		sortBy?: string,
		sort: 'asc' | 'desc' = 'asc'
	): Promise<Service[]> {
		const params = {
			...criteria,
			page,
			size,
			sortBy,
			sort
		}
		
		const response = await api.get(`${this.BASE_URL}/search/advanced`, { params })
		return response.data as Service[]
	}
}