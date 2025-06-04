"use client"

import { useState } from "react"
import { Search, Plus, Star, Archive, Trash2, Reply, Forward } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Email {
  id: string
  from: string
  subject: string
  preview: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
}

export function MailApp() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const emails: Email[] = [
    {
      id: "1",
      from: "AI Assistant",
      subject: "Daily Summary Generated",
      preview: "Your personalized daily summary is ready with insights from your recent activities...",
      timestamp: "2 min ago",
      isRead: false,
      isStarred: true,
    },
    {
      id: "2",
      from: "Team Lead",
      subject: "Project Update Required",
      preview: "Hi there, could you please provide an update on the current project status...",
      timestamp: "1 hour ago",
      isRead: true,
      isStarred: false,
    },
    {
      id: "3",
      from: "WebOS System",
      subject: "Security Update Available",
      preview: "A new security update is available for your WebOS system. Install now for enhanced...",
      timestamp: "3 hours ago",
      isRead: false,
      isStarred: false,
    },
  ]

  const filteredEmails = emails.filter(
    (email) =>
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedEmailData = emails.find((email) => email.id === selectedEmail)

  return (
    <div className="h-full flex bg-black/20">
      {/* Email List */}
      <div className="w-1/3 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-2 mb-3">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-1" />
              Compose
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emails..."
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="p-2">
            {filteredEmails.map((email) => (
              <button
                key={email.id}
                onClick={() => setSelectedEmail(email.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors mb-1 ${
                  selectedEmail === email.id ? "bg-blue-500/20 border border-blue-400/30" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${email.isRead ? "text-white/70" : "text-white"}`}>
                    {email.from}
                  </span>
                  <div className="flex items-center space-x-1">
                    {email.isStarred && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
                    <span className="text-xs text-white/50">{email.timestamp}</span>
                  </div>
                </div>
                <h4 className={`text-sm mb-1 ${email.isRead ? "text-white/70" : "text-white font-medium"}`}>
                  {email.subject}
                </h4>
                <p className="text-xs text-white/50 line-clamp-2">{email.preview}</p>
                {!email.isRead && <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 flex flex-col">
        {selectedEmailData ? (
          <>
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">{selectedEmailData.subject}</h2>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>From: {selectedEmailData.from}</span>
                <span>{selectedEmailData.timestamp}</span>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto hide-scrollbar">
              <div className="text-white/90 leading-relaxed">
                <p className="mb-4">{selectedEmailData.preview}</p>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident.
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex items-center space-x-2">
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Reply className="w-4 h-4 mr-1" />
                  Reply
                </Button>
                <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Forward className="w-4 h-4 mr-1" />
                  Forward
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/60">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Select an email</h3>
              <p>Choose an email from the list to read its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
