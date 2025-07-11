<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUsers } from '@/hooks/useUsers'
import type { User } from '@/types/user'
import type { UserCriteria } from '@/api'

import UserDetailModal from '@/components/user/UserDetailModal.vue'
import UserEditModal from '@/components/user/UserEditModal.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DataTable, { type DataTableHeader } from '@/components/ui/DataTable.vue'


const authStore = useAuthStore()
const { users, fetchUsers, getUserById, updateUser, changeUserRole, toggleUserBlockStatus } = useUsers()
const currentUser = ref<User | null>(null)

const openDetail = ref(false)
const openEdit = ref(false)
const detailUser = ref<User | null>(null)
const editUser = ref<User | null>(null)
const detailLoading = ref(false)
const actionLoading = ref(false)

const searchQuery = ref<string>('')
const selectedRole = ref<string>('')
const page = ref<number>(1)
const size = ref<number>(10)
const total = ref<number>(0)
const pages = ref<number>(1)

const openCreateUserModal = () => {
  currentUser.value = null
  open.value = true
}

const openEditUserModal = (user: User) => {
  editUser.value = user
  openEdit.value = true
}

const deleteUser = async (user: User) => {
  if (confirm('Are you sure you want to delete this user?')) {
    await fetchAndSetUsers()
  }
}

const openUserDetail = async (user: User) => {
  detailLoading.value = true
  try {
    const data = await getUserById(user.id)
    detailUser.value = data
    openDetail.value = true
  } finally {
    detailLoading.value = false
  }
}

const handleEditSave = async (user: User) => {
  actionLoading.value = true
  try {
    await updateUser(user.id, user)
    await fetchAndSetUsers()
    openEdit.value = false
  } finally {
    actionLoading.value = false
  }
}

const handleBlock = async (user: User) => {
  actionLoading.value = true
  try {
    await toggleUserBlockStatus(user.id, !user.blockedAt)
    await fetchAndSetUsers()
    open.value = false
  } finally {
    actionLoading.value = false
  }
}

const handleRoleChange = async (user: User) => {
  actionLoading.value = true
  try {
    await changeUserRole(user.id, user.role)
    await fetchAndSetUsers()
    open.value = false
  } finally {
    actionLoading.value = false
  }
}

async function fetchAndSetUsers() {
  const criteria: UserCriteria = {}
  if (searchQuery.value) criteria.query = searchQuery.value
  if (selectedRole.value) criteria.roles = [selectedRole.value]
  const res = await fetchUsers(criteria, page.value, size.value, 'createdAt', 'asc')
  if (res) {
    total.value = res.total || 0
    pages.value = res.pages || 1
  }
}

onMounted(() => {
  fetchAndSetUsers()
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
  status: user.blockedAt ? 'Inactive' : 'Active',
  emailVerifiedAt: user.emailVerifiedAt ? 'Yes' : 'No',
})))
</script>

<template>
  <DashboardLayout title="Users" subtitle="Manage system users and their permissions">
    <template #actions>
      <button v-if="authStore.hasRole('ADMIN')" @click="openCreateUserModal" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        Add User
      </button>
    </template>

    <DataTable :headers="userTableHeaders" :items="mappedUsers" :loading="actionLoading || detailLoading"
      :totalItems="total" :title="'Users Management'" :hasActions="true" :itemsPerPageOptions="[10, 25, 50]"
      @update:search="(val: string) => searchQuery = val"
      @update:pagination="(p: number, s: number) => { page = p; size = s }" @update:sort="">
      <template #rowActions="{ item }">
        <div class="d-flex gap-2">
          <button class="btn btn-sm" @click.prevent="openUserDetail(item as unknown as User)" title="View detail">
            View
          </button>
          <button class="btn btn-sm" @click.prevent="openEditUserModal(item as unknown as User)">
            Edit
          </button>
          <button class="btn btn-sm btn-danger" @click.prevent="deleteUser(item as unknown as User)">
            Delete
          </button>
        </div>
      </template>
    </DataTable>

    <UserDetailModal :isOpen="openDetail" :user="detailUser" :loading="detailLoading" @close="openDetail = false" />
    <UserEditModal :isOpen="openEdit" :user="editUser" :loading="actionLoading" @close="openEdit = false"
      @save="handleEditSave" />
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
