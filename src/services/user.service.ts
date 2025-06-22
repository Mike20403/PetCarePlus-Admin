import axios from '@/axios';
import type { User } from '@/types/api';

export const userService = {
	getAllUsers(params?: any) {
		return axios.get('/api/users', { params });
	},
	getUserById(id: string) {
		return axios.get(`/api/users/${id}`);
	},
	createUser(user: User) {
		return axios.post('/api/users', user);
	},
	updateUser(id: string, user: User) {
		return axios.put(`/api/users/${id}`, user);
	},
	deleteUser(id: string) {
		return axios.delete(`/api/users/${id}`);
	},
	getAllRoles() {
		return axios.get('/api/roles'); // Assuming an API endpoint for roles
	}
};