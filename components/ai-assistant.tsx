"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, X, Sparkles, Brain, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AIAssistantProps {
  onClose: () => void
}

export function AIAssistant({ onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your AI assistant. I can help you with tasks, answer questions, generate content, and manage your system. What would you like to do today?",
      timestamp: new Date(),
      suggestions: ["Create a document", "Schedule a meeting", "Analyze data", "Generate code"],
    },
  ])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `I understand you want to "${input}". I can help you with that! Here are some options I can provide:`,
        timestamp: new Date(),
        suggestions: ["Get more details", "Create a plan", "Find resources", "Set reminders"],
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl h-[600px] rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">AI Assistant</h2>
              <p className="text-white/60 text-sm">Powered by advanced AI</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto hide-scrollbar" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === "user"
                      ? "bg-blue-500/80 text-white ml-4"
                      : "bg-white/10 text-white/90 mr-4 backdrop-blur-sm"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestion(suggestion)}
                          className="px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white/90 p-3 rounded-2xl mr-4 backdrop-blur-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12"
              />
              <Button
                size="sm"
                variant="ghost"
                className={`absolute right-1 top-1/2 -translate-y-1/2 ${
                  isListening ? "text-red-400" : "text-white/70"
                }`}
                onClick={() => setIsListening(!isListening)}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={handleSend} disabled={!input.trim()} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 mt-3">
            <button className="flex items-center space-x-1 px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/80">
              <Sparkles className="w-3 h-3" />
              <span>Generate</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1 text-xs rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white/80">
              <Zap className="w-3 h-3" />
              <span>Automate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
