import { ref } from 'vue'
import { UserService, type UserCriteria, type UpdateUserRequest } from '@/api/user.service'
import type { User } from '@/types/user'

export function useUsers() {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchUsers(criteria?: UserCriteria, page = 1, size = 10, sortBy = 'createdAt', sort: 'asc' | 'desc' = 'asc') {
    loading.value = true
    error.value = null
    try {
      const res = await UserService.getUsers(criteria, page, size, sortBy, sort)
      users.value = res.items || []
      console.log('users sau khi gán:', users.value) // Log giá trị users sau khi gán
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

  async function updateUser(id: string, data: UpdateUserRequest) {
    return UserService.updateUser(id, data)
  }

  async function changeUserRole(id: string, role: string) {
    return UserService.changeUserRole(id, role)
  }

  async function toggleUserBlockStatus(id: string, blocked: boolean) {
    return UserService.toggleUserBlockStatus(id, blocked)
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    updateUser,
    changeUserRole,
    toggleUserBlockStatus
  }
} 