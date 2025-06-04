"use client"

import { useState } from "react"
import {
  Search,
  Folder,
  File,
  ImageIcon,
  FileText,
  Music,
  Video,
  Download,
  Upload,
  Trash2,
  Star,
  MoreVertical,
  Grid,
  List,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FileItem {
  id: string
  name: string
  type: "folder" | "file"
  fileType?: "image" | "document" | "music" | "video" | "other"
  size?: string
  modified: string
  starred: boolean
}

export function FilesApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [currentPath, setCurrentPath] = useState("/")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const files: FileItem[] = [
    {
      id: "1",
      name: "Documents",
      type: "folder",
      modified: "2 days ago",
      starred: false,
    },
    {
      id: "2",
      name: "Photos",
      type: "folder",
      modified: "1 week ago",
      starred: true,
    },
    {
      id: "3",
      name: "Music",
      type: "folder",
      modified: "3 days ago",
      starred: false,
    },
    {
      id: "4",
      name: "Project Report.pdf",
      type: "file",
      fileType: "document",
      size: "2.4 MB",
      modified: "1 hour ago",
      starred: false,
    },
    {
      id: "5",
      name: "Vacation Photo.jpg",
      type: "file",
      fileType: "image",
      size: "1.8 MB",
      modified: "3 hours ago",
      starred: true,
    },
    {
      id: "6",
      name: "Presentation.pptx",
      type: "file",
      fileType: "document",
      size: "5.2 MB",
      modified: "1 day ago",
      starred: false,
    },
    {
      id: "7",
      name: "Song.mp3",
      type: "file",
      fileType: "music",
      size: "4.1 MB",
      modified: "2 days ago",
      starred: false,
    },
    {
      id: "8",
      name: "Demo Video.mp4",
      type: "file",
      fileType: "video",
      size: "15.7 MB",
      modified: "5 hours ago",
      starred: true,
    },
  ]

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getFileIcon = (file: FileItem) => {
    if (file.type === "folder") {
      return <Folder className="w-5 h-5 text-blue-400" />
    }

    switch (file.fileType) {
      case "image":
        return <ImageIcon className="w-5 h-5 text-green-400" />
      case "document":
        return <FileText className="w-5 h-5 text-red-400" />
      case "music":
        return <Music className="w-5 h-5 text-purple-400" />
      case "video":
        return <Video className="w-5 h-5 text-orange-400" />
      default:
        return <File className="w-5 h-5 text-gray-400" />
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleStar = (id: string) => {
    // In a real app, this would update the backend
    console.log(`Toggle star for file ${id}`)
  }

  return (
    <div className="h-full flex bg-black/20">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 bg-white/5 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-4">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <div className="space-y-1">
            <button className="w-full text-left p-2 rounded-lg hover:bg-white/10 text-white/80 text-sm">Recent</button>
            <button className="w-full text-left p-2 rounded-lg hover:bg-white/10 text-white/80 text-sm">Starred</button>
            <button className="w-full text-left p-2 rounded-lg hover:bg-white/10 text-white/80 text-sm">Shared</button>
            <button className="w-full text-left p-2 rounded-lg hover:bg-white/10 text-white/80 text-sm">Trash</button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white/70 text-sm font-medium mb-3">Storage</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Used</span>
              <span className="text-white/90">15.2 GB</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Free</span>
              <span className="text-white/90">18.8 GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-white/70">Home</span>
              <span className="text-white/50">/</span>
              <span className="text-white">Files</span>
            </div>
            <div className="flex items-center space-x-2">
              {selectedItems.length > 0 && (
                <>
                  <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setViewMode("list")}
                className={`text-white/70 hover:text-white hover:bg-white/10 ${
                  viewMode === "list" ? "bg-white/10" : ""
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setViewMode("grid")}
                className={`text-white/70 hover:text-white hover:bg-white/10 ${
                  viewMode === "grid" ? "bg-white/10" : ""
                }`}
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="p-4">
            {viewMode === "list" ? (
              <div className="space-y-1">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center space-x-4 p-3 rounded-lg transition-colors cursor-pointer ${
                      selectedItems.includes(file.id) ? "bg-blue-500/20 border border-blue-400/30" : "hover:bg-white/5"
                    }`}
                    onClick={() => toggleSelection(file.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(file.id)}
                      onChange={() => toggleSelection(file.id)}
                      className="rounded border-white/20 bg-white/10"
                    />
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white text-sm font-medium truncate">{file.name}</h3>
                    </div>
                    <div className="text-white/60 text-sm w-20 text-right">{file.size || "—"}</div>
                    <div className="text-white/60 text-sm w-24 text-right">{file.modified}</div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStar(file.id)
                      }}
                      className="text-white/50 hover:text-white hover:bg-white/10"
                    >
                      <Star className={`w-4 h-4 ${file.starred ? "text-yellow-400 fill-current" : ""}`} />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`p-4 rounded-lg transition-colors cursor-pointer ${
                      selectedItems.includes(file.id)
                        ? "bg-blue-500/20 border border-blue-400/30"
                        : "hover:bg-white/5 border border-white/10"
                    }`}
                    onClick={() => toggleSelection(file.id)}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        {file.type === "folder" ? (
                          <Folder className="w-12 h-12 text-blue-400" />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center">{getFileIcon(file)}</div>
                        )}
                      </div>
                      <h3 className="text-white text-sm font-medium truncate mb-1">{file.name}</h3>
                      <p className="text-white/60 text-xs">{file.size || file.modified}</p>
                      {file.starred && <Star className="w-3 h-3 text-yellow-400 fill-current mx-auto mt-1" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
