import { api } from './axios'
import type { Withdrawal, WithdrawalStatus, WithdrawalActionRequest, ListWithdrawalResponse } from '@/types/withdrawal'

export interface WithdrawalCriteria {
  status?: WithdrawalStatus;
  query?: string;
}

export class WithdrawalsService {
	private static readonly BASE_URL = '/admin/withdrawals'

	/**
	 * Get all withdrawals with pagination
	 */
	static async getWithdrawals(
		criteria?: WithdrawalCriteria,
		page: number = 1,
		size: number = 10,
		sortBy: string = 'createdAt',
		sort: 'asc' | 'desc' = 'desc'
	): Promise<ListWithdrawalResponse> {
		const params = { ...criteria, page, size, sortBy, sort }
		const response = await api.get<ListWithdrawalResponse>(this.BASE_URL, { params })
		return response.data
	}

	/**
	 * Get withdrawal by ID
	 */
	static async getWithdrawalById(id: string): Promise<Withdrawal> {
		const response = await api.get<Withdrawal>(`${this.BASE_URL}/${id}`)
		
		if (response.status === 200 && response.data) {
			return response.data
		}
		
		throw new Error(response.statusText || 'Failed to get withdrawal')
	}

	/**
	 * Approve a withdrawal request
	 */
	static async approveWithdrawal(withdrawalId: string, data?: WithdrawalActionRequest): Promise<Withdrawal> {
		console.log('API: Approving withdrawal', withdrawalId, 'with data:', data)
		
		try {
			const response = await api.post<Withdrawal>(
				`${this.BASE_URL}/${withdrawalId}/approve`,
				data || {}
			)
			
			console.log('API: Approve response:', response.status, response.data)
			
			if ((response.status === 200 || response.status === 201) && response.data) {
				return response.data
			}
			
			console.error('Approve withdrawal failed:', response)
			throw new Error(response.statusText || 'Failed to approve withdrawal')
		} catch (error) {
			console.error('API: Error approving withdrawal:', error)
			throw error
		}
	}

	/**
	 * Reject a withdrawal request
	 */
	static async rejectWithdrawal(withdrawalId: string, data: WithdrawalActionRequest): Promise<Withdrawal> {
		const response = await api.post<Withdrawal>(
			`${this.BASE_URL}/${withdrawalId}/reject`,
			data
		)
		
		if ((response.status === 200 || response.status === 201) && response.data) {
			return response.data
		}
		
		console.error('Reject withdrawal failed:', response)
		throw new Error(response.statusText || 'Failed to reject withdrawal')
	}

	/**
	 * Complete a withdrawal (mark as completed after bank transfer)
	 */
	static async completeWithdrawal(withdrawalId: string, data?: WithdrawalActionRequest): Promise<Withdrawal> {
		const response = await api.post<Withdrawal>(
			`${this.BASE_URL}/${withdrawalId}/complete`,
			data || {}
		)
		
		if ((response.status === 200 || response.status === 201) && response.data) {
			return response.data
		}
		
		console.error('Complete withdrawal failed:', response)
		throw new Error(response.statusText || 'Failed to complete withdrawal')
	}
}