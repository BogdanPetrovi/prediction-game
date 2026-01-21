"use client"

import { useEffect } from "react"

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
  duration?: number
}

const Toast = ({ message, type = 'success', onClose, duration = 10000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-500'
  const progressColor = type === 'success' ? 'bg-green-300' : 'bg-red-300'

  return (
    <div className={`fixed bottom-6 right-2 lg:right-6 ${bgColor} text-white px-6 py-6 rounded-lg shadow-2xl flex items-center gap-3 toast-slide-in z-50 min-w-[350px] overflow-hidden`}>
      <div className="flex-1">
        <p className="font-semibold text-lg">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="text-white hover:text-gray-200 duration-200 cursor-pointer text-2xl font-bold leading-none"
      >
        ×
      </button>
      <div 
        className={`absolute bottom-0 left-0 h-1 ${progressColor} toast-progress`}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  )
}

export default Toast