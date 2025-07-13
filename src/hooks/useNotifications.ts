import { ref } from 'vue'
import { NotificationsService, type NotificationCriteria } from '@/api/notifications.service'
import type { Notification, ListNotificationResponse } from '@/types/notification'

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
  ): Promise<ListNotificationResponse | null> {
    loading.value = true
    error.value = null
    
    try {
      const response = await NotificationsService.getNotifications(criteria, page, size, sortBy, sort)
      notifications.value = response.items || []
      return response
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