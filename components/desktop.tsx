"use client"

import type { ReactNode } from "react"

interface DesktopProps {
  children: ReactNode
}

export function Desktop({ children }: DesktopProps) {
  return (
    <div className="absolute inset-0 p-4 pb-24">
      <div className="relative w-full h-full">{children}</div>
    </div>
  )
}
