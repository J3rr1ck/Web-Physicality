"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Event {
  id: string
  title: string
  date: Date
  time: string
  location?: string
  attendees?: number
  color: string
}

export function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")

  const events: Event[] = [
    {
      id: "1",
      title: "Team Meeting",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
      time: "10:00 AM - 11:00 AM",
      location: "Conference Room A",
      attendees: 5,
      color: "bg-blue-500",
    },
    {
      id: "2",
      title: "Project Review",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2),
      time: "2:00 PM - 3:30 PM",
      location: "Virtual",
      attendees: 8,
      color: "bg-purple-500",
    },
    {
      id: "3",
      title: "Client Call",
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1),
      time: "11:30 AM - 12:00 PM",
      location: "Phone",
      color: "bg-green-500",
    },
  ]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth())
    const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth())
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-white/10 bg-white/5 opacity-50"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear()
      const isSelected =
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()

      const dayEvents = events.filter(
        (event) =>
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear(),
      )

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 border border-white/10 p-1 transition-colors ${
            isSelected ? "bg-blue-500/20 border-blue-400/30" : isToday ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
          }`}
        >
          <div className="flex justify-between items-start">
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                isToday ? "bg-blue-500 text-white" : "text-white/70"
              }`}
            >
              {day}
            </span>
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.map((event) => (
              <div key={event.id} className={`px-2 py-1 rounded text-xs text-white truncate ${event.color}`}>
                {event.title}
              </div>
            ))}
          </div>
        </div>,
      )
    }

    return days
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const selectedDateEvents = events.filter(
    (event) =>
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear(),
  )

  return (
    <div className="h-full flex flex-col bg-black/20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={prevMonth}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold text-white">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
            <Button
              size="sm"
              variant="ghost"
              onClick={nextMonth}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setView("month")}
              className={`text-white/70 hover:text-white hover:bg-white/10 ${view === "month" ? "bg-white/10" : ""}`}
            >
              Month
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setView("week")}
              className={`text-white/70 hover:text-white hover:bg-white/10 ${view === "week" ? "bg-white/10" : ""}`}
            >
              Week
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setView("day")}
              className={`text-white/70 hover:text-white hover:bg-white/10 ${view === "day" ? "bg-white/10" : ""}`}
            >
              Day
            </Button>
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-1" />
              Event
            </Button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-white/70 text-sm py-2">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-1">
          <div className="h-full overflow-y-auto hide-scrollbar">
            <div className="grid grid-cols-7 gap-1">{renderCalendarDays()}</div>
          </div>
        </div>

        {/* Event Sidebar */}
        <div className="w-80 border-l border-white/10 p-4">
          <div className="mb-4">
            <h3 className="text-white font-medium">
              {selectedDate.toLocaleDateString("default", { weekday: "long", month: "long", day: "numeric" })}
            </h3>
          </div>

          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <h4 className="text-white font-medium mb-2">{event.title}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-white/70">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-center text-white/70">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.location}
                      </div>
                    )}
                    {event.attendees && (
                      <div className="flex items-center text-white/70">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees} attendees
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No events scheduled</p>
              <p className="text-sm mt-1">Click the + button to add an event</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
