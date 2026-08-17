export interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
  duration?: number
}

export type ToastType = 'success' | 'error'