'use client'

import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface NotificationProps {
  type: 'success' | 'error'
  message: string
  duration?: number
  onClose?: () => void
}

export default function Notification({ type, message, duration = 3000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose && onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center p-4 mb-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}
      role="alert"
    >
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 mr-2" />
      ) : (
        <XCircle className="w-5 h-5 mr-2" />
      )}
      <span className="sr-only">{type === 'success' ? 'Success' : 'Error'}:</span>
      <div className="ml-3 text-sm font-medium">{message}</div>
    </div>
  )
}