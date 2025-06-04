"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { MailApp } from "@/components/apps/mail-app"
import { NotesApp } from "@/components/apps/notes-app"
import { CalculatorApp } from "@/components/apps/calculator-app"
import { BrowserApp } from "@/components/apps/browser-app"
import { PhotosApp } from "@/components/apps/photos-app"
import { MusicApp } from "@/components/apps/music-app"
import { CalendarApp } from "@/components/apps/calendar-app"
import { WeatherApp } from "@/components/apps/weather-app"
import { ChatApp } from "@/components/apps/chat-app"
import { FilesApp } from "@/components/apps/files-app"

interface CardData {
  id: string
  title: string
  app: string
  content: React.ReactNode
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized?: boolean
}

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "ai"
  title: string
  message: string
  timestamp: Date
  actions?: { label: string; action: () => void }[]
}

export function useWebOS() {
  const [openCards, setOpenCards] = useState<CardData[]>([])
  const [activeCard, setActiveCard] = useState<CardData | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "ai",
      title: "AI Assistant Ready",
      message: "Your AI assistant is ready to help with tasks and questions.",
      timestamp: new Date(),
      actions: [{ label: "Open AI", action: () => toggleAIAssistant() }],
    },
  ])
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const openApp = useCallback(
    (appId: string) => {
      const existingCard = openCards.find((card) => card.app === appId)
      if (existingCard) {
        setActiveCard(existingCard)
        return
      }

      const getAppContent = (appId: string) => {
        switch (appId) {
          case "mail":
            return <MailApp />
          case "notes":
            return <NotesApp />
          case "calculator":
            return <CalculatorApp />
          case "browser":
            return <BrowserApp />
          case "photos":
            return <PhotosApp />
          case "music":
            return <MusicApp />
          case "calendar":
            return <CalendarApp />
          case "weather":
            return <WeatherApp />
          case "chat":
            return <ChatApp />
          case "files":
            return <FilesApp />
          default:
            return (
              <div className="p-8 text-center text-white/60">
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p>This app is under development.</p>
              </div>
            )
        }
      }

      const getAppTitle = (appId: string) => {
        const titles: Record<string, string> = {
          mail: "Mail",
          camera: "Camera",
          music: "Music",
          notes: "Notes",
          calculator: "Calculator",
          calendar: "Calendar",
          browser: "Browser",
          photos: "Photos",
          code: "Code Editor",
          database: "Database",
          weather: "Weather",
          maps: "Maps",
          chat: "Chat",
          files: "Files",
          terminal: "Terminal",
          store: "App Store",
        }
        return titles[appId] || "App"
      }

      const newCard: CardData = {
        id: Date.now().toString(),
        title: getAppTitle(appId),
        app: appId,
        content: getAppContent(appId),
        position: {
          x: Math.random() * (window.innerWidth - 600),
          y: Math.random() * (window.innerHeight - 500),
        },
        size: { width: 600, height: 400 },
      }

      setOpenCards((prev) => [...prev, newCard])
      setActiveCard(newCard)
    },
    [openCards],
  )

  const closeCard = useCallback((cardId: string) => {
    setOpenCards((prev) => prev.filter((card) => card.id !== cardId))
    setActiveCard((prev) => (prev?.id === cardId ? null : prev))
  }, [])

  const toggleAIAssistant = useCallback(() => {
    setIsAIAssistantOpen((prev) => !prev)
  }, [])

  const toggleAppLauncher = useCallback(() => {
    setIsAppLauncherOpen((prev) => !prev)
  }, [])

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev)
  }, [])

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return {
    openCards,
    activeCard,
    notifications,
    isAIAssistantOpen,
    isAppLauncherOpen,
    isSettingsOpen,
    openApp,
    closeCard,
    setActiveCard,
    toggleAIAssistant,
    toggleAppLauncher,
    toggleSettings,
    dismissNotification,
  }
}
