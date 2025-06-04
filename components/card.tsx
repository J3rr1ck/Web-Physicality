"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface CardData {
  id: string
  title: string
  app: string
  content: ReactNode
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized?: boolean
}

interface CardProps {
  card: CardData
  isActive: boolean
  onClose: () => void
  onFocus: () => void
}

export function Card({ card, isActive, onClose, onFocus }: CardProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>("")
  const [position, setPosition] = useState(card.position)
  const [size, setSize] = useState(card.size)
  const [isMinimized, setIsMinimized] = useState(card.isMinimized || false)
  const cardRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 })
  const resizeRef = useRef({
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startPosX: 0,
    startPosY: 0,
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("drag-handle")) {
      setIsDragging(true)
      onFocus()
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startPosX: position.x,
        startPosY: position.y,
      }
    }
  }

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)
    onFocus()

    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
      startPosX: position.x,
      startPosY: position.y,
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragRef.current.startX
        const deltaY = e.clientY - dragRef.current.startY

        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - size.width, dragRef.current.startPosX + deltaX)),
          y: Math.max(0, Math.min(window.innerHeight - size.height - 100, dragRef.current.startPosY + deltaY)),
        })
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeRef.current.startX
        const deltaY = e.clientY - resizeRef.current.startY

        let newWidth = resizeRef.current.startWidth
        let newHeight = resizeRef.current.startHeight
        let newX = resizeRef.current.startPosX
        let newY = resizeRef.current.startPosY

        // Handle different resize directions
        if (resizeDirection.includes("e")) {
          newWidth = Math.max(300, resizeRef.current.startWidth + deltaX)
        }
        if (resizeDirection.includes("w")) {
          newWidth = Math.max(300, resizeRef.current.startWidth - deltaX)
          newX = resizeRef.current.startPosX + (resizeRef.current.startWidth - newWidth)
        }
        if (resizeDirection.includes("s")) {
          newHeight = Math.max(200, resizeRef.current.startHeight + deltaY)
        }
        if (resizeDirection.includes("n")) {
          newHeight = Math.max(200, resizeRef.current.startHeight - deltaY)
          newY = resizeRef.current.startPosY + (resizeRef.current.startHeight - newHeight)
        }

        // Ensure window stays within bounds
        newX = Math.max(0, Math.min(window.innerWidth - newWidth, newX))
        newY = Math.max(0, Math.min(window.innerHeight - newHeight - 100, newY))

        setSize({ width: newWidth, height: newHeight })
        setPosition({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeDirection("")
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, resizeDirection, size, position])

  if (isMinimized) {
    return null
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute rounded-2xl overflow-hidden transition-all duration-300 ease-out",
        "backdrop-blur-xl bg-white/10 border border-white/20",
        "shadow-2xl shadow-black/20",
        isActive ? "ring-2 ring-blue-400/50 z-50" : "z-10",
        isDragging || isResizing ? "scale-105 shadow-3xl" : "hover:shadow-3xl",
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        backdropFilter: "blur(20px) saturate(180%)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      }}
      onMouseDown={handleMouseDown}
      onClick={onFocus}
    >
      {/* Resize Handles */}
      {isActive && (
        <>
          {/* Corner handles */}
          <div className="resize-handle resize-handle-corner nw" onMouseDown={(e) => handleResizeStart(e, "nw")} />
          <div className="resize-handle resize-handle-corner ne" onMouseDown={(e) => handleResizeStart(e, "ne")} />
          <div className="resize-handle resize-handle-corner sw" onMouseDown={(e) => handleResizeStart(e, "sw")} />
          <div className="resize-handle resize-handle-corner se" onMouseDown={(e) => handleResizeStart(e, "se")} />

          {/* Edge handles */}
          <div className="resize-handle resize-handle-edge n" onMouseDown={(e) => handleResizeStart(e, "n")} />
          <div className="resize-handle resize-handle-edge s" onMouseDown={(e) => handleResizeStart(e, "s")} />
          <div className="resize-handle resize-handle-edge e" onMouseDown={(e) => handleResizeStart(e, "e")} />
          <div className="resize-handle resize-handle-edge w" onMouseDown={(e) => handleResizeStart(e, "w")} />
        </>
      )}

      {/* Card Header */}
      <div className="drag-handle flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-4 bg-white/30 rounded-full" />
          <div className="w-1 h-4 bg-white/30 rounded-full" />
          <div className="w-1 h-4 bg-white/30 rounded-full" />
        </div>

        <h3 className="text-white/90 font-medium text-sm truncate mx-4 flex-1">{card.title}</h3>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsMinimized(true)
            }}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-white/70" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 overflow-hidden" style={{ height: `calc(100% - 73px)` }}>
        {card.content}
      </div>
    </div>
  )
}
