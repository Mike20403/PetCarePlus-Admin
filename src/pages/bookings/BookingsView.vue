<template>
  <DashboardLayout title="Bookings" subtitle="Manage all pet care service bookings">
    <DataTable
      :headers="bookingTableHeaders"
      :items="mappedBookings"
      :loading="fetchLoading"
      :page="currentPage"
      :totalItems="total"
      :itemsPerPageOptions="[10, 25, 50]"
      :hasActions="true"
      @update:search="searchQuery = $event"
      @update:pagination="handlePagination"
      @update:sort="() => {}"
    >
      <template #rowActions="{ item }">
        <button class="btn btn-sm btn-outline-primary" @click.prevent="openBookingDetail(item as unknown as Booking)">View</button>
      </template>
    </DataTable>

    <BookingDetailModal ref="detailBookingModal" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import DataTable, { type DataTableHeader } from '@/components/ui/DataTable.vue'
import { useBookings } from '@/hooks/useBookings'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import type { Booking } from '@/types/booking'
import { BookingDetailModal } from '@/components/booking'

const { bookings, fetchBookings, total } = useBookings()
const fetchLoading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const detailBookingModal = ref<InstanceType<typeof BookingDetailModal> | null>(null)

const bookingTableHeaders: DataTableHeader[] = [
  { key: 'customerName', title: 'Customer', sortable: true },
  { key: 'providerServiceName', title: 'Provider Service', sortable: true },
  { key: 'status', title: 'Status', sortable: true, type: 'status' },
  { key: 'paymentStatus', title: 'Payment', sortable: true },
  { key: 'totalPrice', title: 'Total Price', sortable: true, type: 'currency' },
  { key: 'bookingTime', title: 'Booking Time', sortable: true, type: 'date' },
  { key: 'pets', title: 'Pets', sortable: false }
]

const mappedBookings = computed(() => bookings.value.map(booking => ({
  ...booking,
  customerName: `${booking.user.name} ${booking.user.lastName}`,
  providerServiceName: booking.providerService.serviceName,
  pets: booking.petList.map(pet => `${pet.petName} (${pet.serviceName}) - $${pet.price}`).join(', ')
})))

async function fetchAndSetBookings() {
  fetchLoading.value = true
  await fetchBookings(currentPage.value, pageSize.value, undefined, 'asc', searchQuery.value ? { query: searchQuery.value } : undefined)
  fetchLoading.value = false
}

const handlePagination = (p: number, s: number) => {
  currentPage.value = p
  pageSize.value = s
  fetchAndSetBookings()
}

const openBookingDetail = (bookingData: Booking) => {
  detailBookingModal.value?.open(bookingData.id)
}

onMounted(() => {
  fetchAndSetBookings()
})

watch([searchQuery, currentPage, pageSize], fetchAndSetBookings)
</script>

<style scoped>
.avatar {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-size: cover;
	background-position: center;
}

.badge {
	font-size: 0.75rem;
	padding: 0.25rem 0.5rem;
}

.btn-list {
	display: flex;
	gap: 0.25rem;
}

.dropdown-item-icon {
	margin-right: 0.5rem;
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
		padding: 1rem;
	}
	
	.table-mobile-md td {
		display: block;
		text-align: right;
		padding: 0.5rem 0;
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