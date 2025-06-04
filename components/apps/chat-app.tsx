"use client"

import { useState } from "react"
import { Search, Send, Smile, Paperclip, MoreVertical, Phone, Video, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Contact {
  id: string
  name: string
  avatar: string
  status: "online" | "offline" | "away"
  lastMessage?: string
  lastMessageTime?: string
  unread?: number
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  isMe: boolean
}

export function ChatApp() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "AI Assistant",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastMessage: "How can I help you today?",
      lastMessageTime: "2m ago",
    },
    {
      id: "2",
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastMessage: "Did you see the latest update?",
      lastMessageTime: "10m ago",
      unread: 2,
    },
    {
      id: "3",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "away",
      lastMessage: "Let's meet tomorrow at 10",
      lastMessageTime: "1h ago",
    },
    {
      id: "4",
      name: "Team Chat",
      avatar: "/placeholder.svg?height=40&width=40",
      status: "online",
      lastMessage: "Alex: I'll send the report soon",
      lastMessageTime: "3h ago",
      unread: 5,
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<string | null>("1")
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      {
        id: "1",
        sender: "AI Assistant",
        content: "Hello! How can I help you today?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isMe: false,
      },
      {
        id: "2",
        sender: "You",
        content: "I need help with scheduling a meeting",
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        isMe: true,
      },
      {
        id: "3",
        sender: "AI Assistant",
        content:
          "I'd be happy to help you schedule a meeting. What date and time would you prefer, and who should be invited?",
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        isMe: false,
      },
    ],
    "2": [
      {
        id: "1",
        sender: "John Smith",
        content: "Hey, how's it going?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isMe: false,
      },
      {
        id: "2",
        sender: "You",
        content: "Pretty good, just working on the new project",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        isMe: true,
      },
      {
        id: "3",
        sender: "John Smith",
        content: "Did you see the latest update?",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        isMe: false,
      },
    ],
  })

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const selectedContactData = contacts.find((contact) => contact.id === selectedContact)
  const selectedContactMessages = selectedContact ? messages[selectedContact] || [] : []

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: messageInput,
      timestamp: new Date(),
      isMe: true,
    }

    setMessages((prev) => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), newMessage],
    }))

    setMessageInput("")

    // Simulate response for AI Assistant
    if (selectedContact === "1") {
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "AI Assistant",
          content: "I'm processing your request. Is there anything specific you need help with?",
          timestamp: new Date(),
          isMe: false,
        }

        setMessages((prev) => ({
          ...prev,
          [selectedContact]: [...(prev[selectedContact] || []), responseMessage],
        }))
      }, 1500)
    }
  }

  return (
    <div className="h-full flex bg-black/20">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="p-2">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact.id)
                  // Clear unread count
                  setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, unread: undefined } : c)))
                }}
                className={`w-full p-3 rounded-lg flex items-center space-x-3 mb-1 transition-colors ${
                  selectedContact === contact.id ? "bg-blue-500/20 border border-blue-400/30" : "hover:bg-white/5"
                }`}
              >
                <div className="relative">
                  <img
                    src={contact.avatar || "/placeholder.svg"}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      contact.status === "online"
                        ? "bg-green-500"
                        : contact.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                    }`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white text-sm font-medium truncate">{contact.name}</h3>
                    {contact.lastMessageTime && (
                      <span className="text-white/50 text-xs">{contact.lastMessageTime}</span>
                    )}
                  </div>
                  {contact.lastMessage && <p className="text-white/60 text-xs truncate">{contact.lastMessage}</p>}
                </div>
                {contact.unread && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">{contact.unread}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContactData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedContactData.avatar || "/placeholder.svg"}
                  alt={selectedContactData.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="text-white font-medium">{selectedContactData.name}</h2>
                  <p className="text-white/60 text-xs">
                    {selectedContactData.status === "online"
                      ? "Online"
                      : selectedContactData.status === "away"
                        ? "Away"
                        : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                  <Video className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto hide-scrollbar">
              <div className="space-y-4">
                {selectedContactMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl ${
                        message.isMe ? "bg-blue-500/80 text-white" : "bg-white/10 text-white/90"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex items-center space-x-2">
                <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/60">
            <div className="text-center">
              <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-sem ibold mb-2">Select a conversation</h3>
              <p>Choose a contact from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
