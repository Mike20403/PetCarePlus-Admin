<template>
  <DashboardLayout title="Services" subtitle="Manage all pet care services">
    <template #actions>
      <button v-if="authStore.hasRole('ADMIN')" @click="openCreateServiceModal" class="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
        New Service
      </button>
    </template>

    <div class="row row-cards">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Services Management</h3>
            <div class="card-actions">
              <div class="d-flex">
                <input type="search" class="form-control me-3" placeholder="Search services..." aria-label="Search services">
                <!-- Add filters as needed -->
              </div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table table-vcenter table-mobile-md card-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Description</th>
                  <th>Base Price</th>
                  <th>Created</th>
                  <th class="w-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="service in services" :key="service.id">
                  <td data-label="Service">
                    <div class="d-flex py-1 align-items-center">
                      <span class="avatar me-2" :style="`background-image: url(${service.iconUrl})`"></span>
                      <div class="flex-fill">
                        <div class="font-weight-medium">{{ service.name }}</div>
                        <div class="text-secondary">ID: {{ service.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td data-label="Description">
                    <div>{{ service.description }}</div>
                  </td>
                  <td data-label="Base Price">
                    <div>${{ service.basePrice }}</div>
                  </td>
                  <td data-label="Created">
                    <div>{{ service.createdAt }}</div>
                  </td>
                  <td>
                    <div class="btn-list flex-nowrap">
                      <a href="#" class="btn btn-sm" @click.prevent="openEditServiceModal(service)">
                        Edit
                      </a>
                      <div class="dropdown">
                        <button class="btn btn-sm dropdown-toggle align-text-top" data-bs-toggle="dropdown">
                          Actions
                        </button>
                        <div class="dropdown-menu dropdown-menu-end">
                          <a class="dropdown-item" href="#" @click.prevent="openEditServiceModal(service)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon dropdown-item-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                              <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                              <path d="M16 5l3 3" />
                            </svg>
                            Edit Service
                          </a>
                          <a class="dropdown-item text-danger" href="#" @click.prevent="deleteServiceHandler(service.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon dropdown-item-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M4 7l16 0" />
                              <path d="M10 11l0 6" />
                              <path d="M14 11l0 6" />
                              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                            Delete Service
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer d-flex align-items-center">
            <p class="m-0 text-secondary">Showing <span>1</span> to <span>{{ services.length }}</span> of <span>{{ services.length }}</span> entries</p>
            <ul class="pagination m-0 ms-auto">
              <li class="page-item disabled">
                <a class="page-link" href="#" tabindex="-1" aria-disabled="true">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M15 6l-6 6l6 6" />
                  </svg>
                  prev
                </a>
              </li>
              <li class="page-item active"><a class="page-link" href="#">1</a></li>
              <li class="page-item disabled">
                <a class="page-link" href="#">
                  next
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 6l6 6l-6 6" />
                  </svg>
                </a>
              </li>
            </ul>
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
import { useServices } from '@/hooks/useServices'

const authStore = useAuthStore()
const { services, loading, fetchServices, createService, updateService, deleteService } = useServices()
const showServiceModal = ref(false)
const currentService = ref(null)

const openCreateServiceModal = () => {
	currentService.value = null
	showServiceModal.value = true
}

const openEditServiceModal = (service: any) => {
	currentService.value = service
	showServiceModal.value = true
}

const toggleServiceStatus = async (serviceId: string) => {
	// Implement status toggle logic if API supports it
	await fetchServices()
}

const deleteServiceHandler = async (serviceId: string) => {
	if (confirm('Are you sure you want to delete this service?')) {
		await deleteService(serviceId)
		await fetchServices()
	}
}

onMounted(() => {
	fetchServices()
})
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