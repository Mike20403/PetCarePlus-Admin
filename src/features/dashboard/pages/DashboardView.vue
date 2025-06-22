<template>
	<div class="container-xl">
		<div class="page-header d-print-none">
			<div class="row g-2 align-items-center">
				<div class="col">
					<h2 class="page-title">Dashboard</h2>
					<div class="text-secondary mt-1">Welcome to PetCare+ Admin Dashboard</div>
				</div>
			</div>
		</div>

		<div class="page-body">
			<!-- Stats Cards -->
			<div class="row row-deck row-cards">
				<div class="col-sm-6 col-lg-3">
					<div class="card">
						<div class="card-body">
							<div class="d-flex align-items-center">
								<div class="subheader">Total Pets</div>
							</div>
							<div class="h1 mb-3">{{ stats.totalPets.toLocaleString() }}</div>
							<div class="d-flex mb-2">
								<div class="text-green d-inline-flex align-items-center lh-1">
									8%
									<svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="m0 0h24v24H0z" fill="none" />
										<path d="M3 17l6 -6l4 4l8 -8" />
										<path d="M14 7l7 0l0 7" />
									</svg>
								</div>
								<div class="ms-auto">
									<span class="text-secondary">Since last month</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-sm-6 col-lg-3">
					<div class="card">
						<div class="card-body">
							<div class="d-flex align-items-center">
								<div class="subheader">Appointments Today</div>
							</div>
							<div class="h1 mb-3">{{ stats.totalAppointments }}</div>
							<div class="d-flex mb-2">
								<div class="text-yellow d-inline-flex align-items-center lh-1">
									12%
									<svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="m0 0h24v24H0z" fill="none" />
										<path d="M3 17l6 -6l4 4l8 -8" />
										<path d="M14 7l7 0l0 7" />
									</svg>
								</div>
								<div class="ms-auto">
									<span class="text-secondary">Since yesterday</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-sm-6 col-lg-3">
					<div class="card">
						<div class="card-body">
							<div class="d-flex align-items-center">
								<div class="subheader">Total Customers</div>
							</div>
							<div class="h1 mb-3">{{ stats.totalCustomers.toLocaleString() }}</div>
							<div class="d-flex mb-2">
								<div class="text-green d-inline-flex align-items-center lh-1">
									5%
									<svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="m0 0h24v24H0z" fill="none" />
										<path d="M3 17l6 -6l4 4l8 -8" />
										<path d="M14 7l7 0l0 7" />
									</svg>
								</div>
								<div class="ms-auto">
									<span class="text-secondary">Since last month</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-sm-6 col-lg-3">
					<div class="card">
						<div class="card-body">
							<div class="d-flex align-items-center">
								<div class="subheader">Monthly Revenue</div>
							</div>
							<div class="h1 mb-3">${{ stats.monthlyRevenue.toLocaleString() }}</div>
							<div class="d-flex mb-2">
								<div class="text-green d-inline-flex align-items-center lh-1">
									15%
									<svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24"
										viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
										stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="m0 0h24v24H0z" fill="none" />
										<path d="M3 17l6 -6l4 4l8 -8" />
										<path d="M14 7l7 0l0 7" />
									</svg>
								</div>
								<div class="ms-auto">
									<span class="text-secondary">Since last month</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Charts -->
			<div class="row row-cards mt-4">
				<div class="col-lg-6">
					<div class="card">
						<div class="card-header">
							<h3 class="card-title">Monthly Appointments</h3>
						</div>
						<div class="card-body">
							<LineChart :labels="monthlyAppointmentsChart.labels" :data="monthlyAppointmentsChart.data"
								label="Appointments" title="Monthly Appointments" />
						</div>
					</div>
				</div>
				<div class="col-lg-6">
					<div class="card">
						<div class="card-header">
							<h3 class="card-title">Monthly Revenue</h3>
						</div>
						<div class="card-body">
							<LineChart :labels="monthlyRevenueChart.labels" :data="monthlyRevenueChart.data"
								label="Revenue" title="Monthly Revenue" />
						</div>
					</div>
				</div>
			</div>

			<!-- Recent Activity -->
			<div class="row row-cards mt-4">
				<div class="col-12">
					<div class="card">
						<div class="card-header">
							<h3 class="card-title">Recent Appointments</h3>
						</div>
						<div class="card-body">
							<div class="table-responsive">
								<table class="table table-vcenter card-table">
									<thead>
										<tr>
											<th>Pet Name</th>
											<th>Owner</th>
											<th>Service</th>
											<th>Time</th>
											<th>Status</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="appointment in recentAppointments" :key="appointment.id">
											<td>{{ appointment.petName }}</td>
											<td>{{ appointment.owner }}</td>
											<td>{{ appointment.service }}</td>
											<td>{{ appointment.time }}</td>
											<td>
												<span class="badge" :class="{
													'bg-success': appointment.status === 'Completed',
													'bg-warning': appointment.status === 'In Progress',
													'bg-info': appointment.status === 'Scheduled'
												}">
													{{ appointment.status }}
												</span>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LineChart from '@/components/LineChart.vue'
import {
	getDashboardStats,
	getMonthlyAppointments,
	getMonthlyRevenue
} from '@/services/dashboard.service'

interface DashboardStats {
	totalPets: number
	totalAppointments: number
	totalCustomers: number
	monthlyRevenue: number
}

interface Appointment {
	id: number
	petName: string
	owner: string
	service: string
	time: string
	status: 'Completed' | 'In Progress' | 'Scheduled'
}

const stats = ref<DashboardStats>({
	totalPets: 0,
	totalAppointments: 0,
	totalCustomers: 0,
	monthlyRevenue: 0
})

const monthlyAppointmentsChart = ref({
	labels: [] as string[],
	data: [] as number[]
})

const monthlyRevenueChart = ref({
	labels: [] as string[],
	data: [] as number[]
})

const recentAppointments = ref<Appointment[]>([])

onMounted(async () => {
	// Directly use mock data since backend is not running
	stats.value = {
		totalPets: 1247,
		totalAppointments: 89,
		totalCustomers: 523,
		monthlyRevenue: 45678
	}

	monthlyAppointmentsChart.value = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
		data: [65, 59, 80, 81, 56, 55, 40]
	}

	monthlyRevenueChart.value = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
		data: [10000, 12000, 15000, 13000, 16000, 14000, 18000]
	}

	recentAppointments.value = [
		{
			id: 1,
			petName: 'Buddy',
			owner: 'John Smith',
			service: 'Vaccination',
			time: '10:30 AM',
			status: 'Completed'
		},
		{
			id: 2,
			petName: 'Luna',
			owner: 'Sarah Johnson',
			service: 'Grooming',
			time: '2:00 PM',
			status: 'In Progress'
		},
		{
			id: 3,
			petName: 'Max',
			owner: 'Mike Davis',
			service: 'Check-up',
			time: '3:30 PM',
			status: 'Scheduled'
		}
	]
})
</script>

<style scoped>
.subheader {
	font-size: 0.875rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: var(--tblr-secondary);
}

.h1 {
	font-weight: 700;
	color: var(--tblr-dark);
}

.card {
	box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
	border: 1px solid rgba(0, 0, 0, 0.125);
	transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.badge {
	font-size: 0.75rem;
	font-weight: 500;
	padding: 0.375rem 0.75rem;
}
</style>