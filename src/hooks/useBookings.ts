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
      bookings.value = res.data || []
      total.value = res.paging?.totalItem || 0
      page.value = res.paging?.pageNumber || pageNum
      size.value = res.paging?.pageSize || sizeNum
      totalPages.value = res.paging?.totalPage || 1
      
      // Transform response to match expected structure for backward compatibility
      return {
        ...res,
        content: res.data || [],
        totalElements: res.paging?.totalItem || 0,
        totalPages: res.paging?.totalPage || 1,
        page: res.paging?.pageNumber || pageNum,
        size: res.paging?.pageSize || sizeNum
      }
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