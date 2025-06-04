"use client"

import { useState } from "react"
import { Search, MapPin, Wind, Droplets, Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface WeatherData {
  location: string
  currentTemp: number
  condition: string
  high: number
  low: number
  humidity: number
  windSpeed: number
  forecast: {
    day: string
    condition: string
    high: number
    low: number
  }[]
}

export function WeatherApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData>({
    location: "San Francisco, CA",
    currentTemp: 68,
    condition: "Partly Cloudy",
    high: 72,
    low: 58,
    humidity: 65,
    windSpeed: 8,
    forecast: [
      { day: "Today", condition: "partly-cloudy", high: 72, low: 58 },
      { day: "Tomorrow", condition: "sunny", high: 75, low: 60 },
      { day: "Wednesday", condition: "cloudy", high: 70, low: 57 },
      { day: "Thursday", condition: "rainy", high: 65, low: 55 },
      { day: "Friday", condition: "partly-cloudy", high: 68, low: 56 },
      { day: "Saturday", condition: "sunny", high: 73, low: 59 },
      { day: "Sunday", condition: "sunny", high: 76, low: 61 },
    ],
  })

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="w-8 h-8 text-yellow-400" />
      case "partly-cloudy":
        return <Cloud className="w-8 h-8 text-gray-300" />
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-400" />
      case "rainy":
        return <CloudRain className="w-8 h-8 text-blue-400" />
      case "snowy":
        return <CloudSnow className="w-8 h-8 text-white" />
      case "stormy":
        return <CloudLightning className="w-8 h-8 text-yellow-300" />
      default:
        return <Sun className="w-8 h-8 text-yellow-400" />
    }
  }

  const handleSearch = () => {
    // Simulate API call
    if (searchQuery.trim() === "") return

    // Mock data for different locations
    const locations: Record<string, WeatherData> = {
      "new york": {
        location: "New York, NY",
        currentTemp: 62,
        condition: "Rainy",
        high: 65,
        low: 52,
        humidity: 80,
        windSpeed: 12,
        forecast: [
          { day: "Today", condition: "rainy", high: 65, low: 52 },
          { day: "Tomorrow", condition: "cloudy", high: 68, low: 54 },
          { day: "Wednesday", condition: "partly-cloudy", high: 70, low: 56 },
          { day: "Thursday", condition: "sunny", high: 72, low: 58 },
          { day: "Friday", condition: "sunny", high: 75, low: 60 },
          { day: "Saturday", condition: "partly-cloudy", high: 73, low: 59 },
          { day: "Sunday", condition: "cloudy", high: 70, low: 57 },
        ],
      },
      london: {
        location: "London, UK",
        currentTemp: 55,
        condition: "Cloudy",
        high: 58,
        low: 48,
        humidity: 75,
        windSpeed: 15,
        forecast: [
          { day: "Today", condition: "cloudy", high: 58, low: 48 },
          { day: "Tomorrow", condition: "rainy", high: 56, low: 47 },
          { day: "Wednesday", condition: "rainy", high: 55, low: 46 },
          { day: "Thursday", condition: "cloudy", high: 57, low: 48 },
          { day: "Friday", condition: "partly-cloudy", high: 60, low: 50 },
          { day: "Saturday", condition: "partly-cloudy", high: 62, low: 52 },
          { day: "Sunday", condition: "sunny", high: 65, low: 54 },
        ],
      },
      tokyo: {
        location: "Tokyo, Japan",
        currentTemp: 75,
        condition: "Sunny",
        high: 78,
        low: 65,
        humidity: 60,
        windSpeed: 5,
        forecast: [
          { day: "Today", condition: "sunny", high: 78, low: 65 },
          { day: "Tomorrow", condition: "sunny", high: 80, low: 67 },
          { day: "Wednesday", condition: "partly-cloudy", high: 79, low: 66 },
          { day: "Thursday", condition: "partly-cloudy", high: 77, low: 64 },
          { day: "Friday", condition: "cloudy", high: 75, low: 63 },
          { day: "Saturday", condition: "rainy", high: 72, low: 62 },
          { day: "Sunday", condition: "rainy", high: 70, low: 60 },
        ],
      },
    }

    const query = searchQuery.toLowerCase()
    for (const key in locations) {
      if (key.includes(query)) {
        setWeatherData(locations[key])
        return
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-black/20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search locations..."
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <Button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white">
            Search
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="p-6">
          {/* Current Weather */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-white/70 mr-2" />
              <h2 className="text-xl font-semibold text-white">{weatherData.location}</h2>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-6xl font-light text-white mr-4">{weatherData.currentTemp}°</div>
                <div>
                  <div className="text-white/80 text-lg">{weatherData.condition}</div>
                  <div className="text-white/60">
                    H: {weatherData.high}° L: {weatherData.low}°
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end mb-2">
                  <Droplets className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-white/80">{weatherData.humidity}% humidity</span>
                </div>
                <div className="flex items-center justify-end">
                  <Wind className="w-5 h-5 text-white/70 mr-2" />
                  <span className="text-white/80">{weatherData.windSpeed} mph wind</span>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">7-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {weatherData.forecast.map((day, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="text-white font-medium mb-2">{day.day}</div>
                  <div className="flex justify-center mb-2">{getWeatherIcon(day.condition)}</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{day.high}°</span>
                    <span className="text-white/60">{day.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Forecast */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Hourly Forecast</h3>
            <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
              {Array.from({ length: 24 }, (_, i) => {
                const hour = new Date().getHours() + i
                const displayHour = hour % 12 === 0 ? 12 : hour % 12
                const ampm = hour % 24 < 12 ? "AM" : "PM"
                const temp = Math.round(
                  weatherData.currentTemp + Math.sin((i / 24) * Math.PI) * 10 * (Math.random() * 0.4 + 0.8),
                )
                const conditions = ["sunny", "partly-cloudy", "cloudy", "rainy"]
                const condition = conditions[Math.floor(Math.random() * conditions.length)]

                return (
                  <div
                    key={i}
                    className="flex flex-col items-center p-3 rounded-lg bg-white/5 border border-white/10 min-w-[80px]"
                  >
                    <div className="text-white/80 text-sm">
                      {displayHour}
                      {ampm}
                    </div>
                    <div className="my-2">{getWeatherIcon(condition)}</div>
                    <div className="text-white font-medium">{temp}°</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
