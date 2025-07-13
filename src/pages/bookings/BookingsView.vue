<template>
  <DashboardLayout title="Bookings" subtitle="Manage all pet care service bookings">
    <DataTable
      :headers="bookingTableHeaders"
      :items="mappedBookings"
      :loading="fetchLoading"
      :page="currentPage"
      :perPage="pageSize"
      :totalItems="total"
      :itemsPerPageOptions="[10, 25, 50]"
      :hasActions="true"
      :hideSearch="true"
      @update:pagination="handlePagination"
      @update:sort="() => {}"
      title="Bookings management"
    >
      <template #customFilters>
        <div class="d-flex gap-2 align-items-center flex-wrap">
          <!-- Search Input -->
          <div class="input-icon">
            <input 
              type="text" 
              class="form-control form-control-md" 
              placeholder="Search by customer name, email, service name,..." 
              v-model="searchQuery" 
              @input="handleSearch"
            />
            <span class="input-icon-addon">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <circle cx="10" cy="10" r="7"/>
                <path d="m21 21-6-6"/>
              </svg>
            </span>
          </div>
          
          <!-- Status Filter -->
          <select class="form-select w-auto" v-model="selectedStatus">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          
          <!-- Payment Status Filter -->
          <select class="form-select w-auto" v-model="selectedPaymentStatus">
            <option v-for="option in paymentStatusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          
          <!-- User ID Filter -->
          <input 
            type="text" 
            class="form-control form-control-md" 
            placeholder="User ID" 
            v-model="userId"
            @input="handleFilterChange"
            style="width: 120px;"
          />
          
          <!-- Provider ID Filter -->
          <input 
            type="text" 
            class="form-control form-control-md" 
            placeholder="Provider ID" 
            v-model="providerId"
            @input="handleFilterChange"
            style="width: 120px;"
          />
          
          <!-- Is Deleted Filter -->
          <select class="form-select w-auto" v-model="selectedIsDeleted">
            <option v-for="option in isDeletedOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          
          <!-- Reset Button -->
          <button class="btn btn-outline-secondary btn-sm" @click="resetFilters" title="Reset all filters">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"/>
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>
            </svg>
            Reset
          </button>
        </div>
      </template>
      
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
import type { BookingCriteria } from '@/api/bookings.service'
import { BookingDetailModal } from '@/components/booking'

const { bookings, fetchBookings, total } = useBookings()

// Filter states
const fetchLoading = ref(false)
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPaymentStatus = ref('')
const userId = ref('')
const providerId = ref('')
const selectedIsDeleted = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// Filter options
const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'SERVICE_DONE', label: 'Service Done' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' }
]

const paymentStatusOptions = [
  { value: '', label: 'All Payment Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' }
]

const isDeletedOptions = [
  { value: '', label: 'All Records' },
  { value: 'false', label: 'Active' },
  { value: 'true', label: 'Deleted' }
]

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

// Build search criteria
const buildCriteria = (): BookingCriteria => {
  const criteria: BookingCriteria = {}
  
  if (searchQuery.value.trim()) {
    criteria.query = searchQuery.value.trim()
  }
  
  if (selectedStatus.value && selectedStatus.value !== '') {
    criteria.status = selectedStatus.value
  }
  
  if (selectedPaymentStatus.value && selectedPaymentStatus.value !== '') {
    criteria.paymentStatus = selectedPaymentStatus.value
  }
  
  if (userId.value.trim()) {
    criteria.userId = userId.value.trim()
  }
  
  if (providerId.value.trim()) {
    criteria.providerId = providerId.value.trim()
  }
  
  if (selectedIsDeleted.value && selectedIsDeleted.value !== '') {
    criteria.isDeleted = selectedIsDeleted.value === 'true'
  }
  
  return criteria
}

async function fetchAndSetBookings() {
  fetchLoading.value = true
  const criteria = buildCriteria()
  
  console.log('Booking search criteria:', criteria)
  
  await fetchBookings(currentPage.value, pageSize.value, undefined, 'asc', criteria)
  fetchLoading.value = false
}

const handlePagination = (p: number, s: number) => {
  currentPage.value = p
  pageSize.value = s
  fetchAndSetBookings()
}

const handleSearch = () => {
  currentPage.value = 1  // Reset to first page when searching
  fetchAndSetBookings()
}

const handleFilterChange = () => {
  currentPage.value = 1  // Reset to first page when filters change
  fetchAndSetBookings()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedPaymentStatus.value = ''
  userId.value = ''
  providerId.value = ''
  selectedIsDeleted.value = ''
  currentPage.value = 1
  fetchAndSetBookings()
}

const openBookingDetail = (bookingData: Booking) => {
  detailBookingModal.value?.open(bookingData.id)
}

onMounted(() => {
  fetchAndSetBookings()
})

// Watch for filter changes with debounce for search input
let searchTimeout: ReturnType<typeof setTimeout>
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(handleSearch, 300)
})

// Watch for other filter changes
watch([selectedStatus, selectedPaymentStatus, userId, providerId, selectedIsDeleted], handleFilterChange)
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