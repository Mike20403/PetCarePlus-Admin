import { api } from './axios'
import type { Withdrawal, WithdrawalStatus } from '@/types/withdrawal'
import type { ApiResponse } from '@/types/common'

export class WithdrawalsService {
	private static readonly BASE_URL = '/admin/withdrawals'

	/**
	 * Get all withdrawals with pagination
	 */
	static async getWithdrawals(page: number = 1, size: number = 10): Promise<Withdrawal[]> {
		const response = await api.get(this.BASE_URL, {
			params: { page, size }
		})
		return response.data
	}

	static async getWithdrawalById(id: string): Promise<Withdrawal> {
		const response = await api.get(`${this.BASE_URL}/${id}`)
		return response.data
	}

	/**
	 * Approve a withdrawal request
	 */
	static async approveWithdrawal(withdrawalId: string, adminNote?: string): Promise<Withdrawal> {
		const response = await api.post<ApiResponse<Withdrawal>>(
			`${this.BASE_URL}/${withdrawalId}/approve`,
			{ adminNote: adminNote || 'Approved by admin' }
		)
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to approve withdrawal')
	}

	/**
	 * Reject a withdrawal request
	 */
	static async rejectWithdrawal(withdrawalId: string, rejectionReason: string): Promise<Withdrawal> {
		const response = await api.post<ApiResponse<Withdrawal>>(
			`${this.BASE_URL}/${withdrawalId}/reject`,
			{ rejectionReason }
		)
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to reject withdrawal')
	}

	/**
	 * Complete a withdrawal (mark as completed after bank transfer)
	 */
	static async completeWithdrawal(withdrawalId: string, transactionNote?: string): Promise<Withdrawal> {
		const response = await api.post<ApiResponse<Withdrawal>>(
			`${this.BASE_URL}/${withdrawalId}/complete`,
			{ transactionNote: transactionNote || 'Bank transfer completed' }
		)
		
		if (response.data.success && response.data.data) {
			return response.data.data
		}
		
		throw new Error(response.data.message || 'Failed to complete withdrawal')
	}

	static async getWithdrawalsByUser(userId: string): Promise<Withdrawal[]> {
		const response = await api.get(`${this.BASE_URL}/user/${userId}`)
		return response.data
	}

	static async getWithdrawalsByStatus(status: WithdrawalStatus): Promise<Withdrawal[]> {
		const response = await api.get(`${this.BASE_URL}/status/${status}`)
		return response.data
	}
}