import { api } from './axios'
import type { ApiResponse } from '@/types/common'
import type { ListUserResponse, User, User } from '@/types/user'

export interface UserCriteria {
  roles?: string[];
  createdAtStart?: string;
  createdAtEnd?: string;
  isBlocked?: boolean;
  isEmailActivated?: boolean;
  query?: string;
}

export interface UpdateUserRequest {
  name?: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface ChangeUserRoleRequest {
  role: string;
}

export class UserService {
  private static readonly BASE_URL = '/admin/users'

  /**
   * Get all users with pagination and filtering
   */
  static async getUsers(
    criteria?: UserCriteria,
    page: number = 1,
    size: number = 10,
    sortBy: string = 'createdAt',
    sort: 'asc' | 'desc' = 'asc'
  ): Promise<ApiResponse<ListUserResponse>> {

    const params = {
      ...criteria,
      page,
      size,
      sortBy,
      sort
    }

    const response = await api.get(this.BASE_URL, { params })
    return response.data
  }

  /**
   * Get a user by ID
   */
  static async getUserById(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`${this.BASE_URL}/${id}`)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to get user')
  }

  /**
   * Update a user
   */
  static async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`${this.BASE_URL}/${id}`, userData)
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to update user')
  }

  /**
   * Change user role
   */
  static async changeUserRole(id: string, role: string): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      `${this.BASE_URL}/${id}/role`,
      { role }
    )
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to change user role')
  }

  /**
   * Block/Unblock a user
   */
  static async toggleUserBlockStatus(id: string, blocked: boolean): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      `${this.BASE_URL}/${id}/block`,
      null,
      { params: { blocked } }
    )
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    throw new Error(response.data.message || 'Failed to toggle user block status')
  }
}

// For backward compatibility
export const userService = {
  getAllUsers(params?: any) {
    return UserService.getUsers(params);
  },
  getUserById(id: string) {
    return api.get(`/admin/users/${id}`);
  },
  updateUser(id: string, user: UpdateUserRequest) {
    return api.put(`/admin/users/${id}`, user);
  },
  deleteUser(id: string) {
    return api.delete(`/admin/users/${id}`);
  },
  changeUserRole(id: string, role: string) {
    return api.put(`/admin/users/${id}/role`, { role });
  },
  toggleUserBlockStatus(id: string, blocked: boolean) {
    return api.put(`/admin/users/${id}/block`, null, { params: { blocked } });
  }
};