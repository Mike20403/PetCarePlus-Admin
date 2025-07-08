import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Booking } from '@/types/booking'
import { BookingsService } from '@/api'
import { useToast } from '@/composables/useToast'

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref<Booking[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedBooking = ref<Booking | null>(null)
  const { showToast } = useToast()

  const totalBookings = computed(() => bookings.value.length)
  
  const pendingBookings = computed(() => 
    bookings.value.filter(booking => booking.status === 'pending')
  )
  
  const completedBookings = computed(() => 
    bookings.value.filter(booking => booking.status === 'completed')
  )
  
  const cancelledBookings = computed(() => 
    bookings.value.filter(booking => booking.status === 'cancelled')
  )

  async function fetchBookings() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await BookingsService.getBookings()
      bookings.value = response
    } catch (err) {
      error.value = 'Failed to fetch bookings'
      showToast('Failed to fetch bookings', 'error')
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchBookingById(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await BookingsService.getBooking(id)
      selectedBooking.value = response
      return response
    } catch (err) {
      error.value = 'Failed to fetch booking details'
      showToast('Failed to fetch booking details', 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateBookingStatus(id: string, status: Booking['status']) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await BookingsService.changeBookingStatus(id, status)
      
      // Update the booking in the local state
      const index = bookings.value.findIndex(booking => booking.id === id)
      if (index !== -1) {
        bookings.value[index] = response
      }
      
      showToast('Booking status updated successfully', 'success')
      return response
    } catch (err) {
      error.value = 'Failed to update booking status'
      showToast('Failed to update booking status', 'error')
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deleteBooking(id: string) {
    isLoading.value = true
    error.value = null
    
    try {
      await BookingsService.deleteBooking(id)
      
      // Remove the booking from the local state
      bookings.value = bookings.value.filter(booking => booking.id !== id)
      
      showToast('Booking deleted successfully', 'success')
      return true
    } catch (err) {
      error.value = 'Failed to delete booking'
      showToast('Failed to delete booking', 'error')
      console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    bookings,
    isLoading,
    error,
    selectedBooking,
    totalBookings,
    pendingBookings,
    completedBookings,
    cancelledBookings,
    fetchBookings,
    fetchBookingById,
    updateBookingStatus,
    deleteBooking
  }
})