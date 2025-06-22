import axios from '@/axios';
import type { ApiResponse } from '@/types/api';

export interface AppSettings {
	generalSetting1: string;
	generalSetting2: boolean;
	emailSetting1: string;
	emailSetting2: number;
	apiKey: string;
	systemVersion: string;
}

export const settingsService = {
	async getSettings(): Promise<ApiResponse<AppSettings>> {
		try {
			const response = await axios.get<ApiResponse<AppSettings>>(`/api/settings`);
			return response.data;
		} catch (error: any) {
			return { success: false, message: error.response?.data?.message || 'Failed to fetch settings', data: undefined };
		}
	},

	async updateSettings(settings: AppSettings): Promise<ApiResponse<AppSettings>> {
		try {
			const response = await axios.put<ApiResponse<AppSettings>>(`/api/settings`, settings);
			return response.data;
		} catch (error: any) {
			return { success: false, message: error.response?.data?.message || 'Failed to update settings', data: undefined };
		}
	},
};