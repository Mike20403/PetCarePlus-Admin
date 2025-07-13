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

export interface ListNotificationResponse {
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