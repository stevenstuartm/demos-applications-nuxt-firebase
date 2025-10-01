// composables/useAppToast.ts
export const useAppToast = () => {
  const toast = useToast()

  const success = (message: string, title: string = 'Success') => {
    toast.add({
      title,
      description: message,
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
  }

  const error = (message: string, title: string = 'Error') => {
    toast.add({
      title,
      description: message,
      color: 'error',
      icon: 'i-lucide-x-circle'
    })
  }

  const warning = (message: string, title: string = 'Warning') => {
    toast.add({
      title,
      description: message,
      color: 'warning',
      icon: 'i-lucide-alert-triangle'
    })
  }

  const info = (message: string, title: string = 'Info') => {
    toast.add({
      title,
      description: message,
      color: 'neutral',
      icon: 'i-lucide-info'
    })
  }

  return {
    success,
    error,
    warning,
    info,
    // Expose the original toast instance for advanced usage
    toast
  }
}