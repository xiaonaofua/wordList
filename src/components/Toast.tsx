import React, { useState, useEffect } from 'react'
import './Toast.css'
import { ToastProps } from '../types'

// Toast 类型
export const TOAST_TYPES = {
  SUCCESS: 'success' as const,
  ERROR: 'error' as const,
  WARNING: 'warning' as const,
  INFO: 'info' as const
}

// Toast 组件
const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [isExiting, setIsExiting] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = (): void => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      if (onClose) onClose()
    }, 300) // 动画时间
  }

  if (!isVisible) return null

  const getIcon = (): string => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return '✅'
      case TOAST_TYPES.ERROR:
        return '❌'
      case TOAST_TYPES.WARNING:
        return '⚠️'
      case TOAST_TYPES.INFO:
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className={`toast toast-${type} ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        <button className="toast-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  )
}

// Toast 容器组件的 Props 接口
interface ToastItem {
  id: string | number
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface ToastContainerProps {
  toasts: ToastItem[]
  removeToast: (id: string | number) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default Toast
