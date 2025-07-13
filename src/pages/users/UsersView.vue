<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import DataTable, { type DataTableHeader } from '@/components/ui/DataTable.vue'
import { useUsers } from '@/hooks/useUsers'
import { useToast } from '@/hooks/useToast'

import UserDetailModal from '@/components/user/UserDetailModal.vue'
import UserEditModal from '@/components/user/UserEditModal.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'

import type { User } from '@/types/user'
import type { UserCriteria } from '@/api'

const { users, fetchUsers, updateUser, blockUser, unblockUser, changeUserRole } = useUsers()

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const detailUserModal = ref<InstanceType<typeof UserDetailModal> | null>(null)
const editUserModal = ref<InstanceType<typeof UserEditModal> | null>(null)
const { toast } = useToast()
const fetchLoading = ref(false)
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(null)

const selectedRole = ref<string>('')
const selectedStatus = ref<string>('')
const selectedEmailVerified = ref<string>('')
const page = ref<number>(1)
const size = ref<number>(10)
const total = ref<number>(0)
const pages = ref<number>(1)

// Filter options
const roleOptions = [
  { value: '', label: 'All Roles' },
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SERVICE_PROVIDER', label: 'Service Provider' }
]

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'blocked', label: 'Blocked' }
]

const emailVerifiedOptions = [
  { value: '', label: 'All Email Status' },
  { value: 'true', label: 'Verified' },
  { value: 'false', label: 'Not Verified' }
]

const openEditUserModal = (user: User) => {
  editUserModal.value?.open(user.id)
}

const handleBlock = (id: string) => {
  const item = users.value.find(user => user.id === id)
  if (!item) return

  confirmationDialog.value?.open(
    `Are you sure you want to ${item.blockedAt ? 'unblock' : 'block'} this user?`,
    `${item.blockedAt ? 'Unblock' : 'Block'} User`,
    async () => {
      try {
        if (item.blockedAt) {
          await unblockUser(id)
        } else {
          await blockUser(id)
        }
        await fetchAndSetUsers()
      } catch (error: unknown) {
        toast({
          type: 'error',
          message: (error as Error).message || 'Có lỗi xảy ra khi block/unblock user.'
        })
      }
    }
  )
}

const openUserDetail = async (user: User) => {
  detailUserModal.value?.open(user.id)
}

const handleEditSave = async (user: User) => {
  fetchLoading.value = true
  try {
    const oldUser = users.value.find(u => u.id === user.id)
    let hasChanges = false
    
    // Chỉ gọi changeUserRole nếu role thay đổi
    if (oldUser && oldUser.role !== user.role) {
      await changeUserRole(user.id, user.role)
      hasChanges = true
    }
    
    // Chỉ gọi updateUser nếu có thay đổi về name, lastName, hoặc email
    if (oldUser && (
      oldUser.name !== user.name || 
      oldUser.lastName !== user.lastName || 
      oldUser.email !== user.email
    )) {
      await updateUser(user.id, user)
      hasChanges = true
    }
    
    if (hasChanges) {
      await fetchAndSetUsers()
      toast({
        type: 'success',
        message: 'User updated successfully'
      })
    }
  } catch (error: unknown) {
    toast({
      type: 'error',
      message: (error as Error).message || 'Failed to update user'
    })
  } finally {
    fetchLoading.value = false
  }
}

async function fetchAndSetUsers() {
  fetchLoading.value = true

  const criteria: UserCriteria = {}
  
  // Chỉ truyền roles khi thực sự được chọn (không phải "All Roles")
  if (selectedRole.value && selectedRole.value !== '') {
    criteria.roles = selectedRole.value
  }
  
  // Chỉ truyền isBlocked khi thực sự được chọn (không phải "All Status")  
  if (selectedStatus.value && selectedStatus.value !== '') {
    criteria.isBlocked = selectedStatus.value === 'blocked'
  }
  
  // Chỉ truyền isEmailActivated khi thực sự được chọn (không phải "All Email Status")
  if (selectedEmailVerified.value && selectedEmailVerified.value !== '') {
    criteria.isEmailActivated = selectedEmailVerified.value === 'true'
  }

  console.log('User search criteria:', criteria)

  const res = await fetchUsers(criteria, page.value, size.value, 'createdAt', 'asc')

  if (res) {
    total.value = res.total || 0
    pages.value = res.pages || 1
    page.value = res.page || 1
    users.value = res.items || []
  }

  fetchLoading.value = false
}

const handlePagination = (p: number, s: number) => {
  page.value = p
  size.value = s
  fetchAndSetUsers()
}

const resetFilters = () => {
  selectedRole.value = ''
  selectedStatus.value = ''
  selectedEmailVerified.value = ''
  page.value = 1
  fetchAndSetUsers()
}

onMounted(async () => {
  await fetchAndSetUsers()
})

// Watch for filter changes
watch([selectedRole, selectedStatus, selectedEmailVerified], () => {
  page.value = 1  // Reset to first page when filters change
  fetchAndSetUsers()
})

const userTableHeaders: DataTableHeader[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Role', sortable: true },
  { key: 'status', title: 'Status', sortable: false, type: 'status' },
  { key: 'emailVerifiedAt', title: 'Email Verified', sortable: false },
  { key: 'createdAt', title: 'Created', sortable: true, type: 'date' }
]

const mappedUsers = computed(() => users.value.map(user => ({
  ...user,
  name: `${user.name} ${user.lastName}`,
  status: user.blockedAt ? 'Blocked' : 'Active',
  emailVerifiedAt: user.emailVerifiedAt ? 'Yes' : 'No',
})))
</script>

<template>
  <DashboardLayout title="Users" subtitle="Manage system users and their permissions">
    <DataTable 
      :page="page" 
      :headers="userTableHeaders" 
      :items="mappedUsers" 
      :loading="fetchLoading" 
      :totalItems="total"
      :title="'Users Management'" 
      :hasActions="true" 
      :itemsPerPageOptions="[10, 25, 50]"
      :hideSearch="true"
      @update:pagination="handlePagination"
      @update:sort="() => { }">
      
      <template #customFilters>
        <div class="d-flex gap-2 align-items-center">
          <!-- Role Filter -->
          <select class="form-select w-auto" v-model="selectedRole">
            <option v-for="option in roleOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          
          <!-- Status Filter -->
          <select class="form-select w-auto" v-model="selectedStatus">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          
          <!-- Email Verified Filter -->
          <select class="form-select w-auto" v-model="selectedEmailVerified">
            <option v-for="option in emailVerifiedOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          
          <!-- Reset Button -->
          <button class="btn btn-outline-secondary btn-sm" @click="resetFilters" title="Reset all filters">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"/>
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>
            </svg>
            Reset
          </button>
        </div>
      </template>
      
      <template #rowActions="{ item }">
        <div class="d-flex gap-2">
          <button class="btn btn-sm" @click.prevent="openUserDetail(item as unknown as User)" title="View detail">
            View
          </button>
          <button class="btn btn-sm" @click.prevent="openEditUserModal(item as unknown as User)">
            Edit
          </button>
          <button class="btn btn-sm" :class="{ 'btn-danger': !item.blockedAt, 'btn-success': item.blockedAt }"
            @click.prevent="handleBlock(item.id as string)">
            {{ item.blockedAt ? 'Unblock' : 'Block' }}
          </button>
        </div>
      </template>
    </DataTable>

    <UserDetailModal ref="detailUserModal" />
    <UserEditModal ref="editUserModal" @save="handleEditSave" />
    <ConfirmationDialog ref="confirmationDialog" />
  </DashboardLayout>
</template>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
}

.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.btn-list {
  display: flex;
  gap: 0.25rem;
}

.dropdown-item-icon {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .table-mobile-md {
    display: block;
  }

  .table-mobile-md thead {
    display: none;
  }

  .table-mobile-md tr {
    display: block;
    border: 1px solid var(--tblr-border-color);
    border-radius: 0.375rem;
    margin-bottom: 1rem;
    padding: 1rem;
  }

  .table-mobile-md td {
    display: block;
    text-align: right;
    padding: 0.5rem 0;
    border: none;
    border-bottom: 1px solid var(--tblr-border-color-light);
  }

  .table-mobile-md td:last-child {
    border-bottom: none;
  }

  .table-mobile-md td[data-label]:before {
    content: attr(data-label);
    float: left;
    font-weight: 600;
    color: var(--tblr-secondary);
  }
}
</style>
