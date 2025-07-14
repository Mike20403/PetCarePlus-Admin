import { api } from './axios'
import type { Booking, ListBookingResponse } from '@/types/booking'

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
	): Promise<ListBookingResponse> {
		const params = {
			page,
			size,
			sortBy,
			sort,
			...criteria
		}
		const response = await api.get<ListBookingResponse>(this.BASE_URL, { params })
		return response.data
	}

	/**
	 * Get a single booking by ID
	 */
	static async getBooking(id: string): Promise<Booking> {
		const response = await api.get<Booking>(`${this.BASE_URL}/${id}`)	
		return response.data
	}
}