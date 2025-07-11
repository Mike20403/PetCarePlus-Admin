import { ref } from 'vue'
import { UserService, type UserCriteria, type UpdateUserRequest } from '@/api/user.service'
import type { User, ListUserResponse } from '@/types/user'

function toUpdateUserRequest(user: User): UpdateUserRequest {
  return {
    name: user.name,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber || '',
  }
}

export function useUsers() {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers(criteria?: UserCriteria, page = 1, size = 10, sortBy = 'createdAt', sort: 'asc' | 'desc' = 'asc') {
    loading.value = true
    error.value = null
    try {
      const res: ListUserResponse = await UserService.getUsers(criteria, page, size, sortBy, sort)
      users.value = res.items || []
      return res
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  async function getUserById(id: string) {
    return UserService.getUserById(id)
  }

  async function updateUser(id: string, user: User) {
    return UserService.updateUser(id, toUpdateUserRequest(user))
  }

  async function changeUserRole(id: string, role: string) {
    return UserService.changeUserRole(id, role)
  }

  async function toggleUserBlockStatus(id: string, blocked: boolean) {
    return UserService.toggleUserBlockStatus(id, blocked)
  }

  async function blockUnblockUser(id: string, blocked: boolean) {
    return UserService.blockUnblockUser(id, blocked)
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    updateUser,
    changeUserRole,
    toggleUserBlockStatus,
    blockUnblockUser
  }
}
