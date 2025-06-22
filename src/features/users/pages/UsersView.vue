<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import DataTable from '@/components/DataTable.vue';
import Modal from '@/components/Modal.vue';
import ConfirmationDialog from '@/components/ConfirmationDialog.vue';
import UserFormModal from '@/components/UserFormModal.vue';
import { useNotificationStore } from '@/stores/notification';
import { userService, type User, type ListResponse, type PaginationParams } from '@/services';
import { useAuthStore } from '@/stores/auth';

const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const users = ref<User[]>([]);
const totalUsers = ref(0);
const loading = ref(false);
const showUserModal = ref(false);
const showDeleteConfirm = ref(false);
const currentUser = ref<User | null>(null);
const userToDelete = ref<User | null>(null);

const pagination = ref<PaginationParams>({
	page: 1,
	size: 10,
	sort: 'createdAt',
	direction: 'desc',
});
const searchQuery = ref('');

const headers = [
	{ text: 'Name', value: 'name', sortable: true },
	{ text: 'Email', value: 'email', sortable: true },
	{ text: 'Role', value: 'role.name', sortable: true },
	{ text: 'Created At', value: 'createdAt', sortable: true },
	{ text: 'Actions', value: 'actions', sortable: false },
];

const fetchUsers = async () => {
	loading.value = true;
	try {
		const params = {
			...pagination.value,
			search: searchQuery.value,
		};
		const response: ListResponse<User> = await userService.getAllUsers(params);
		users.value = response.data.data;
		totalUsers.value = response.data.pagination?.total || 0;
	} catch (error) {
		notificationStore.showNotification('Failed to fetch users.', 'error');
		console.error('Failed to fetch users:', error);
	} finally {
		loading.value = false;
	}
};

const handlePageChange = (page: number) => {
	pagination.value.page = page;
	fetchUsers();
};

const handleSortChange = (sort: string, direction: 'asc' | 'desc') => {
	pagination.value.sort = sort;
	pagination.value.direction = direction;
	fetchUsers();
};

const handleSearch = (query: string) => {
	searchQuery.value = query;
	pagination.value.page = 1; // Reset to first page on new search
	fetchUsers();
};

const openCreateUserModal = () => {
	currentUser.value = null;
	showUserModal.value = true;
};

const openEditUserModal = (user: User) => {
	currentUser.value = user;
	showUserModal.value = true;
};

const confirmDeleteUser = (user: User) => {
	userToDelete.value = user;
	showDeleteConfirm.value = true;
};

const deleteUser = async () => {
	if (userToDelete.value) {
		try {
			await userService.deleteUser(userToDelete.value.id.toString());
			notificationStore.showNotification('User deleted successfully!', 'success');
			fetchUsers();
		} catch (error: any) {
			const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
			notificationStore.showNotification(errorMessage, 'error');
			console.error('Failed to delete user:', error);
		} finally {
			showDeleteConfirm.value = false;
			userToDelete.value = null;
		}
	}
};

onMounted(fetchUsers);
</script>

<template>
	<div class="container mx-auto p-4">
		<h1 class="text-2xl font-bold mb-4">User Management</h1>

		<div class="flex justify-end mb-4" v-if="authStore.hasPermission('users:create')">
			<button @click="openCreateUserModal"
				class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
				Add New User
			</button>
		</div>

		<DataTable :headers="headers" :items="users" :total-items="totalUsers" :items-per-page="pagination.size"
			:current-page="pagination.page" :loading="loading" :sort-by="pagination.sort"
			:sort-direction="pagination.direction" @page-change="handlePageChange" @sort-change="handleSortChange"
			@search="handleSearch">
			<template #item-actions="{ item }">
				<button v-if="authStore.hasPermission('users:update')" @click="openEditUserModal(item)"
					class="text-indigo-600 hover:text-indigo-900 mr-2">
					Edit
				</button>
				<button v-if="authStore.hasPermission('users:delete')" @click="confirmDeleteUser(item)"
					class="text-red-600 hover:text-red-900">
					Delete
				</button>
			</template>
		</DataTable>

		<UserFormModal :show="showUserModal" :user="currentUser" @close="showUserModal = false" @success="fetchUsers" />

		<ConfirmationDialog :show="showDeleteConfirm" title="Delete User"
			message="Are you sure you want to delete this user? This action cannot be undone."
			confirm-button-text="Delete" cancel-button-text="Cancel" @confirm="deleteUser"
			@cancel="showDeleteConfirm = false" />
	</div>
</template>