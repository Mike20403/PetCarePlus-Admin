<template>
	<DashboardLayout title="Dashboard" subtitle="Welcome back to PetCare+ Admin">
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

onMounted(async () => {
	await loadDashboardData()
	initializeCharts()
})

async function loadDashboardData() {
	try {
		const response = await getDashboardStats()
		stats.value = {
			revenue: response.monthlyRevenue || 4300,
			bookings: response.totalAppointments || 84,
			users: response.totalCustomers || 1352,
			providers: 145
		}

	} catch (error) {
		console.error('Failed to load dashboard data:', error)
	}
}

function initializeCharts() {

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