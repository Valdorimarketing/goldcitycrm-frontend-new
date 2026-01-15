import { ref } from 'vue'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    const newToast = { ...toast, id }
    toasts.value.push(newToast)
    
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 3000)
    }
    
    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const showSuccess = (message: string, duration?: number) => {
    return addToast({ type: 'success', message, duration })
  }

  const showError = (message: string, duration?: number) => {
    return addToast({ type: 'error', message, duration })
  }

  const showInfo = (message: string, duration?: number) => {
    return addToast({ type: 'info', message, duration })
  }

  const showWarning = (message: string, duration?: number) => {
    return addToast({ type: 'warning', message, duration })
  }

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}