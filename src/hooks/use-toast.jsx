import { toast } from 'sonner'

const useToast = () => {
  const show = message => {
    toast(message)
  }

  const showSuccess = message => {
    toast.success(message)
  }

  const showError = message => {
    toast.error(message)
  }

  return {
    show,
    success: showSuccess,
    error: showError
  }
}

export { useToast }
