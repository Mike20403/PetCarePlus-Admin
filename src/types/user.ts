import type { PaginationResponse } from "./pagination"

// User Management Types
export interface Role {
	id: number
	name: string
}

export interface User {
	id: string
	email: string
	name: string
	lastName: string
	role: string
	emailVerifiedAt?: string | null
	phoneNumber?: string // always string or undefined
	blockedAt?: string | null
	createdAt: string
	updatedAt: string
	deletedAt?: string | null
}

export interface ListUserResponse extends PaginationResponse<User> {}

export interface UserRequest {
	name: string
	email: string
	password?: string
	roleId: number
}

export interface UserInfo {
	id: string
	email: string
	name: string
	lastName: string
	phoneNumber: string
	role: string
	emailVerifiedAt: string | null
	blockedAt: string | null
	createdAt: string
	updatedAt: string
	deletedAt: string | null
}
