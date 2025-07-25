import axios, { type AxiosError } from 'axios';
import type { ApiResponse } from '@/types/common';

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
		} catch (error: unknown) {
			const axiosError = error as AxiosError;
			return {
				success: false,
				message: (axiosError.response?.data as { message: string })?.message || 'Failed to fetch settings',
				data: {} as AppSettings
			};
		}
	},

	async updateSettings(settings: AppSettings): Promise<ApiResponse<AppSettings>> {
		try {
			const response = await axios.put<ApiResponse<AppSettings>>(`/api/settings`, settings);
			return response.data;
		} catch (error: unknown) {
			const axiosError = error as AxiosError;
			return {
				success: false,
				message: (axiosError.response?.data as { message: string })?.message || 'Failed to update settings',
				data: {} as AppSettings
			};
		}
	},
};