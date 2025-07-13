import { ref } from 'vue'
import { BookingsService, type BookingCriteria } from '@/api/bookings.service'
import type { Booking } from '@/types/booking'

export function useBookings() {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const page = ref(1)
  const size = ref(10)
  const totalPages = ref(1)

  async function fetchBookings(pageNum = 1, sizeNum = 10, sortBy?: string, sort: 'asc' | 'desc' = 'asc', criteria?: BookingCriteria) {
    loading.value = true
    error.value = null
    try {
      const res = await BookingsService.getBookings(pageNum, sizeNum, sortBy, sort, criteria)
      bookings.value = res.content || []
      total.value = res.totalElements || 0
      page.value = res.page || 1
      size.value = res.size || sizeNum
      totalPages.value = res.totalPages || 1
    } catch (e) {
      error.value = (e as { message: string}).message || 'Failed to fetch bookings'
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
    total,
    page,
    size,
    totalPages,
    fetchBookings,
    getBooking
  }
} 