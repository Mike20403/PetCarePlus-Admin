<template>
	<DashboardLayout title="Profile" subtitle="Manage your account settings and preferences">
		<div class="row row-cards">
			<!-- Profile Information -->
			<div class="col-lg-8">
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">Profile Information</h3>
					</div>
					<div class="card-body">
						<form @submit.prevent="saveProfile">
							<div class="row mb-4">
								<div class="col-auto">
									<div class="avatar avatar-xl" :style="`background-image: url(${profile.avatar})`"></div>
								</div>
								<div class="col">
									<div class="mb-2">
										<label class="form-label">Profile Picture</label>
									</div>
									<input type="file" class="form-control" accept="image/*" @change="uploadAvatar">
									<small class="form-hint">JPG, PNG or GIF. Max size 2MB.</small>
								</div>
							</div>
							
							<div class="row mb-3">
								<div class="col-md-6">
									<label class="form-label">First Name</label>
									<input type="text" v-model="profile.firstName" class="form-control" required>
								</div>
								<div class="col-md-6">
									<label class="form-label">Last Name</label>
									<input type="text" v-model="profile.lastName" class="form-control" required>
								</div>
							</div>
							
							<div class="row mb-3">
								<div class="col-md-6">
									<label class="form-label">Email</label>
									<input type="email" v-model="profile.email" class="form-control" required>
								</div>
								<div class="col-md-6">
									<label class="form-label">Phone</label>
									<input type="tel" v-model="profile.phone" class="form-control">
								</div>
							</div>
							
							<div class="row mb-3">
								<div class="col-md-6">
									<label class="form-label">Role</label>
									<input type="text" v-model="profile.role" class="form-control" readonly>
								</div>
								<div class="col-md-6">
									<label class="form-label">Department</label>
									<input type="text" v-model="profile.department" class="form-control">
								</div>
							</div>
							
							<div class="mb-3">
								<label class="form-label">Bio</label>
								<textarea v-model="profile.bio" class="form-control" rows="3" placeholder="Tell us about yourself..."></textarea>
							</div>
							
							<button type="submit" class="btn btn-primary" :disabled="saving">
								<span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
								Save Profile
							</button>
						</form>
					</div>
				</div>
			</div>

			<!-- Preferences -->
			<div class="col-lg-4">
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">Preferences</h3>
					</div>
					<div class="card-body">
						<form @submit.prevent="saveProfile">
							<div class="mb-3">
								<label class="form-label">Timezone</label>
								<select v-model="profile.timezone" class="form-select">
									<option value="America/New_York">Eastern Time</option>
									<option value="America/Chicago">Central Time</option>
									<option value="America/Denver">Mountain Time</option>
									<option value="America/Los_Angeles">Pacific Time</option>
									<option value="UTC">UTC</option>
								</select>
							</div>
							
							<div class="mb-3">
								<label class="form-label">Language</label>
								<select v-model="profile.language" class="form-select">
									<option value="en">English</option>
									<option value="es">Spanish</option>
									<option value="fr">French</option>
									<option value="de">German</option>
								</select>
							</div>
							
							<div class="mb-3">
								<label class="form-label">Notifications</label>
								<div class="form-check form-switch mb-2">
									<input class="form-check-input" type="checkbox" v-model="profile.notifications.email" id="emailNotifications">
									<label class="form-check-label" for="emailNotifications">
										Email Notifications
									</label>
								</div>
								<div class="form-check form-switch mb-2">
									<input class="form-check-input" type="checkbox" v-model="profile.notifications.push" id="pushNotifications">
									<label class="form-check-label" for="pushNotifications">
										Push Notifications
									</label>
								</div>
								<div class="form-check form-switch">
									<input class="form-check-input" type="checkbox" v-model="profile.notifications.sms" id="smsNotifications">
									<label class="form-check-label" for="smsNotifications">
										SMS Notifications
									</label>
								</div>
							</div>
							
							<button type="submit" class="btn btn-primary w-100" :disabled="saving">
								<span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
								Save Preferences
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
						<form @submit.prevent="changePassword">
							<div class="row mb-3">
								<div class="col-md-4">
									<label class="form-label">Current Password</label>
									<input type="password" v-model="security.currentPassword" class="form-control" required>
								</div>
								<div class="col-md-4">
									<label class="form-label">New Password</label>
									<input type="password" v-model="security.newPassword" class="form-control" required minlength="8">
								</div>
								<div class="col-md-4">
									<label class="form-label">Confirm New Password</label>
									<input type="password" v-model="security.confirmPassword" class="form-control" required minlength="8">
								</div>
							</div>
							<button type="submit" class="btn btn-warning" :disabled="passwordChanging">
								<span v-if="passwordChanging" class="spinner-border spinner-border-sm me-2" role="status"></span>
								Change Password
							</button>
						</form>
					</div>
				</div>
			</div>

			<!-- Activity Log -->
			<div class="col-12 mt-4">
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">Recent Activity</h3>
					</div>
					<div class="card-body">
						<div class="table-responsive">
							<table class="table table-vcenter">
								<thead>
									<tr>
										<th>Action</th>
										<th>Date & Time</th>
										<th>IP Address</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Login</td>
										<td>2024-01-15 09:30 AM</td>
										<td>192.168.1.100</td>
										<td><span class="badge bg-green">Success</span></td>
									</tr>
									<tr>
										<td>Profile Updated</td>
										<td>2024-01-14 02:15 PM</td>
										<td>192.168.1.100</td>
										<td><span class="badge bg-green">Success</span></td>
									</tr>
									<tr>
										<td>Password Changed</td>
										<td>2024-01-13 11:45 AM</td>
										<td>192.168.1.100</td>
										<td><span class="badge bg-green">Success</span></td>
									</tr>
									<tr>
										<td>Failed Login Attempt</td>
										<td>2024-01-12 08:20 AM</td>
										<td>203.0.113.45</td>
										<td><span class="badge bg-red">Failed</span></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const profile = ref({
	firstName: 'Admin',
	lastName: 'User',
	email: 'admin@petcareplus.com',
	phone: '+1 (555) 123-4567',
	role: 'Administrator',
	department: 'Management',
	bio: 'System administrator with 5+ years of experience in pet care management.',
	avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0d6efd&color=fff',
	timezone: 'America/New_York',
	language: 'en',
	notifications: {
		email: true,
		push: false,
		sms: true
	}
})

const security = ref({
	currentPassword: '',
	newPassword: '',
	confirmPassword: ''
})

const loading = ref(false)
const saving = ref(false)
const passwordChanging = ref(false)

const saveProfile = async () => {
	saving.value = true
	// Simulate API call
	setTimeout(() => {
		saving.value = false
		alert('Profile updated successfully!')
	}, 1000)
}

const changePassword = async () => {
	if (security.value.newPassword !== security.value.confirmPassword) {
		alert('New passwords do not match!')
		return
	}
	
	passwordChanging.value = true
	// Simulate API call
	setTimeout(() => {
		passwordChanging.value = false
		alert('Password changed successfully!')
		security.value = {
			currentPassword: '',
			newPassword: '',
			confirmPassword: ''
		}
	}, 1000)
}

const uploadAvatar = (event: Event) => {
	const input = event.target as HTMLInputElement
	if (input.files && input.files.length > 0) {
		const file = input.files[0]
		const reader = new FileReader()
		reader.onload = (e) => {
			if (e.target && e.target.result) {
				profile.value.avatar = e.target.result as string
			}
		}
		reader.readAsDataURL(file)
	}
}

onMounted(() => {
	// Initialize profile data
	console.log('Profile view mounted')
})
</script>

<style scoped>
.avatar-xl {
	width: 80px;
	height: 80px;
	background-size: cover;
	background-position: center;
	border-radius: 50%;
}

.form-check-input:checked {
	background-color: var(--tblr-primary);
	border-color: var(--tblr-primary);
}

.spinner-border-sm {
	width: 1rem;
	height: 1rem;
}

.badge {
	font-size: 0.75rem;
	padding: 0.25rem 0.5rem;
}
</style>