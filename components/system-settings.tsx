"use client"

import { useState } from "react"
import { X, Shield, Palette, Database, Code, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

interface SystemSettingsProps {
  onClose: () => void
}

export function SystemSettings({ onClose }: SystemSettingsProps) {
  const [settings, setSettings] = useState({
    aiAssistant: true,
    notifications: true,
    darkMode: true,
    glassEffects: true,
    privacy: true,
    autoUpdates: true,
    developerMode: false,
    transparency: [80],
    animationSpeed: [100],
  })

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const settingSections = [
    {
      title: "AI & Intelligence",
      icon: Zap,
      items: [
        { key: "aiAssistant", label: "AI Assistant", description: "Enable system-wide AI assistance", type: "switch" },
        {
          key: "smartSuggestions",
          label: "Smart Suggestions",
          description: "AI-powered app and content suggestions",
          type: "switch",
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      items: [
        { key: "privacy", label: "Enhanced Privacy", description: "Local AI processing when possible", type: "switch" },
        { key: "dataEncryption", label: "Data Encryption", description: "Encrypt all user data", type: "switch" },
      ],
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        { key: "darkMode", label: "Dark Mode", description: "Use dark theme", type: "switch" },
        { key: "glassEffects", label: "Glass Effects", description: "Enable dynamic glass materials", type: "switch" },
        {
          key: "transparency",
          label: "Transparency",
          description: "Adjust interface transparency",
          type: "slider",
          min: 0,
          max: 100,
        },
        {
          key: "animationSpeed",
          label: "Animation Speed",
          description: "Adjust animation speed",
          type: "slider",
          min: 50,
          max: 200,
        },
      ],
    },
    {
      title: "System",
      icon: Database,
      items: [
        {
          key: "autoUpdates",
          label: "Auto Updates",
          description: "Automatically update system and apps",
          type: "switch",
        },
        { key: "notifications", label: "Notifications", description: "Enable system notifications", type: "switch" },
      ],
    },
    {
      title: "Developer",
      icon: Code,
      items: [
        {
          key: "developerMode",
          label: "Developer Mode",
          description: "Enable developer tools and API access",
          type: "switch",
        },
        { key: "debugMode", label: "Debug Mode", description: "Show debug information", type: "switch" },
      ],
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-4xl rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden flex flex-col"
        style={{ height: "700px" }}
      >
        {/* Header - Fixed height */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">System Settings</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Settings Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
          <div className="p-6">
            <div className="space-y-8">
              {settingSections.map((section) => (
                <div key={section.title} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                  </div>

                  <div className="space-y-4 ml-10">
                    {section.items.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.label}</h4>
                          <p className="text-white/60 text-sm">{item.description}</p>
                        </div>

                        <div className="ml-4">
                          {item.type === "switch" && (
                            <Switch
                              checked={settings[item.key as keyof typeof settings] as boolean}
                              onCheckedChange={(checked) => updateSetting(item.key, checked)}
                            />
                          )}

                          {item.type === "slider" && (
                            <div className="w-32">
                              <Slider
                                value={settings[item.key as keyof typeof settings] as number[]}
                                onValueChange={(value) => updateSetting(item.key, value)}
                                min={item.min || 0}
                                max={item.max || 100}
                                step={1}
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - Fixed height */}
        <div className="p-6 border-t border-white/10 bg-white/5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-white/60 text-sm">WebOS AI v1.0 • Built with privacy in mind</div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                Reset to Defaults
              </Button>
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
