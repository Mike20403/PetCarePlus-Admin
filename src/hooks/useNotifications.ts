import { ref } from 'vue'
import { NotificationsService, type NotificationCriteria } from '@/api/notifications.service'
import type { Notification, ListNotificationResponse } from '@/types/notification'

// Type for backward compatibility response
interface BackwardCompatibleResponse extends ListNotificationResponse {
  items?: Notification[]
  total?: number
  pages?: number
  page?: number
  size?: number
}

export function useNotifications() {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchNotifications(
    criteria?: NotificationCriteria,
    page = 1,
    size = 10,
    sortBy = 'createdAt',
    sort: 'asc' | 'desc' = 'desc'
  ): Promise<BackwardCompatibleResponse | null> {
    loading.value = true
    error.value = null
    
    try {
      const response = await NotificationsService.getNotifications(criteria, page, size, sortBy, sort)
      notifications.value = response.data || []
      
      // Transform response to match expected structure for backward compatibility  
      return {
        ...response,
        items: response.data || [],
        total: response.paging?.totalItem || 0,
        pages: response.paging?.totalPage || 1,
        page: response.paging?.pageNumber || 1,
        size: response.paging?.pageSize || size
      } as BackwardCompatibleResponse
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch notifications'
      return null
    } finally {
      loading.value = false
    }
  }

  async function getNotificationById(id: string): Promise<Notification | null> {
    loading.value = true
    error.value = null
    
    try {
      const notification = await NotificationsService.getNotificationById(id)
      return notification
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch notification details'
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    getNotificationById
  }
} 