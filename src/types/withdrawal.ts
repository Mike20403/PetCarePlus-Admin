// Withdrawal Types
export enum WithdrawalStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
	COMPLETED = 'COMPLETED'
}

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