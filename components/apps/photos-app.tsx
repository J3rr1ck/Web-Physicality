"use client"

import { useState } from "react"
import { Search, Grid, LayoutGrid, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Photo {
  id: string
  url: string
  title: string
  date: string
  tags: string[]
}

export function PhotosApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const photos: Photo[] = [
    {
      id: "1",
      url: "/placeholder.svg?height=300&width=400",
      title: "Mountain Landscape",
      date: "Today",
      tags: ["nature", "mountains"],
    },
    {
      id: "2",
      url: "/placeholder.svg?height=300&width=400",
      title: "City Skyline",
      date: "Yesterday",
      tags: ["city", "architecture"],
    },
    {
      id: "3",
      url: "/placeholder.svg?height=300&width=400",
      title: "Beach Sunset",
      date: "Last week",
      tags: ["beach", "sunset"],
    },
    {
      id: "4",
      url: "/placeholder.svg?height=300&width=400",
      title: "Forest Path",
      date: "Last month",
      tags: ["nature", "forest"],
    },
    {
      id: "5",
      url: "/placeholder.svg?height=300&width=400",
      title: "Desert Dunes",
      date: "Last month",
      tags: ["desert", "landscape"],
    },
    {
      id: "6",
      url: "/placeholder.svg?height=300&width=400",
      title: "Snow Mountains",
      date: "Last month",
      tags: ["snow", "mountains"],
    },
  ]

  const filteredPhotos = photos.filter(
    (photo) =>
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const selectedPhotoData = photos.find((photo) => photo.id === selectedPhoto)

  const enhanceWithAI = () => {
    // Simulate AI enhancement
    setTimeout(() => {
      alert("Photo enhanced with AI!")
    }, 1000)
  }

  return (
    <div className="h-full flex flex-col bg-black/20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Photos</h2>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode("grid")}
              className={`text-white/70 hover:text-white hover:bg-white/10 ${viewMode === "grid" ? "bg-white/10" : ""}`}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setViewMode("list")}
              className={`text-white/70 hover:text-white hover:bg-white/10 ${viewMode === "list" ? "bg-white/10" : ""}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos..."
            className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Photos Grid */}
        <div className={`${selectedPhoto ? "w-1/2" : "w-full"} overflow-y-auto hide-scrollbar`}>
          <div className="p-4">
            <div className={`grid ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"} gap-4`}>
              {filteredPhotos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo.id)}
                  className={`rounded-lg overflow-hidden border ${
                    selectedPhoto === photo.id ? "border-blue-400" : "border-white/10"
                  } hover:border-white/30 transition-colors`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 bg-white/5">
                    <h3 className="text-white text-sm font-medium truncate">{photo.title}</h3>
                    <p className="text-white/50 text-xs">{photo.date}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Detail */}
        {selectedPhoto && selectedPhotoData && (
          <div className="w-1/2 border-l border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{selectedPhotoData.title}</h3>
                <Button
                  size="sm"
                  onClick={enhanceWithAI}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Enhance with AI
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              <div className="p-4">
                <div className="rounded-lg overflow-hidden mb-4">
                  <img
                    src={selectedPhotoData.url || "/placeholder.svg"}
                    alt={selectedPhotoData.title}
                    className="w-full h-auto object-contain"
                  />
                </div>

                <div className="mb-4">
                  <h4 className="text-white/70 text-sm mb-2">Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">Date</span>
                      <span className="text-white">{selectedPhotoData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Size</span>
                      <span className="text-white">3.2 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Resolution</span>
                      <span className="text-white">1920 x 1080</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white/70 text-sm mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPhotoData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/80 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
