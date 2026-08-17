'use client'

import { useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { ToastProps, ToastType } from "@/types/Toast";
import { createContext } from "react";
import Toast from "@/components/shared/Toast";

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

interface ToastWithShow extends ToastProps {
  show: boolean
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastWithShow>({
    message: '',
    type: 'success',
    show: false,
    duration: 6000,
    onClose: () => {}
  })

  const showToast = useCallback((message: string, type: ToastType = 'success', duration: number = 6000) => {
    setToast({ message, type, duration, show: true, onClose: () => {} })
  }, [])

  const handleClose = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }))
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {
        toast.show &&
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={handleClose}
          />
      }
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if(!context) {
    throw new Error("useToast mora da se koristi unutar Toast Providera!")
  }
  return context
}