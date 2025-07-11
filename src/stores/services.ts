import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ServicesService, type Service } from '@/api'
import { useToast } from '@/hooks/useToast'

export const useServicesStore = defineStore('services', () => {
  const services = ref<Service[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedService = ref<Service | null>(null)
  const { toast } = useToast()

  const totalServices = computed(() => services.value.length)

  async function fetchServices() {
    isLoading.value = true
    error.value = null

    try {
      const response = await ServicesService.getServices()
      services.value = response
    } catch (err) {
      error.value = 'Failed to fetch services'
      toast({
        type: 'error',
        message: 'Failed to fetch services'
      })
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchServiceById(id: string) {
    isLoading.value = true
    error.value = null

    try {
      const response = await ServicesService.getService(id)
      selectedService.value = response
      return response
    } catch (err) {
      error.value = 'Failed to fetch service details'
      toast({
        type: 'error',
        message: 'Failed to fetch service details'
      })
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
      toast({
        type: 'success',
        message: 'Service created successfully'
      })
      return response
    } catch (err) {
      error.value = 'Failed to create service'
      toast({
        type: 'error',
        message: 'Failed to create service'
      })
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateService(id: string, serviceData?: Partial<Service>) {
    isLoading.value = true
    error.value = null

    try {
      const response = await ServicesService.updateService(id, serviceData)

      // Update the service in the local state
      const index = services.value.findIndex(service => service.id === id)
      if (index !== -1) {
        services.value[index] = response
      }

      toast({
        type: 'success',
        message: 'Service updated successfully'
      })
      return response
    } catch (err) {
      error.value = 'Failed to update service'
      toast({
        type: 'error',
        message: 'Failed to update service'
      })
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function toggleServiceStatus(id: string) {
    return updateService(id)
  }

  async function deleteService(id: string) {
    isLoading.value = true
    error.value = null

    try {
      await ServicesService.deleteService(id)

      // Remove the service from the local state
      services.value = services.value.filter(service => service.id !== id)

      toast({
        type: 'success',
        message: 'Service deleted successfully'
      })
      return true
    } catch (err) {
      error.value = 'Failed to delete service'
      toast({
        type: 'error',
        message: 'Failed to delete service'
      })
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
    fetchServices,
    fetchServiceById,
    createService,
    updateService,
    toggleServiceStatus,
    deleteService
  }
})
