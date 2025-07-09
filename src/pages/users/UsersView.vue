<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useUsers } from '@/hooks/useUsers'
import type { User } from '@/types/user'
import UserDetailModal from '@/components/UserDetailModal.vue'

const authStore = useAuthStore()
const { users, fetchUsers, getUserById, updateUser, changeUserRole, toggleUserBlockStatus } = useUsers()
const showUserModal = ref(false)
const currentUser = ref<User | null>(null)
const showUserDetail = ref(false)
const detailUser = ref<User | null>(null)
const detailLoading = ref(false)
const actionLoading = ref(false)

// Thêm state cho filter/search/pagination
const searchQuery = ref('')
const selectedRole = ref('')
const page = ref(1)
const size = ref(10)
const total = ref(0)
const pages = ref(1)

const openCreateUserModal = () => {
	currentUser.value = null
	showUserModal.value = true
}

const openEditUserModal = (user: User) => {
	currentUser.value = user
	showUserModal.value = true
}

const deleteUser = async () => {
	if (confirm('Are you sure you want to delete this user?')) {
		await fetchAndSetUsers()
	}
}

const openUserDetail = async (user: User) => {
  detailLoading.value = true
  try {
    const data = await getUserById(user.id)
    detailUser.value = data
    showUserDetail.value = true
  } finally {
    detailLoading.value = false
  }
}

const handleSave = async (user: User) => {
  actionLoading.value = true
  try {
    await updateUser(user.id, user)
    await fetchAndSetUsers()
    showUserDetail.value = false
  } finally {
    actionLoading.value = false
  }
}

const handleBlock = async (user: User) => {
  actionLoading.value = true
  try {
    await toggleUserBlockStatus(user.id, !user.blockedAt)
    await fetchAndSetUsers()
    showUserDetail.value = false
  } finally {
    actionLoading.value = false
  }
}

const handleRoleChange = async (user: User) => {
  actionLoading.value = true
  try {
    await changeUserRole(user.id, user.role)
    await fetchAndSetUsers()
    showUserDetail.value = false
  } finally {
    actionLoading.value = false
  }
}

// Hàm fetch users kèm filter/search/pagination
async function fetchAndSetUsers() {
	const criteria: any = {}
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

// Theo dõi thay đổi filter/search/pagination để fetch lại
watch([searchQuery, selectedRole, page, size], fetchAndSetUsers)
</script>

<template>
	<DashboardLayout title="Users" subtitle="Manage system users and their permissions">
		<template #actions>
			<button v-if="authStore.hasRole('ADMIN')" @click="openCreateUserModal" class="btn btn-primary">
				<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					<path d="M12 5l0 14" />
					<path d="M5 12l14 0" />
				</svg>
				Add User
			</button>
		</template>

		<div class="row row-cards">
			<div class="col-12">
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">Users Management</h3>
						<div class="card-actions">
							<div class="d-flex">
								<input type="search" class="form-control me-3" placeholder="Search users..." aria-label="Search users" v-model="searchQuery">
								<select class="form-select w-auto" v-model="selectedRole">
									<option value="">All Roles</option>
									<option value="admin">Admin</option>
									<option value="manager">Manager</option>
									<option value="user">User</option>
								</select>
							</div>
						</div>
					</div>
					<div class="table-responsive">
						<table class="table table-vcenter table-mobile-md card-table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>Role</th>
									<th>Status</th>
									<th>Phone</th>
									<th>Email Verified</th>
									<th>Created</th>
									<th class="w-1">Actions</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="user in users" :key="user.id">
									<td data-label="Name">
										<div class="d-flex py-1 align-items-center">
											<span class="avatar me-2" :style="`background-image: url(https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)})`"></span>
											<div class="flex-fill">
												<div class="font-weight-medium">{{ user.name }} {{ user.lastName }}</div>
												<div class="text-secondary">ID: {{ user.id }}</div>
											</div>
										</div>
									</td>
									<td data-label="Email">
										<div>{{ user.email }}</div>
									</td>
									<td data-label="Role">
										<span class="badge">{{ user.role }}</span>
									</td>
									<td data-label="Status">
										<span class="badge" :class="{
											'bg-success': !user.blockedAt,
											'bg-secondary': user.blockedAt
										}">{{ !user.blockedAt ? 'Active' : 'Inactive' }}</span>
									</td>
									<td data-label="Phone">
										<div>{{ user.phoneNumber }}</div>
									</td>
									<td data-label="Email Verified">
										<span class="badge" :class="{
											'bg-success': user.emailVerifiedAt,
											'bg-secondary': !user.emailVerifiedAt
										}">{{ user.emailVerifiedAt ? 'Yes' : 'No' }}</span>
									</td>
									<td data-label="Created">
										<div>{{ user.createdAt }}</div>
									</td>
									<td>
										<div class="btn-list flex-nowrap">
											<button class="btn btn-sm" @click.prevent="openUserDetail(user)" title="View detail">
												<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
													<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
													<circle cx="12" cy="12" r="2" />
													<path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" />
												</svg>
											</button>
											<a href="#" class="btn btn-sm" @click.prevent="openEditUserModal(user)">
												Edit
											</a>
											<div class="dropdown">
												<button class="btn btn-sm dropdown-toggle align-text-top" data-bs-toggle="dropdown">
													Actions
												</button>
												<div class="dropdown-menu dropdown-menu-end">
													<a class="dropdown-item" href="#" @click.prevent="openEditUserModal(user)">
														<svg xmlns="http://www.w3.org/2000/svg" class="icon dropdown-item-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
															<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
															<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
															<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
															<path d="M16 5l3 3" />
														</svg>
														Edit
													</a>
													<a class="dropdown-item" href="#" @click.prevent="deleteUser()">
														<svg xmlns="http://www.w3.org/2000/svg" class="icon dropdown-item-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
															<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
															<path d="M4 7l16 0" />
															<path d="M10 11l0 6" />
															<path d="M14 11l0 6" />
															<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
															<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
														</svg>
														Delete
													</a>
												</div>
											</div>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="card-footer d-flex align-items-center">
						<p class="m-0 text-secondary">Showing <span>{{ (page-1)*size+1 }}</span> to <span>{{ Math.min(page*size, total) }}</span> of <span>{{ total }}</span> entries</p>
						<ul class="pagination m-0 ms-auto">
							<li class="page-item" :class="{ disabled: page === 1 }">
								<a class="page-link" href="#" tabindex="-1" aria-disabled="true" @click.prevent="page > 1 && (page = page - 1)">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
										<path d="M15 6l-6 6l6 6" />
									</svg>
									prev
								</a>
							</li>
							<li v-for="p in pages" :key="p" class="page-item" :class="{ active: page === p }">
								<a class="page-link" href="#" @click.prevent="page = p">{{ p }}</a>
							</li>
							<li class="page-item" :class="{ disabled: page === pages }">
								<a class="page-link" href="#" @click.prevent="page < pages && (page = page + 1)">
									next
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
										<path d="M9 6l6 6l-6 6" />
									</svg>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<UserDetailModal
			:isOpen="showUserDetail"
			:user="detailUser"
			:loading="detailLoading || actionLoading"
			@close="showUserDetail = false"
			@save="handleSave"
			@block="handleBlock"
			@roleChange="handleRoleChange"
		/>
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