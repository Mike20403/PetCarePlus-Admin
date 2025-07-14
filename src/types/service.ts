import type { PaginationResponse } from './pagination'

// Service Types
export interface Service {
	id: string;
	name: string;
	description: string;
	iconUrl: string;
	basePrice: number;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
}

export interface ServiceRequest {
	name: string;
	description: string;
	basePrice: number;
	iconUrl?: string;
}

export interface ServicePatchRequest {
	name?: string;
	description?: string;
	basePrice?: number;
	iconUrl?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ListServiceResponse extends PaginationResponse<Service> {}

// Keep backward compatibility
export interface LegacyListServiceResponse {
	content: Service[];
	totalElements: number;
	totalPages: number;
	page: number;
	size: number;
}