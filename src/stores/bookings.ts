import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Booking } from '@/types/booking'
import { BookingsService } from '@/api'
import { useToast } from '@/hooks/useToast'

export const useBookingsStore = defineStore('bookings', () => {
  const bookings = ref<Booking[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedBooking = ref<Booking | null>(null)
  const { toast } = useToast()

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
      bookings.value = response.data || []
    } catch (err) {
      error.value = 'Failed to fetch bookings'
      toast({
        type: 'error',
        message: 'Failed to fetch bookings'
      })
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
      toast({
        type: 'error',
        message: 'Failed to fetch booking details'
      })
      console.error(err)
      return null
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
    fetchBookingById
  }
})
