<template>
  <AppModal :isOpen="isOpen" :title="'Notification Details'" @close="close" size="lg" :key="`notification-detail-modal-${notification?.id || 'loading'}`">
    <div v-if="loading" class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    
    <div v-else-if="notification" class="notification-details">
      <!-- Header Section -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title mb-0">{{ notification.title }}</h4>
              <div class="card-actions">
                <span class="badge" :class="notification.isRead ? 'bg-success' : 'bg-warning'">
                  {{ notification.isRead ? 'Read' : 'Unread' }}
                </span>
              </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <strong>Type:</strong>
                  <span class="badge bg-primary ms-2">{{ notification.type }}</span>
                </div>
                <div class="col-md-6">
                  <strong>Created:</strong>
                  <span class="ms-2">{{ formatDate(notification.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message Content -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Message</h5>
            </div>
            <div class="card-body">
              <p class="mb-0">{{ notification.message }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Details -->
      <div class="row mb-3">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h6 class="card-title mb-0">Sender Information</h6>
            </div>
            <div class="card-body">
              <p><strong>User ID:</strong> {{ notification.userIdSend }}</p>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h6 class="card-title mb-0">Receiver Information</h6>
            </div>
            <div class="card-body">
              <p><strong>User ID:</strong> {{ notification.userIdReceive }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Technical Details -->
      <div class="row mb-3">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h6 class="card-title mb-0">Technical Details</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <p><strong>Notification ID:</strong><br>{{ notification.id }}</p>
                </div>
                <div class="col-md-4">
                  <p><strong>Related ID:</strong><br>{{ notification.relatedId }}</p>
                </div>
                <div class="col-md-4">
                  <p><strong>Image URL:</strong><br>
                    <span v-if="notification.imageUrl" class="text-break">{{ notification.imageUrl }}</span>
                    <span v-else class="text-muted">No image</span>
                  </p>
                </div>
              </div>
              <div class="row" v-if="notification.deletedAt">
                <div class="col-12">
                  <p><strong>Deleted At:</strong> {{ formatDate(notification.deletedAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center">
      <p class="text-muted">Failed to load notification details.</p>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNotifications } from '@/hooks/useNotifications'
import { useToast } from '@/hooks/useToast'
import AppModal from '@/components/AppModal.vue'
import type { Notification } from '@/types/notification'

const { getNotificationById } = useNotifications()
const { toast } = useToast()

const loading = ref(false)
const isOpen = ref(false)
const notification = ref<Notification | null>(null)

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function loadNotification(id: string) {
  loading.value = true
  try {
    const data = await getNotificationById(id)
    if (data) {
      notification.value = data
    } else {
      toast({ type: 'error', message: 'Failed to load notification details' })
    }
  } catch (error) {
    console.error('Error loading notification:', error)
    toast({ type: 'error', message: 'Failed to load notification details' })
  } finally {
    loading.value = false
  }
}

function open(notificationId: string) {
  isOpen.value = true
  loadNotification(notificationId)
}

function close() {
  isOpen.value = false
  notification.value = null
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.notification-details .card {
  border: 1px solid var(--tblr-border-color);
  margin-bottom: 1rem;
}

.notification-details .card-title {
  color: var(--tblr-primary);
}

.badge {
  font-size: 0.75rem;
}

.text-break {
  word-break: break-all;
}

@media (max-width: 768px) {
  .notification-details .row > div {
    margin-bottom: 1rem;
  }
}
</style> 