"use client"
import { Desktop } from "@/components/desktop"
import { Dock } from "@/components/dock"
import { AIAssistant } from "@/components/ai-assistant"
import { NotificationCenter } from "@/components/notification-center"
import { AppLauncher } from "@/components/app-launcher"
import { SystemSettings } from "@/components/system-settings"
import { Card } from "@/components/card"
import { useWebOS } from "@/hooks/use-webos"

export default function WebOSHome() {
  const {
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
  } = useWebOS()

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Dynamic background with glass caustics */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Desktop with cards */}
      <Desktop>
        {openCards.map((card) => (
          <Card
            key={card.id}
            card={card}
            isActive={activeCard?.id === card.id}
            onClose={() => closeCard(card.id)}
            onFocus={() => setActiveCard(card)}
          />
        ))}
      </Desktop>

      {/* AI Assistant Overlay */}
      {isAIAssistantOpen && <AIAssistant onClose={() => toggleAIAssistant()} />}

      {/* App Launcher */}
      {isAppLauncherOpen && <AppLauncher onClose={() => toggleAppLauncher()} onOpenApp={openApp} />}

      {/* System Settings */}
      {isSettingsOpen && <SystemSettings onClose={() => toggleSettings()} />}

      {/* Notification Center */}
      <NotificationCenter notifications={notifications} onDismiss={dismissNotification} />

      {/* Dock */}
      <Dock
        onOpenAI={() => toggleAIAssistant()}
        onOpenLauncher={() => toggleAppLauncher()}
        onOpenSettings={() => toggleSettings()}
        onOpenApp={openApp}
      />
    </div>
  )
}
