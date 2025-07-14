// Term Types
export enum TermsType {
	USER_TERMS = 'USER_TERMS',
	PROVIDER_TERMS = 'PROVIDER_TERMS',
	PRIVACY_POLICY = 'PRIVACY_POLICY',
	PAYMENT_TERMS = 'PAYMENT_TERMS'
}

export interface Term {
	id: string;
	type: TermsType;
	language: string;
	version: string;
	title: string;
	content: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTermsRequest {
	type: TermsType;
	language: string;
	title: string;
	content: string;
}

export interface UpdateTermsRequest {
	type?: TermsType;
	language?: string;
	title?: string;
	content?: string;
	version?: string;
	active?: boolean;
}