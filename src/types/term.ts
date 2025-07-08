// Term Types
export enum TermsType {
	USER_TERMS = 'USER_TERMS',
	PRIVACY_POLICY = 'PRIVACY_POLICY',
	REFUND_POLICY = 'REFUND_POLICY',
	OTHER = 'OTHER'
}

export interface Term {
	id: string;
	type: TermsType;
	language: string;
	version: string;
	title: string;
	content: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTermsRequest {
	type: TermsType;
	language: string;
	title: string;
	content: string;
	version: string;
	isActive: boolean;
}

export interface UpdateTermsRequest {
	title?: string;
	content?: string;
	version?: string;
	isActive?: boolean;
}