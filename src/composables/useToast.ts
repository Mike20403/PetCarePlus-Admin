import { ref } from 'vue';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

const toasts = ref<Toast[]>([]);
let nextId = 1;

export function useToast() {
  const showToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = nextId++;
    const toast: Toast = {
      id,
      message,
      type,
      duration
    };
    
    toasts.value.push(toast);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    return id;
  };
  
  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };
  
  return {
    toasts,
    showToast,
    removeToast
  };
}