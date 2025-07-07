// Withdrawal Types
export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface Withdrawal {
	id: string;
	amount: number;
	fee: number;
	netAmount: number;
	status: WithdrawalStatus;
	bankName: string;
	accountNumber: string;
	accountHolderName: string;
	createdAt: string;
	processedAt?: string;
	adminNote?: string;
	rejectionReason?: string;
	transactionRef?: string;
}

export interface WithdrawalRequest {
	amount: number;
	bankName: string;
	accountNumber: string;
	accountHolderName: string;
}

export interface WithdrawalActionRequest {
	adminNote?: string;
	rejectionReason?: string;
	transactionNote?: string;
}