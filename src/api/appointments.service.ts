import { api } from './axios'
import type { Appointment, PaginationParams, ListResponse } from '@/types/api'

export class AppointmentsService {
	private static readonly BASE_URL = '/appointments'

	// Get all appointments with pagination
	static async getAppointments(params: PaginationParams = {}): Promise<ListResponse<Appointment>> {
		const response = await api.get<Appointment[]>(this.BASE_URL, { params })
		return response.data as ListResponse<Appointment>
	}

	// Get appointment by ID
	static async getAppointment(id: number): Promise<Appointment> {
		const response = await api.get<Appointment>(`${this.BASE_URL}/${id}`)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to get appointment')
	}

	// Create new appointment
	static async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
		const response = await api.post<Appointment>(this.BASE_URL, appointmentData)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to create appointment')
	}

	// Update appointment
	static async updateAppointment(id: number, appointmentData: Partial<Appointment>): Promise<Appointment> {
		const response = await api.put<Appointment>(`${this.BASE_URL}/${id}`, appointmentData)

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to update appointment')
	}

	// Delete appointment
	static async deleteAppointment(id: number): Promise<void> {
		const response = await api.delete(`${this.BASE_URL}/${id}`)

		if (!response.data.success) {
			throw new Error(response.data.message || 'Failed to delete appointment')
		}
	}

	// Cancel appointment
	static async cancelAppointment(id: number, reason?: string): Promise<Appointment> {
		const response = await api.patch<Appointment>(`${this.BASE_URL}/${id}/cancel`, { reason })

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to cancel appointment')
	}

	// Complete appointment
	static async completeAppointment(id: number, notes?: string): Promise<Appointment> {
		const response = await api.patch<Appointment>(`${this.BASE_URL}/${id}/complete`, { notes })

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to complete appointment')
	}

	// Get appointments by status
	static async getAppointmentsByStatus(status: string, params: PaginationParams = {}): Promise<ListResponse<Appointment>> {
		const response = await api.get<Appointment[]>(`${this.BASE_URL}/status/${status}`, { params })
		return response.data as ListResponse<Appointment>
	}

	// Get appointments by date range
	static async getAppointmentsByDateRange(startDate: string, endDate: string, params: PaginationParams = {}): Promise<ListResponse<Appointment>> {
		const response = await api.get<Appointment[]>(`${this.BASE_URL}/date-range`, {
			params: { startDate, endDate, ...params }
		})
		return response.data as ListResponse<Appointment>
	}

	// Get appointments by pet
	static async getAppointmentsByPet(petId: number, params: PaginationParams = {}): Promise<ListResponse<Appointment>> {
		const response = await api.get<Appointment[]>(`${this.BASE_URL}/pet/${petId}`, { params })
		return response.data as ListResponse<Appointment>
	}

	// Get appointments by customer
	static async getAppointmentsByCustomer(customerId: number, params: PaginationParams = {}): Promise<ListResponse<Appointment>> {
		const response = await api.get<Appointment[]>(`${this.BASE_URL}/customer/${customerId}`, { params })
		return response.data as ListResponse<Appointment>
	}

	// Get available time slots
	static async getAvailableTimeSlots(date: string, veterinarianId?: number): Promise<string[]> {
		const response = await api.get<string[]>(`${this.BASE_URL}/available-slots`, {
			params: { date, veterinarianId }
		})

		if (response.data.success && response.data.data) {
			return response.data.data
		}

		throw new Error(response.data.message || 'Failed to get available time slots')
	}

	// Send appointment reminder
	static async sendAppointmentReminder(id: number): Promise<void> {
		const response = await api.post(`${this.BASE_URL}/${id}/reminder`)

		if (!response.data.success) {
			throw new Error(response.data.message || 'Failed to send appointment reminder')
		}
	}
}