import { type NextRequest, NextResponse } from "next/server"

let notifications: any[] = [
  {
    id: "1",
    type: "ai",
    title: "AI Assistant Ready",
    message: "Your AI assistant is ready to help with tasks and questions.",
    timestamp: new Date(),
  },
]

export async function GET() {
  return NextResponse.json({ notifications })
}

export async function POST(request: NextRequest) {
  try {
    const notification = await request.json()
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...notification,
    }

    notifications.unshift(newNotification)

    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications = notifications.slice(0, 50)
    }

    return NextResponse.json({
      success: true,
      notification: newNotification,
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid notification data" }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (id) {
    notifications = notifications.filter((n) => n.id !== id)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Notification ID required" }, { status: 400 })
}
