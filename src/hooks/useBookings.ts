import { ref } from 'vue'
import { BookingsService, type BookingCriteria } from '@/api/bookings.service'
import type { Booking } from '@/types/booking'

export function useBookings() {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBookings(page = 1, size = 10, sortBy?: string, sort: 'asc' | 'desc' = 'asc', criteria?: BookingCriteria) {
    loading.value = true
    error.value = null
    try {
      const res = await BookingsService.getBookings(page, size, sortBy, sort, criteria)
      bookings.value = res.data || []
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch bookings'
    } finally {
      loading.value = false
    }
  }

  async function getBooking(id: string) {
    return BookingsService.getBooking(id)
  }

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    getBooking
  }
} 