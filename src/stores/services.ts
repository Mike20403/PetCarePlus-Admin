import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Service } from '@/types/api'
import { ServicesService } from '@/api'
import { useToast } from '@/composables/useToast'

export const useServicesStore = defineStore('services', () => {
  const services = ref<Service[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedService = ref<Service | null>(null)
  const { showToast } = useToast()

  const totalServices = computed(() => services.value.length)
  
  const activeServices = computed(() => 
    services.value.filter(service => service.isActive)
  )
  
  const inactiveServices = computed(() => 
    services.value.filter(service => !service.isActive)
  )

  async function fetchServices() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await ServicesService.getServices()
      services.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch services'
      showToast('Failed to fetch services', 'error')
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchServiceById(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await ServicesService.getService(parseInt(id))
      selectedService.value = response
      return response
    } catch (err) {
      error.value = 'Failed to fetch service details'
      showToast('Failed to fetch service details', 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createService(serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await ServicesService.createService(serviceData)
      services.value.push(response)
      showToast('Service created successfully', 'success')
      return response
    } catch (err) {
      error.value = 'Failed to create service'
      showToast('Failed to create service', 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateService(id: string, serviceData: Partial<Service>) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await ServicesService.updateService(parseInt(id), serviceData)
      
      // Update the service in the local state
      const index = services.value.findIndex(service => service.id === parseInt(id))
      if (index !== -1) {
        services.value[index] = response
      }
      
      showToast('Service updated successfully', 'success')
      return response
    } catch (err) {
      error.value = 'Failed to update service'
      showToast('Failed to update service', 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function toggleServiceStatus(id: string, isActive: boolean) {
    return updateService(id, { isActive })
  }

  async function deleteService(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      await ServicesService.deleteService(parseInt(id))
      
      // Remove the service from the local state
      services.value = services.value.filter(service => service.id !== parseInt(id))
      
      showToast('Service deleted successfully', 'success')
      return true
    } catch (err) {
      error.value = 'Failed to delete service'
      showToast('Failed to delete service', 'error')
      console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    services,
    isLoading,
    error,
    selectedService,
    totalServices,
    activeServices,
    inactiveServices,
    fetchServices,
    fetchServiceById,
    createService,
    updateService,
    toggleServiceStatus,
    deleteService
  }
})