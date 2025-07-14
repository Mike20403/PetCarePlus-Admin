import type { PaginationResponse } from './pagination'

export interface Notification {
  id: string
  userIdSend: string
  userIdReceive: string
  type: NotificationType
  imageUrl: string
  message: string
  title: string
  relatedId: string
  isRead: boolean
  createdAt: string
  deletedAt: string | null
}

export enum NotificationType {
  BOOKING = 'BOOKING',
  PAYMENT = 'PAYMENT',
  SERVICE = 'SERVICE',
  SYSTEM = 'SYSTEM',
  PROMOTION = 'PROMOTION'
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ListNotificationResponse extends PaginationResponse<Notification> {}

// Keep backward compatibility
export interface LegacyListNotificationResponse {
  page: number
  pages: number
  size: number
  total: number
  items: Notification[]
}

export interface NotificationCriteria {
  type?: NotificationType
  isRead?: boolean
  userIdSend?: string
  userIdReceive?: string
} 