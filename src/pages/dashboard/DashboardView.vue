<template>
	<DashboardLayout title="Dashboard" subtitle="Welcome back to PetCare+ Admin">
		<div class="row row-deck row-cards">
			<!-- Stats Cards -->
			<div class="col-sm-6 col-lg-3">
				<div class="card">
					<div class="card-body">
						<div class="d-flex align-items-center">
							<div class="subheader">Total Revenue</div>
							<div class="ms-auto lh-1">
								<div class="dropdown">
									<a class="dropdown-toggle text-secondary" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Last 7 days</a>
									<div class="dropdown-menu dropdown-menu-end">
										<a class="dropdown-item active" href="#">Last 7 days</a>
										<a class="dropdown-item" href="#">Last 30 days</a>
										<a class="dropdown-item" href="#">Last 3 months</a>
									</div>
								</div>
							</div>
						</div>
						<div class="h1 mb-3">$4,300</div>
						<div class="d-flex mb-2">
							<div>Conversion rate</div>
							<div class="ms-auto">
								<span class="text-green d-inline-flex align-items-center lh-1">
									8% 
									<svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
										<path d="M3 17l6 -6l4 4l8 -8" />
										<path d="M14 7l7 0l0 7" />
									</svg>
								</span>
							</div>
						</div>
						<div class="progress progress-sm">
							<div class="progress-bar bg-primary" style="width: 75%" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" aria-label="75% Complete">
								<span class="visually-hidden">75% Complete</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="col-sm-6 col-lg-3">
				<div class="card">
					<div class="card-body">
						<div class="d-flex align-items-center">
							<div class="subheader">New Bookings</div>
							<div class="ms-auto lh-1">
								<div class="dropdown">
									<a class="dropdown-toggle text-secondary" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Last 7 days</a>
									<div class="dropdown-menu dropdown-menu-end">
										<a class="dropdown-item active" href="#">Last 7 days</a>
										<a class="dropdown-item" href="#">Last 30 days</a>
										<a class="dropdown-item" href="#">Last 3 months</a>
									</div>
								</div>
							</div>
						</div>
						<div class="d-flex align-items-baseline">
							<div class="h1 mb-3 me-2">84</div>
							<div class="me-auto">
								<span class="text-green d-inline-flex align-items-center lh-1">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-sm" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
										<path d="M3 17l6 -6l4 4l8 -8" />
										<path d="M14 7l7 0l0 7" />
									</svg>
									4%
								</span>
							</div>
						</div>
						<div id="chart-new-bookings" class="chart-sm"></div>
					</div>
				</div>
			</div>

			<div class="col-sm-6 col-lg-3">
				<div class="card">
					<div class="card-body">
						<div class="d-flex align-items-center">
							<div class="subheader">Active Users</div>
							<div class="ms-auto lh-1">
								<div class="dropdown">
									<a class="dropdown-toggle text-secondary" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Last 7 days</a>
									<div class="dropdown-menu dropdown-menu-end">
										<a class="dropdown-item active" href="#">Last 7 days</a>
										<a class="dropdown-item" href="#">Last 30 days</a>
										<a class="dropdown-item" href="#">Last 3 months</a>
									</div>
								</div>
							</div>
						</div>
						<div class="d-flex align-items-baseline">
							<div class="h1 mb-0 me-2">1,352</div>
							<div class="me-auto">
								<span class="text-yellow d-inline-flex align-items-center lh-1">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-sm" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
										<path d="M5 12l14 0" />
									</svg>
									0%
								</span>
							</div>
						</div>
					</div>
					<div id="chart-active-users" class="chart-sm"></div>
				</div>
			</div>

			<div class="col-sm-6 col-lg-3">
				<div class="card">
					<div class="card-body">
						<div class="d-flex align-items-center">
							<div class="subheader">Service Providers</div>
							<div class="ms-auto lh-1">
								<div class="dropdown">
									<a class="dropdown-toggle text-secondary" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Last 7 days</a>
									<div class="dropdown-menu dropdown-menu-end">
										<a class="dropdown-item active" href="#">Last 7 days</a>
										<a class="dropdown-item" href="#">Last 30 days</a>
										<a class="dropdown-item" href="#">Last 3 months</a>
									</div>
								</div>
							</div>
						</div>
						<div class="d-flex align-items-baseline">
							<div class="h1 mb-3 me-2">145</div>
							<div class="me-auto">
								<span class="text-red d-inline-flex align-items-center lh-1">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-sm" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
										<path d="M3 7l6 6l4 -4l8 8" />
										<path d="M21 10l0 7l-7 0" />
									</svg>
									-2%
								</span>
							</div>
						</div>
						<div id="chart-service-providers" class="chart-sm"></div>
					</div>
				</div>
			</div>

			<!-- Revenue Chart -->
			<div class="col-lg-8">
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">Revenue Overview</h3>
						<div class="card-actions">
							<a href="#" class="btn btn-primary">
								Download report
							</a>
						</div>
					</div>
					<div class="card-body">
						<div id="chart-revenue" class="chart-lg"></div>
					</div>
				</div>
			</div>

			<!-- Top Services -->
			<div class="col-lg-4">
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">Top Services</h3>
					</div>
					<div class="card-body">
						<div class="mb-3">
							<div class="d-flex align-items-center mb-2">
								<div class="flex-fill">
									<div class="font-weight-medium">Pet Grooming</div>
									<div class="text-secondary">62 bookings</div>
								</div>
								<div class="font-weight-medium">$1,234</div>
							</div>
							<div class="progress progress-sm">
								<div class="progress-bar bg-primary" style="width: 84%" role="progressbar" aria-valuenow="84" aria-valuemin="0" aria-valuemax="100">
									<span class="visually-hidden">84% Complete</span>
								</div>
							</div>
						</div>
						<div class="mb-3">
							<div class="d-flex align-items-center mb-2">
								<div class="flex-fill">
									<div class="font-weight-medium">Dog Walking</div>
									<div class="text-secondary">45 bookings</div>
								</div>
								<div class="font-weight-medium">$892</div>
							</div>
							<div class="progress progress-sm">
								<div class="progress-bar bg-primary" style="width: 65%" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
									<span class="visually-hidden">65% Complete</span>
								</div>
							</div>
						</div>
						<div class="mb-3">
							<div class="d-flex align-items-center mb-2">
								<div class="flex-fill">
									<div class="font-weight-medium">Pet Sitting</div>
									<div class="text-secondary">38 bookings</div>
								</div>
								<div class="font-weight-medium">$674</div>
							</div>
							<div class="progress progress-sm">
								<div class="progress-bar bg-primary" style="width: 52%" role="progressbar" aria-valuenow="52" aria-valuemin="0" aria-valuemax="100">
									<span class="visually-hidden">52% Complete</span>
								</div>
							</div>
						</div>
						<div class="mb-3">
							<div class="d-flex align-items-center mb-2">
								<div class="flex-fill">
									<div class="font-weight-medium">Veterinary Care</div>
									<div class="text-secondary">23 bookings</div>
								</div>
								<div class="font-weight-medium">$500</div>
							</div>
							<div class="progress progress-sm">
								<div class="progress-bar bg-primary" style="width: 38%" role="progressbar" aria-valuenow="38" aria-valuemin="0" aria-valuemax="100">
									<span class="visually-hidden">38% Complete</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Recent Bookings -->
			<div class="col-12">
				<div class="card">
					<div class="card-header">
						<h3 class="card-title">Recent Bookings</h3>
						<div class="card-actions">
							<a href="/bookings" class="btn btn-sm">View all</a>
						</div>
					</div>
					<div class="table-responsive">
						<table class="table table-vcenter table-mobile-md card-table">
							<thead>
								<tr>
									<th>Booking ID</th>
									<th>Customer</th>
									<th>Service</th>
									<th>Provider</th>
									<th>Date</th>
									<th>Status</th>
									<th>Amount</th>
									<th class="w-1"></th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td data-label="Booking ID">
										<div class="text-secondary">#3467</div>
									</td>
									<td data-label="Customer">
										<div class="d-flex py-1 align-items-center">
											<span class="avatar me-2" style="background-image: url(https://ui-avatars.com/api/?name=John+Doe)"></span>
											<div class="flex-fill">
												<div class="font-weight-medium">John Doe</div>
												<div class="text-secondary"><a href="#" class="text-reset">john@example.com</a></div>
											</div>
										</div>
									</td>
									<td data-label="Service">
										<div>Pet Grooming</div>
										<div class="text-secondary">Full service</div>
									</td>
									<td data-label="Provider">
										Sarah's Pet Spa
									</td>
									<td data-label="Date">
										<div>Dec 12, 2023</div>
										<div class="text-secondary">10:00 AM</div>
									</td>
									<td data-label="Status">
										<span class="badge bg-success me-1"></span> Completed
									</td>
									<td data-label="Amount" class="text-secondary">
										$75.00
									</td>
									<td>
										<div class="btn-list flex-nowrap">
											<a href="#" class="btn btn-sm">
												View
											</a>
										</div>
									</td>
								</tr>
								<tr>
									<td data-label="Booking ID">
										<div class="text-secondary">#3466</div>
									</td>
									<td data-label="Customer">
										<div class="d-flex py-1 align-items-center">
											<span class="avatar me-2" style="background-image: url(https://ui-avatars.com/api/?name=Jane+Smith)"></span>
											<div class="flex-fill">
												<div class="font-weight-medium">Jane Smith</div>
												<div class="text-secondary"><a href="#" class="text-reset">jane@example.com</a></div>
											</div>
										</div>
									</td>
									<td data-label="Service">
										<div>Dog Walking</div>
										<div class="text-secondary">1 hour</div>
									</td>
									<td data-label="Provider">
										Happy Paws Services
									</td>
									<td data-label="Date">
										<div>Dec 12, 2023</div>
										<div class="text-secondary">2:00 PM</div>
									</td>
									<td data-label="Status">
										<span class="badge bg-warning me-1"></span> In Progress
									</td>
									<td data-label="Amount" class="text-secondary">
										$30.00
									</td>
									<td>
										<div class="btn-list flex-nowrap">
											<a href="#" class="btn btn-sm">
												View
											</a>
										</div>
									</td>
								</tr>
								<tr>
									<td data-label="Booking ID">
										<div class="text-secondary">#3465</div>
									</td>
									<td data-label="Customer">
										<div class="d-flex py-1 align-items-center">
											<span class="avatar me-2" style="background-image: url(https://ui-avatars.com/api/?name=Mike+Johnson)"></span>
											<div class="flex-fill">
												<div class="font-weight-medium">Mike Johnson</div>
												<div class="text-secondary"><a href="#" class="text-reset">mike@example.com</a></div>
											</div>
										</div>
									</td>
									<td data-label="Service">
										<div>Pet Sitting</div>
										<div class="text-secondary">Overnight</div>
									</td>
									<td data-label="Provider">
										Caring Companions
									</td>
									<td data-label="Date">
										<div>Dec 13, 2023</div>
										<div class="text-secondary">6:00 PM</div>
									</td>
									<td data-label="Status">
										<span class="badge bg-info me-1"></span> Scheduled
									</td>
									<td data-label="Amount" class="text-secondary">
										$120.00
									</td>
									<td>
										<div class="btn-list flex-nowrap">
											<a href="#" class="btn btn-sm">
												View
											</a>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</DashboardLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { getDashboardStats } from '@/api/dashboard.service'

const stats = ref({
	revenue: 0,
	bookings: 0,
	users: 0,
	providers: 0
})

const recentBookings = ref([])
const topServices = ref([])

onMounted(async () => {
	await loadDashboardData()
	initializeCharts()
})

async function loadDashboardData() {
	try {
		const response = await getDashboardStats()
		// Map the response to our stats structure
		stats.value = {
			revenue: response.monthlyRevenue || 4300,
			bookings: response.totalAppointments || 84,
			users: response.totalCustomers || 1352,
			providers: 145 // This might not be in the response, using static value
		}
		// For now, using static data for recent bookings and top services
		// These would come from additional API calls in a real implementation
	} catch (error) {
		console.error('Failed to load dashboard data:', error)
	}
}

function initializeCharts() {
	// Initialize charts here using a charting library like ApexCharts
	// This is a placeholder for chart initialization
}
</script>

<style scoped>
.chart-sm {
	height: 40px;
}

.chart-lg {
	height: 240px;
}

.card {
	margin-bottom: 1.5rem;
}

.card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 1.25rem;
	background: transparent;
}

.card-title {
	font-size: 1rem;
	font-weight: 600;
	margin: 0;
}

.card-actions {
	display: flex;
	gap: 0.5rem;
}

.subheader {
	font-size: 0.625rem;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: var(--tblr-secondary);
}

.avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-size: cover;
	background-position: center;
}

.progress-sm {
	height: 4px;
}

.badge {
	width: 8px;
	height: 8px;
	padding: 0;
	border-radius: 50%;
	display: inline-block;
}

.table-mobile-md td {
	vertical-align: middle;
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
	}
	
	.table-mobile-md td {
		display: block;
		text-align: right;
		padding: 0.75rem 1rem;
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