<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import DataTable, { type DataTableHeader } from '@/components/ui/DataTable.vue'
import { useUsers } from '@/hooks/useUsers'
import type { User } from '@/types/user'
import type { UserCriteria } from '@/api'

import UserDetailModal from '@/components/user/UserDetailModal.vue'
import UserEditModal from '@/components/user/UserEditModal.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { useToast } from '@/hooks/useToast'

const { users, fetchUsers, updateUser, blockUnblockUser } = useUsers()

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

const searchQuery = ref<string>('')
const selectedRole = ref<string>('')
const page = ref<number>(1)
const size = ref<number>(10)
const total = ref<number>(0)
const pages = ref<number>(1)

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
      await blockUnblockUser(id, !item.blockedAt)
      await fetchAndSetUsers()
    }
  )
}

const openUserDetail = async (user: User) => {
  detailUserModal.value?.open(user.id)
}

const handleEditSave = async (user: User) => {
  fetchLoading.value = true
  try {
    await updateUser(user.id, user)
    toast({
      type: 'success',
      message: 'User updated successfully'
    })
  } catch (error) {
    console.error('Failed to update user:', error)
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
  if (searchQuery.value) criteria.query = searchQuery.value
  if (selectedRole.value) criteria.roles = [selectedRole.value]

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

onMounted(async () => {
  await fetchAndSetUsers()
})

watch([searchQuery, selectedRole, page, size], fetchAndSetUsers)

const userTableHeaders: DataTableHeader[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Role', sortable: true },
  { key: 'status', title: 'Status', sortable: false, type: 'status' },
  { key: 'phoneNumber', title: 'Phone', sortable: false },
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
    <DataTable :page="page" :headers="userTableHeaders" :items="mappedUsers" :loading="fetchLoading" :totalItems="total"
      :title="'Users Management'" :hasActions="true" :itemsPerPageOptions="[10, 25, 50]"
      @update:search="(val: string) => searchQuery = val" @update:pagination="handlePagination" @update:sort="() => { }">
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
