"use client"

import { useState } from "react"
import {
  Search,
  X,
  Mail,
  Camera,
  Music,
  FileText,
  Calculator,
  Calendar,
  Globe,
  ImageIcon,
  Code,
  Database,
  CloudIcon,
  MapPin,
  MessageCircle,
  FolderOpen,
  Terminal,
  ShoppingBag,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface App {
  id: string
  name: string
  icon: any
  category: string
  description: string
  gradient: string
}

interface AppLauncherProps {
  onClose: () => void
  onOpenApp: (appId: string) => void
}

export function AppLauncher({ onClose, onOpenApp }: AppLauncherProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const apps: App[] = [
    {
      id: "mail",
      name: "Mail",
      icon: Mail,
      category: "Communication",
      description: "Email client with AI features",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      id: "camera",
      name: "Camera",
      icon: Camera,
      category: "Media",
      description: "AI-enhanced photography",
      gradient: "from-gray-600 to-gray-800",
    },
    {
      id: "music",
      name: "Music",
      icon: Music,
      category: "Media",
      description: "Smart music player",
      gradient: "from-pink-500 to-red-500",
    },
    {
      id: "notes",
      name: "Notes",
      icon: FileText,
      category: "Productivity",
      description: "AI-powered note taking",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      id: "calculator",
      name: "Calculator",
      icon: Calculator,
      category: "Utilities",
      description: "Advanced calculator",
      gradient: "from-gray-700 to-gray-900",
    },
    {
      id: "calendar",
      name: "Calendar",
      icon: Calendar,
      category: "Productivity",
      description: "Smart scheduling",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      id: "browser",
      name: "Browser",
      icon: Globe,
      category: "Internet",
      description: "AI-enhanced web browsing",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      id: "photos",
      name: "Photos",
      icon: ImageIcon,
      category: "Media",
      description: "AI photo management",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: "code",
      name: "Code Editor",
      icon: Code,
      category: "Development",
      description: "AI-assisted coding",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      id: "database",
      name: "Database",
      icon: Database,
      category: "Development",
      description: "Data management",
      gradient: "from-teal-500 to-cyan-600",
    },
    {
      id: "weather",
      name: "Weather",
      icon: CloudIcon,
      category: "Utilities",
      description: "AI weather forecasting",
      gradient: "from-sky-400 to-blue-500",
    },
    {
      id: "maps",
      name: "Maps",
      icon: MapPin,
      category: "Navigation",
      description: "Smart navigation",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      id: "chat",
      name: "Chat",
      icon: MessageCircle,
      category: "Communication",
      description: "AI-powered messaging",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      id: "files",
      name: "Files",
      icon: FolderOpen,
      category: "Utilities",
      description: "Smart file management",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "terminal",
      name: "Terminal",
      icon: Terminal,
      category: "Development",
      description: "Command line interface",
      gradient: "from-gray-800 to-black",
    },
    {
      id: "store",
      name: "App Store",
      icon: ShoppingBag,
      category: "System",
      description: "Download new apps",
      gradient: "from-blue-600 to-indigo-700",
    },
  ]

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const categories = [...new Set(apps.map((app) => app.category))]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-4xl rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex flex-col"
        style={{ height: "700px" }}
      >
        {/* Header - Fixed height */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">App Launcher</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search - Fixed height */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {/* Apps Grid - Scrollable area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
          <div className="p-6">
            {categories.map((category) => {
              const categoryApps = filteredApps.filter((app) => app.category === category)
              if (categoryApps.length === 0) return null

              return (
                <div key={category} className="mb-8 last:mb-0">
                  <h3 className="text-lg font-semibold text-white/90 mb-4">{category}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryApps.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => {
                          onOpenApp(app.id)
                          onClose()
                        }}
                        className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                        >
                          <app.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-white font-medium text-sm mb-1">{app.name}</h4>
                        <p className="text-white/60 text-xs">{app.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
