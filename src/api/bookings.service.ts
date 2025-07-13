import { api } from './axios'
import type { Booking } from '@/types/booking'
import type { ApiResponse } from '@/types/common'

export interface BookingCriteria {
  query?: string;
  status?: string;
  paymentStatus?: string;
  userId?: string;
  providerId?: string;
  isDeleted?: boolean;
}

export class BookingsService {
	private static readonly BASE_URL = '/admin/bookings'

	/**
	 * Get all bookings with pagination and filtering
	 */
	static async getBookings(
		page: number = 1,
		size: number = 10,
		sortBy?: string,
		sort: 'asc' | 'desc' = 'asc',
		criteria?: BookingCriteria
	): Promise<{ content: Booking[]; totalElements: number; totalPages: number; page: number; size: number; }> {
		const params = {
			page,
			size,
			sortBy,
			sort,
			...criteria
		}
		const response = await api.get(this.BASE_URL, { params })
		const data = response.data as { content: Booking[]; totalElements: number; totalPages: number; number: number; size: number }
		return {
		  content: data.content || [],
		  totalElements: data.totalElements || 0,
		  totalPages: data.totalPages || 1,
		  page: data.number || 1,
		  size: data.size || size
		}
	}

	/**
	 * Get a single booking by ID
	 */
	static async getBooking(id: string): Promise<Booking> {
		const response = await api.get<ApiResponse<Booking>>(`${this.BASE_URL}/${id}`)
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to get booking')
	}

	static async deleteBooking(id: string): Promise<void> {
		await api.delete<ApiResponse<void>>(`${this.BASE_URL}/${id}`)
	}

	static async changeBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
		const response = await api.put<ApiResponse<Booking>>(`${this.BASE_URL}/${id}/status`, { status })
		return response.data.data
	}
}