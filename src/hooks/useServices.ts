import { ServicesService, type ServiceCriteria } from '@/api/services.service'
import type { Service, ServiceRequest, ServicePatchRequest } from '@/types/service'
import { ref } from 'vue'


export function useServices() {
  const services = ref<Service[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const pages = ref(0)
  const currentPage = ref(1)

  async function fetchServices(criteria?: ServiceCriteria, page = 1, size = 10, sortBy = 'createdAt', sort: 'asc' | 'desc' = 'asc') {
    loading.value = true
    error.value = null
    try {
      const res = await ServicesService.getServices(criteria, page, size, sortBy, sort)
      services.value = res
      total.value = res.length || 0
      pages.value = 1
      currentPage.value = 1
      return res
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch services'
    } finally {
      loading.value = false
    }
  }

  async function createService(data: ServiceRequest) {
    return ServicesService.createService(data)
  }

  async function updateService(id: string, data: ServicePatchRequest) {
    return ServicesService.updateService(id, data)
  }

  async function deleteService(id: string) {
    return ServicesService.deleteService(id)
  }

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService
  }
} 