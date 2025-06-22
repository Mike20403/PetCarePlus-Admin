<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { settingsService, type AppSettings } from '@/services';
import FormInput from '@/components/forms/FormInput.vue';
import FormCheckbox from '@/components/forms/FormCheckbox.vue';
import FormSelect from '@/components/forms/FormSelect.vue';
import { useNotificationStore } from '@/stores/notification';

const notificationStore = useNotificationStore();

const settings = ref<AppSettings>({
	generalSetting1: '',
	generalSetting2: false,
	emailSetting1: '',
	emailSetting2: 0,
	apiKey: '',
	systemVersion: 'Loading...',
});

const loading = ref(true);

const fetchSettings = async () => {
	loading.value = true;
	const response = await settingsService.getSettings();
	if (response.success && response.data) {
		settings.value = response.data;
	} else {
		notificationStore.showNotification('Failed to fetch settings: ' + response.message, 'error');
	}
	loading.value = false;
};

const saveSettings = async () => {
	const response = await settingsService.updateSettings(settings.value);
	if (response.success) {
		notificationStore.showNotification('Settings updated successfully!', 'success');
	} else {
		notificationStore.showNotification('Failed to update settings: ' + response.message, 'error');
	}
};

onMounted(fetchSettings);
</script>

<template>
	<div class="container-xl">
		<div class="page-header d-print-none">
			<div class="row align-items-center">
				<div class="col">
					<h2 class="page-title">Application Settings</h2>
				</div>
			</div>
		</div>
		<div class="page-body">
			<div class="card">
				<div class="card-header">
					<h3 class="card-title">General Settings</h3>
				</div>
				<div class="card-body">
					<form @submit.prevent="saveSettings">
						<div class="mb-3">
							<FormInput id="generalSetting1" label="General Setting 1" type="text"
								v-model="settings.generalSetting1" placeholder="Enter general setting 1" required />
						</div>
						<div class="mb-3">
							<FormCheckbox id="generalSetting2" label="General Setting 2"
								v-model="settings.generalSetting2" />
						</div>
						<button type="submit" class="btn btn-primary">Save General Settings</button>
					</form>
				</div>
			</div>

			<div class="card mt-4">
				<div class="card-header">
					<h3 class="card-title">Email Settings</h3>
				</div>
				<div class="card-body">
					<form @submit.prevent="saveSettings">
						<div class="mb-3">
							<FormInput id="emailSetting1" label="Email Setting 1" type="email"
								v-model="settings.emailSetting1" placeholder="Enter email setting 1" required />
						</div>
						<div class="mb-3">
							<FormSelect id="emailSetting2" label="Email Setting 2"
								v-model.number="settings.emailSetting2" :options="[
									{ value: 1, text: 'Option 1' },
									{ value: 2, text: 'Option 2' },
								]" required />
						</div>
						<button type="submit" class="btn btn-primary">Save Email Settings</button>
					</form>
				</div>
			</div>

			<div class="card mt-4">
				<div class="card-header">
					<h3 class="card-title">API Key Management</h3>
				</div>
				<div class="card-body">
					<form @submit.prevent="saveSettings">
						<div class="mb-3">
							<FormInput id="apiKey" label="API Key" type="text" v-model="settings.apiKey"
								placeholder="Enter API Key" required />
						</div>
						<button type="submit" class="btn btn-primary">Save API Key</button>
					</form>
				</div>
			</div>

			<div class="card mt-4">
				<div class="card-header">
					<h3 class="card-title">System Information</h3>
				</div>
				<div class="card-body">
					<p><strong>System Version:</strong> {{ settings.systemVersion }}</p>
					<p v-if="loading">Loading system info...</p>
				</div>
			</div>
		</div>
	</div>
</template>