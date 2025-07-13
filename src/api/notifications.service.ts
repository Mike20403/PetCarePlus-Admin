import { api } from './axios'
import type { Notification, ListNotificationResponse, NotificationCriteria } from '@/types/notification'

export type { NotificationCriteria }

export class NotificationsService {
  private static readonly BASE_URL = '/admin/notifications'

  /**
   * Get all notifications with pagination and filtering
   */
  static async getNotifications(
    criteria?: NotificationCriteria,
    page: number = 1,
    size: number = 10,
    sortBy: string = 'createdAt',
    sort: 'asc' | 'desc' = 'desc'
  ): Promise<ListNotificationResponse> {
    const params = {
      ...criteria,
      page,
      size,
      sortBy,
      sort
    }
    const response = await api.get<ListNotificationResponse>(this.BASE_URL, { params })
    return response.data
  }

  /**
   * Get a notification by ID
   */
  static async getNotificationById(id: string): Promise<Notification> {
    const response = await api.get<Notification>(`${this.BASE_URL}/${id}`)
    return response.data
  }
} 