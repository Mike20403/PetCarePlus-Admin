import type { User } from './user'

// Booking Types
export interface ProviderServiceResponse {
	id: string;
	providerId: string;
	serviceId: string;
	serviceName: string;
	providerName: string;
	basePrice: number;
	customPrice: number;
	customDescription: string;
	iconUrl: string;
	createdAt: string;
}

export interface BookingPetServiceResponse {
	petId: string;
	petName: string;
	petImageUrl: string;
	serviceId: string;
	serviceName: string;
	price: number;
}

export interface Booking {
	id: string;
	user: User;
	providerService: ProviderServiceResponse;
	status: string;
	totalPrice: number;
	paymentStatus: string;
	bookingTime: string;
	scheduledStartTime: string;
	scheduledEndTime: string;
	actualEndTime: string | null;
	cancellationReason: string | null;
	note: string | null;
	petList: BookingPetServiceResponse[];
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

// Common Entity Types
export interface Pet {
	id: number;
	name: string;
	species: string;
	breed: string;
	age: number;
	ownerId: number;
	createdAt: string;
	updatedAt: string;
}

export interface Customer {
	id: number;
	name: string;
	email: string;
	phone: string;
	address: string;
	pets: Pet[];
	createdAt: string;
	updatedAt: string;
}

export interface Appointment {
	id: number;
	petId: number;
	customerId: number;
	veterinarianId: number;
	scheduledAt: string;
	status: 'scheduled' | 'completed' | 'cancelled';
	notes?: string;
	createdAt: string;
	updatedAt: string;
}