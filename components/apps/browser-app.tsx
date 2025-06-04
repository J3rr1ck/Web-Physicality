"use client"

import { useState } from "react"
import { Search, ArrowLeft, ArrowRight, RefreshCw, Home, BookOpen, Star, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function BrowserApp() {
  const [url, setUrl] = useState("https://search.webos.ai")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { id: 0, title: "Search", url: "https://search.webos.ai" },
    { id: 1, title: "News", url: "https://news.webos.ai" },
  ]

  const handleNavigate = (newUrl: string) => {
    setIsLoading(true)
    setUrl(newUrl)

    // Simulate page loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const addNewTab = () => {
    tabs.push({ id: tabs.length, title: "New Tab", url: "https://search.webos.ai" })
    setActiveTab(tabs.length - 1)
  }

  return (
    <div className="h-full flex flex-col bg-black/20">
      {/* Browser Tabs */}
      <div className="flex items-center p-2 border-b border-white/10 bg-white/5 overflow-x-auto hide-scrollbar">
        <div className="w-full">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-t-lg text-sm whitespace-nowrap ${
                  activeTab === tab.id ? "bg-white/10 text-white" : "bg-transparent text-white/70 hover:bg-white/5"
                }`}
              >
                {tab.title}
              </button>
            ))}
            <button
              onClick={addNewTab}
              className="px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center p-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center space-x-2 mr-3">
          <Button size="icon" variant="ghost" className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10">
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleNavigate(url)}
            className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleNavigate("https://search.webos.ai")}
            className="w-8 h-8 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Home className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleNavigate(url)}
            className="pl-9 pr-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Star className="w-4 h-4" />
          </Button>
        </div>

        <Button size="icon" variant="ghost" className="ml-3 w-8 h-8 text-white/70 hover:text-white hover:bg-white/10">
          <BookOpen className="w-4 h-4" />
        </Button>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center">
                <RefreshCw className="w-8 h-8 text-white/70 animate-spin mb-4" />
                <p className="text-white/70">Loading...</p>
              </div>
            </div>
          ) : (
            <div className="text-white">
              <div className="max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                  <h1 className="text-4xl font-bold mb-2">WebOS Search</h1>
                  <p className="text-white/70">Privacy-focused search with AI assistance</p>
                </div>

                <div className="relative mb-8">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <Input
                    placeholder="Search the web..."
                    className="pl-12 py-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {["Mail", "Calendar", "Weather", "Maps"].map((app) => (
                    <button
                      key={app}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-center"
                    >
                      <p className="text-white">{app}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-3">Suggested for you</h2>
                  {["Latest news", "Weather forecast", "Upcoming events", "Recent documents"].map((item) => (
                    <div
                      key={item}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                      <p className="text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
