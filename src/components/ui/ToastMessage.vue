<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div v-for="notification in notifications" :key="notification.id"
      :class="['toast', 'show', `toast--${notification.type}`]" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast__header">
        <span class="avatar avatar-xs me-2 toast__avatar" :class="`toast__avatar--${notification.type}`">
          <svg v-if="notification.type === 'success'" width="24" height="24" fill="none" stroke="currentColor"
            stroke-width="2" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="notification.type === 'error'" width="24" height="24" fill="none" stroke="currentColor"
            stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <svg v-else-if="notification.type === 'info'" width="24" height="24" fill="none" stroke="currentColor"
            stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <svg v-else-if="notification.type === 'warning'" width="24" height="24" fill="none" stroke="currentColor"
            stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01M21 20H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z" />
          </svg>
        </span>
        <strong class="me-auto toast__title">{{ notification.title || capitalize(notification.type) }}</strong>
        <button type="button" class="ms-2 btn-close" @click="notificationStore.removeNotification(notification.id)"
          aria-label="Close"></button>
      </div>
      <div class="toast__body">
        {{ notification.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification';
import { computed } from 'vue';

const notificationStore = useNotificationStore();
const notifications = computed(() => notificationStore.notifications);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
</script>

<style scoped>
.toast-container {
  z-index: 1050;
}

.toast {
  min-width: 320px;
  max-width: 400px;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  background: var(--tblr-bg-surface, #fff);
  border: 1px solid var(--tblr-border-color, #dee2e6);
  color: var(--tblr-body-color, #182433);
}

.toast--success {
  border-left: 4px solid var(--tblr-success, #2fb344);
}

.toast--error {
  border-left: 4px solid var(--tblr-danger, #d63939);
}

.toast--info {
  border-left: 4px solid var(--tblr-info, #4299e1);
}

.toast--warning {
  border-left: 4px solid var(--tblr-warning, #f76707);
}

.toast__header {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem 0.5rem 0.75rem;
  background: transparent;
  border-bottom: 1px solid var(--tblr-border-color, #dee2e6);
  border-radius: 0.5rem 0.5rem 0 0;
}

.toast__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--tblr-bg-surface-secondary, #f8f9fa);
  margin-right: 0.5rem;
}

.toast__title {
  font-weight: 600;
  font-size: 1rem;
}

.toast__body {
  padding: 1rem;
  font-size: 0.95rem;
}
</style>
