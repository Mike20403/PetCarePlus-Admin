<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const settings = ref({
	appName: 'PetCare+ Admin',
	appVersion: '1.0.0',
	enableNotifications: true,
	enableEmailAlerts: false,
	timezone: 'UTC',
	language: 'en',
	maxFileSize: 10,
	sessionTimeout: 30,
	twoFactorAuth: false,
	maintenanceMode: false
})

const saving = ref(false)

const saveGeneralSettings = async () => {
	saving.value = true
	// Simulate API call
	setTimeout(() => {
		saving.value = false
		alert('General settings saved successfully!')
	}, 1000)
}

const saveSecuritySettings = async () => {
	saving.value = true
	// Simulate API call
	setTimeout(() => {
		saving.value = false
		alert('Security settings saved successfully!')
	}, 1000)
}

const saveSystemSettings = async () => {
	saving.value = true
	// Simulate API call
	setTimeout(() => {
		saving.value = false
		alert('System settings saved successfully!')
	}, 1000)
}

onMounted(() => {
	// Initialize settings data
	console.log('Settings view mounted')
})
</script>

<template>
	<DashboardLayout title="Settings" subtitle="Configure application settings and preferences">
		<div class="row row-cards">
			<!-- General Settings -->
			<div class="col-12">
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">General Settings</h3>
					</div>
					<div class="card-body">
						<form @submit.prevent="saveGeneralSettings">
							<div class="row mb-3">
								<div class="col-md-6">
									<label class="form-label">Application Name</label>
									<input type="text" v-model="settings.appName" class="form-control" required>
								</div>
								<div class="col-md-6">
									<label class="form-label">Application Version</label>
									<input type="text" v-model="settings.appVersion" class="form-control" readonly>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-md-6">
									<label class="form-label">Timezone</label>
									<select v-model="settings.timezone" class="form-select">
										<option value="UTC">UTC</option>
										<option value="America/New_York">Eastern Time</option>
										<option value="America/Chicago">Central Time</option>
										<option value="America/Denver">Mountain Time</option>
										<option value="America/Los_Angeles">Pacific Time</option>
									</select>
								</div>
								<div class="col-md-6">
									<label class="form-label">Language</label>
									<select v-model="settings.language" class="form-select">
										<option value="en">English</option>
										<option value="es">Spanish</option>
										<option value="fr">French</option>
										<option value="de">German</option>
									</select>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-md-6">
									<div class="form-check form-switch">
										<input class="form-check-input" type="checkbox" v-model="settings.enableNotifications" id="enableNotifications">
										<label class="form-check-label" for="enableNotifications">
											Enable Push Notifications
										</label>
									</div>
								</div>
								<div class="col-md-6">
									<div class="form-check form-switch">
										<input class="form-check-input" type="checkbox" v-model="settings.enableEmailAlerts" id="enableEmailAlerts">
										<label class="form-check-label" for="enableEmailAlerts">
											Enable Email Alerts
										</label>
									</div>
								</div>
							</div>
							<button type="submit" class="btn btn-primary" :disabled="saving">
								<span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
								Save General Settings
							</button>
						</form>
					</div>
				</div>
			</div>

			<!-- Security Settings -->
			<div class="col-12 mt-4">
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">Security Settings</h3>
					</div>
					<div class="card-body">
						<form @submit.prevent="saveSecuritySettings">
							<div class="row mb-3">
								<div class="col-md-6">
									<label class="form-label">Session Timeout (minutes)</label>
									<input type="number" v-model="settings.sessionTimeout" class="form-control" min="5" max="480" required>
								</div>
								<div class="col-md-6">
									<label class="form-label">Maximum File Upload Size (MB)</label>
									<input type="number" v-model="settings.maxFileSize" class="form-control" min="1" max="100" required>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-md-6">
									<div class="form-check form-switch">
										<input class="form-check-input" type="checkbox" v-model="settings.twoFactorAuth" id="twoFactorAuth">
										<label class="form-check-label" for="twoFactorAuth">
											Enable Two-Factor Authentication
										</label>
									</div>
								</div>
							</div>
							<button type="submit" class="btn btn-primary" :disabled="saving">
								<span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
								Save Security Settings
							</button>
						</form>
					</div>
				</div>
			</div>

			<!-- System Settings -->
			<div class="col-12 mt-4">
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">System Settings</h3>
					</div>
					<div class="card-body">
						<form @submit.prevent="saveSystemSettings">
							<div class="row mb-3">
								<div class="col-md-6">
									<div class="form-check form-switch">
										<input class="form-check-input" type="checkbox" v-model="settings.maintenanceMode" id="maintenanceMode">
										<label class="form-check-label" for="maintenanceMode">
											Maintenance Mode
										</label>
									</div>
									<div class="form-text">When enabled, the application will show a maintenance page to users</div>
								</div>
							</div>
							<button type="submit" class="btn btn-primary" :disabled="saving">
								<span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
								Save System Settings
							</button>
						</form>
					</div>
				</div>
			</div>

			<!-- System Information -->
			<div class="col-12 mt-4">
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">System Information</h3>
					</div>
					<div class="card-body">
						<div class="row">
							<div class="col-md-6">
								<div class="mb-3">
									<label class="form-label">Application Version</label>
									<input type="text" :value="settings.appVersion" class="form-control" readonly>
								</div>
								<div class="mb-3">
									<label class="form-label">Environment</label>
									<input type="text" value="Production" class="form-control" readonly>
								</div>
							</div>
							<div class="col-md-6">
								<div class="mb-3">
									<label class="form-label">Database Status</label>
									<div class="input-group">
										<input type="text" value="Connected" class="form-control" readonly>
										<span class="input-group-text">
											<span class="status status-green"></span>
										</span>
									</div>
								</div>
								<div class="mb-3">
									<label class="form-label">Last Backup</label>
									<input type="text" value="2024-01-15 03:00 AM" class="form-control" readonly>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</DashboardLayout>
</template>

<style scoped>
.status {
	width: 8px;
	height: 8px;
	border-radius: 50%;
}

.status-green {
	background-color: var(--tblr-green);
}

.form-check-input:checked {
	background-color: var(--tblr-primary);
	border-color: var(--tblr-primary);
}

.spinner-border-sm {
	width: 1rem;
	height: 1rem;
}
</style>