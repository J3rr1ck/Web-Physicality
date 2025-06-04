"use client"

import { Bot, Grid3X3, Settings, Mail, Camera, Music, FileText, Calculator } from "lucide-react"
import { cn } from "@/lib/utils"

interface DockProps {
  onOpenAI: () => void
  onOpenLauncher: () => void
  onOpenSettings: () => void
  onOpenApp: (app: string) => void
}

export function Dock({ onOpenAI, onOpenLauncher, onOpenSettings, onOpenApp }: DockProps) {
  const dockItems = [
    { id: "ai", icon: Bot, label: "AI Assistant", action: onOpenAI, gradient: "from-blue-500 to-purple-600" },
    { id: "launcher", icon: Grid3X3, label: "Apps", action: onOpenLauncher, gradient: "from-gray-500 to-gray-700" },
    { id: "mail", icon: Mail, label: "Mail", action: () => onOpenApp("mail"), gradient: "from-blue-400 to-blue-600" },
    {
      id: "camera",
      icon: Camera,
      label: "Camera",
      action: () => onOpenApp("camera"),
      gradient: "from-gray-600 to-gray-800",
    },
    {
      id: "music",
      icon: Music,
      label: "Music",
      action: () => onOpenApp("music"),
      gradient: "from-pink-500 to-red-500",
    },
    {
      id: "notes",
      icon: FileText,
      label: "Notes",
      action: () => onOpenApp("notes"),
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      id: "calculator",
      icon: Calculator,
      label: "Calculator",
      action: () => onOpenApp("calculator"),
      gradient: "from-gray-700 to-gray-900",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      action: onOpenSettings,
      gradient: "from-gray-500 to-gray-700",
    },
  ]

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center space-x-2 p-3 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
        {dockItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={cn(
              "relative p-3 rounded-xl transition-all duration-200 ease-out",
              "hover:scale-110 hover:-translate-y-1 active:scale-95",
              "bg-gradient-to-br",
              item.gradient,
              "shadow-lg hover:shadow-xl",
            )}
            title={item.label}
          >
            <item.icon className="w-6 h-6 text-white" />

            {/* Glass reflection effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  )
}
