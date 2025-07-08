import { ref } from 'vue'
import { ServicesService } from '@/api/services.service'
import type { Service, ServiceRequest, ServicePatchRequest } from '@/types/service'

export function useServices() {
  const services = ref<Service[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchServices(page = 1, size = 10, sortBy?: string, sort: 'asc' | 'desc' = 'asc') {
    loading.value = true
    error.value = null
    try {
      const res = await ServicesService.getServices(page, size, sortBy, sort)
      services.value = res || []
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch services'
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