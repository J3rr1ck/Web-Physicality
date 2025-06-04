"use client"

import { useState } from "react"
import { Bell, X, CheckCircle, AlertCircle, Info, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "ai"
  title: string
  message: string
  timestamp: Date
  actions?: { label: string; action: () => void }[]
}

interface NotificationCenterProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export function NotificationCenter({ notifications, onDismiss }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (notifications.length === 0 && !isOpen) return null

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle
      case "warning":
        return AlertCircle
      case "ai":
        return Zap
      default:
        return Info
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "ai":
        return "text-purple-400"
      default:
        return "text-blue-400"
    }
  }

  return (
    <>
      {/* Notification Bell */}
      {notifications.length > 0 && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 right-4 z-40 p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg hover:bg-white/20 transition-all"
        >
          <Bell className="w-5 h-5 text-white" />
          {notifications.length > 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">{notifications.length}</span>
            </div>
          )}
        </button>
      )}

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 z-50 w-80 max-h-96 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Notifications</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-white/60">No notifications</div>
            ) : (
              <div className="p-2">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.type)
                  return (
                    <div
                      key={notification.id}
                      className="p-3 m-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className={`w-5 h-5 mt-0.5 ${getColor(notification.type)}`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                          <p className="text-white/70 text-xs mt-1">{notification.message}</p>
                          <p className="text-white/50 text-xs mt-2">{notification.timestamp.toLocaleTimeString()}</p>

                          {notification.actions && (
                            <div className="flex space-x-2 mt-2">
                              {notification.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  size="sm"
                                  variant="outline"
                                  onClick={action.action}
                                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDismiss(notification.id)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
