<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Modal from './Modal.vue';
import FormInput from './forms/FormInput.vue';
import FormSelect from './forms/FormSelect.vue';
import { useNotificationStore } from '@/stores/notification';
import { userService, type User, type UserRequest, type Role } from '@/services';

const props = defineProps<{
	show: boolean;
	user: User | null;
}>();

const emit = defineEmits(['close', 'success']);

const notificationStore = useNotificationStore();

const defaultUserForm: UserRequest = {
	name: '',
	email: '',
	password: '',
	roleId: 0,
};

const userForm = ref<UserRequest>({ ...defaultUserForm });
const roles = ref<Role[]>([]);
const errors = ref<Record<string, string>>({});

const isEditMode = computed(() => !!props.user);
const modalTitle = computed(() => (isEditMode.value ? 'Edit User' : 'Create User'));

watch(
	() => props.show,
	async (newVal) => {
		if (newVal) {
			await fetchRoles();
			if (props.user) {
				userForm.value = {
					name: props.user.name,
					email: props.user.email,
					roleId: props.user.role.id,
					password: '', // Password should not be pre-filled for security
				};
			} else {
				userForm.value = { ...defaultUserForm };
			}
			errors.value = {};
		}
	},
);

const fetchRoles = async () => {
	try {
		const response = await userService.getAllRoles();
		roles.value = response.data.data;
	} catch (error) {
		notificationStore.showNotification('Failed to fetch roles.', 'error');
		console.error('Failed to fetch roles:', error);
	}
};

const validateForm = () => {
	errors.value = {};
	if (!userForm.value.name) {
		errors.value.name = 'Name is required.';
	}
	if (!userForm.value.email) {
		errors.value.email = 'Email is required.';
	} else if (!/\S+@\S+\.\S+/.test(userForm.value.email)) {
		errors.value.email = 'Email is invalid.';
	}
	if (!isEditMode.value && !userForm.value.password) {
		errors.value.password = 'Password is required for new users.';
	}
	if (!userForm.value.roleId) {
		errors.value.roleId = 'Role is required.';
	}
	return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
	if (!validateForm()) {
		return;
	}

	try {
		if (isEditMode.value && props.user) {
			await userService.updateUser(props.user.id.toString(), userForm.value);
			notificationStore.showNotification('User updated successfully!', 'success');
		} else {
			await userService.createUser(userForm.value);
			notificationStore.showNotification('User created successfully!', 'success');
		}
		emit('success');
		emit('close');
	} catch (error: any) {
		const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
		notificationStore.showNotification(errorMessage, 'error');
		console.error('User operation failed:', error);
	}
};

const close = () => {
	emit('close');
};
</script>

<template>
	<Modal :show="show" :title="modalTitle" @close="close">
		<form @submit.prevent="handleSubmit">
			<div class="space-y-4">
				<FormInput id="name" label="Name" v-model="userForm.name" :error="errors.name" />
				<FormInput id="email" label="Email" type="email" v-model="userForm.email" :error="errors.email" />
				<FormInput v-if="!isEditMode" id="password" label="Password" type="password" v-model="userForm.password"
					:error="errors.password" />
				<FormSelect id="role" label="Role" v-model="userForm.roleId"
					:options="roles.map(role => ({ value: role.id, label: role.name }))" :error="errors.roleId" />
			</div>
			<div class="mt-6 flex justify-end space-x-3">
				<button type="button"
					class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					@click="close">
					Cancel
				</button>
				<button type="submit"
					class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					{{ isEditMode ? 'Update' : 'Create' }}
				</button>
			</div>
		</form>
	</Modal>
</template>