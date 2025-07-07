// Service Types
export interface Service {
	id: string;
	name: string;
	description: string;
	iconUrl: string;
	basePrice: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
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