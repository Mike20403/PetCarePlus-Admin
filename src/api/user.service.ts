import { api } from './axios'
import type { User } from '@/types/user'
import type { ListUserResponse } from '@/types/user'

export interface UserCriteria {
  roles?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  isBlocked?: boolean;
  isEmailActivated?: boolean;
  query?: string;
}

export interface UpdateUserRequest {
  name?: string;
  lastName?: string;
  email?: string;
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
  ): Promise<ListUserResponse> {
    const params = {
      ...criteria,
      page,
      size,
      sortBy,
      sort
    }
    const response = await api.get<ListUserResponse>(this.BASE_URL, { params })
    return response.data
  }

  /**
   * Get a user by ID
   */
  static async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`${this.BASE_URL}/${id}`)
    return response.data
  }

  /**
   * Update a user
   */
  static async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await api.put<User>(`${this.BASE_URL}/${id}`, userData)

    if (response.status === 200 && response.data) {
      return response.data
    }

    throw new Error('Failed to update user')
  }

  /**
   * Change user role
   */
  static async changeUserRole(id: string, role: string): Promise<User> {
    const response = await api.put<User>(
      `${this.BASE_URL}/${id}/role`,
      { role }
    )

    if (response.status === 200 && response.data) {
      return response.data
    }

    throw new Error(response.statusText || 'Failed to change user role')
  }

  /**
   * Block a user
   */
  static async blockUser(id: string): Promise<User> {
    const response = await api.patch<User>(`${this.BASE_URL}/${id}/block`)
    if (response.status === 200 && response.data) {
      return response.data
    }
    throw new Error(response.statusText || 'Failed to block user')
  }

  /**
   * Unblock a user
   */
  static async unblockUser(id: string): Promise<User> {
    const response = await api.patch<User>(`${this.BASE_URL}/${id}/unblock`)
    if (response.status === 200 && response.data) {
      return response.data
    }
    throw new Error(response.statusText || 'Failed to unblock user')
  }
}

// For backward compatibility
export const userService = {
  getAllUsers(params?: UserCriteria) {
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
  blockUser(id: string) {
    return UserService.blockUser(id);
  },
  unblockUser(id: string) {
    return UserService.unblockUser(id);
  }
};
