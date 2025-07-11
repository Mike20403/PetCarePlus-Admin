import { useNotificationStore } from '@/stores/notification';

interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  timeout?: number;
}

export function useToast() {
  const notificationStore = useNotificationStore();

  function toast(options: ToastOptions) {
    notificationStore.addNotification({
      type: options.type,
      title: options.title,
      message: options.message,
      timeout: options.timeout ?? 3500,
    });
  }

  return { toast };
}
