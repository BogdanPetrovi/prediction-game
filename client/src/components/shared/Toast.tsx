"use client"

import { ToastProps } from "@/types/Toast"
import { useEffect } from "react"

const Toast = ({ message, type = 'success', onClose, duration = 10000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const color = type === 'success' ? 'green-400' : 'red-400'

  return (
    <div 
      className={`fixed bottom-6 right-2 lg:right-6 bg-secondary brightness-150 border border-${color} text-white px-6 py-6 rounded-lg shadow-2xl flex items-center gap-3 slide-in z-50 min-w-[350px] overflow-hidden`}
    >
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
        className={`absolute bottom-0 left-0 h-1 bg-${color} toast-progress`}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  )
}

export default Toast