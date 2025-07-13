<template>
  <DashboardLayout title="Services" subtitle="Manage all pet care services">
    <template #actions>
      <button v-if="authStore.hasRole('ADMIN')" @click="openEditServiceModal(null)" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        New Service
      </button>
    </template>
    <DataTable
      :headers="serviceTableHeaders"
      :items="mappedServices"
      :loading="fetchLoading"
      :page="currentPage"
      :perPage="pageSize"
      :totalItems="total"
      :itemsPerPageOptions="[10, 25, 50]"
      :hasActions="true"
      :hideSearch="true"
      @update:pagination="handlePagination"
      @update:sort="() => {}"
      title="Services management"
    >
      <template #customFilters>
        <div class="d-flex gap-2 align-items-center flex-wrap">
          <!-- Search Input -->
          <div class="input-icon">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search services..." 
              v-model="searchQuery"
            />
            <span class="input-icon-addon">
              <div v-if="searchLoading" class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Searching...</span>
              </div>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <circle cx="10" cy="10" r="7"/>
                <path d="m21 21-6-6"/>
              </svg>
            </span>
          </div>
          
          <!-- Price Range -->
          <div class="d-flex gap-1 align-items-center">
            <span class="text-muted small">Price:</span>
            <input 
              type="number" 
              class="form-control form-control-sm" 
              placeholder="Min" 
              v-model.number="minPrice"
              @input="handleFilterChange"
              style="width: 80px;"
            />
            <span class="text-muted">-</span>
            <input 
              type="number" 
              class="form-control form-control-sm" 
              placeholder="Max" 
              v-model.number="maxPrice"
              @input="handleFilterChange"
              style="width: 80px;"
            />
          </div>
          
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
        <button class="btn btn-sm" @click.prevent="openServiceDetail(item as unknown as Service)">View</button>
        <button class="btn btn-sm" @click.prevent="openEditServiceModal(item as unknown as Service)">Edit</button>
        <button class="btn btn-sm btn-danger" @click.prevent="deleteServiceHandler(item.id as string)">Delete</button>
      </template>
    </DataTable>
    <ServiceDetailModal ref="detailServiceModal" />
    <ServiceEditModal ref="editServiceModal" @save="handleEditSave" />
    <ConfirmationDialog ref="confirmationDialog" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import DataTable, { type DataTableHeader } from '@/components/ui/DataTable.vue'
import { useServices } from '@/hooks/useServices'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/hooks/useToast'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import type { Service } from '@/types/service'
import type { ServiceCriteria } from '@/api/services.service'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import ServiceEditModal from '@/components/service/ServiceEditModal.vue'
import ServiceDetailModal from '@/components/service/ServiceDetailModal.vue'

const authStore = useAuthStore()
const { services, searchServicesAdvanced, deleteService, loading, total, currentPage, pageSize } = useServices()
const { toast } = useToast()

// Search and filter states
const searchQuery = ref('')
const searchLoading = ref(false)
const minPrice = ref<number | undefined>()
const maxPrice = ref<number | undefined>()

const fetchLoading = loading

const serviceTableHeaders: DataTableHeader[] = [
  { key: 'name', title: 'Service', sortable: true },
  { key: 'description', title: 'Description', sortable: false },
  { key: 'basePrice', title: 'Base Price', sortable: true, type: 'currency' },
  { key: 'createdAt', title: 'Created', sortable: true, type: 'date' }
]

const mappedServices = computed(() => services.value.map(service => ({
  ...service,
  // format fields if needed
})))

// Build search criteria
const buildCriteria = (): ServiceCriteria => {
  const criteria: ServiceCriteria = {}
  
  if (searchQuery.value.trim()) {
    criteria.query = searchQuery.value.trim()
  }
  
  if (minPrice.value !== undefined && minPrice.value !== null && !isNaN(minPrice.value)) {
    criteria.minPrice = minPrice.value
  }
  
  if (maxPrice.value !== undefined && maxPrice.value !== null && !isNaN(maxPrice.value)) {
    criteria.maxPrice = maxPrice.value
  }
  
  return criteria
}

async function fetchAndSetServices() {
  const criteria = buildCriteria()
  
  // Always use advanced search for consistency
  console.log('Using advanced search with criteria:', criteria)
  await searchServicesAdvanced(criteria, currentPage.value, pageSize.value)
}

const handlePagination = (p: number, s: number) => {
  currentPage.value = p
  pageSize.value = s
  fetchAndSetServices()
}

const handleSearch = async () => {
  currentPage.value = 1  // Reset to first page when searching
  await fetchAndSetServices()
  searchLoading.value = false
}

const handleFilterChange = () => {
  currentPage.value = 1  // Reset to first page when filters change
  fetchAndSetServices()
}

const resetFilters = () => {
  searchQuery.value = ''
  minPrice.value = undefined
  maxPrice.value = undefined
  currentPage.value = 1
  fetchAndSetServices()
}


onMounted(fetchAndSetServices)

// Watch for filter changes with debounce for search input
let searchTimeout: ReturnType<typeof setTimeout>
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  if (searchQuery.value.trim()) {
    searchLoading.value = true
  } else {
    searchLoading.value = false
  }
  searchTimeout = setTimeout(handleSearch, 800) // 2 seconds debounce
})

// Watch for other filter changes
watch([minPrice, maxPrice], handleFilterChange)

const editServiceModal = ref<InstanceType<typeof ServiceEditModal> | null>(null)
const confirmationDialog = ref<InstanceType<typeof ConfirmationDialog> | null>(null)
const detailServiceModal = ref<InstanceType<typeof ServiceDetailModal> | null>(null)

const openEditServiceModal = (service: Service | null) => {
  editServiceModal.value?.open(service ? service.id : null)
}

const openServiceDetail = (service: Service) => {
  detailServiceModal.value?.open(service.id)
}

const deleteServiceHandler = (serviceId: string) => {
  console.log('deleteServiceHandler called with id:', serviceId)
  confirmationDialog.value?.open(
    'Are you sure you want to delete this service?',
    'Delete Service',
    async () => {
      try {
        console.log('Starting delete service:', serviceId)
        await deleteService(serviceId)
        console.log('Delete service completed, fetching data...')
        await fetchAndSetServices()
        console.log('Fetch completed, showing success toast')
        toast({ type: 'success', message: 'Service deleted successfully' })
      } catch (error) {
        console.error('Error deleting service:', error)
        toast({ type: 'error', message: 'Failed to delete service' })
      }
    }
  )
}

const handleEditSave = async () => {
  console.log('handleEditSave called')
  await fetchAndSetServices()
  console.log('fetchAndSetServices completed')
}
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

.table td:nth-child(2), .table th:nth-child(2) {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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