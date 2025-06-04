"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  cover: string
}

export function MusicApp() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState([80])
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  const songs: Song[] = [
    {
      id: "1",
      title: "Digital Dreams",
      artist: "Neural Network",
      album: "AI Symphony",
      duration: "3:45",
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      title: "Quantum Beats",
      artist: "Algorithm",
      album: "Binary Rhythms",
      duration: "4:12",
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      title: "Silicon Harmony",
      artist: "Processor",
      album: "Digital Waves",
      duration: "3:21",
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "4",
      title: "Neural Funk",
      artist: "Deep Learning",
      album: "Machine Grooves",
      duration: "5:07",
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "5",
      title: "Algorithmic Melody",
      artist: "Code Runner",
      album: "Compiled Tracks",
      duration: "4:35",
      cover: "/placeholder.svg?height=80&width=80",
    },
  ]

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const playSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    setProgress(0)

    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval.current as NodeJS.Timeout)
          return 0
        }
        return prev + 0.5
      })
    }, 1000)
  }

  const togglePlayPause = () => {
    if (!currentSong) {
      if (songs.length > 0) {
        playSong(songs[0])
      }
      return
    }

    setIsPlaying(!isPlaying)

    if (isPlaying) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    } else {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval.current as NodeJS.Timeout)
            return 0
          }
          return prev + 0.5
        })
      }, 1000)
    }
  }

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [])

  return (
    <div className="h-full flex flex-col bg-black/20">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search music..."
            className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Song List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Library</h2>
            <div className="space-y-2">
              {filteredSongs.map((song) => (
                <button
                  key={song.id}
                  onClick={() => playSong(song)}
                  className={`w-full p-3 rounded-lg flex items-center space-x-3 transition-colors ${
                    currentSong?.id === song.id
                      ? "bg-blue-500/20 border border-blue-400/30"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <img src={song.cover || "/placeholder.svg"} alt={song.album} className="w-10 h-10 rounded" />
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-white text-sm font-medium truncate">{song.title}</h3>
                    <p className="text-white/60 text-xs truncate">{song.artist}</p>
                  </div>
                  <span className="text-white/50 text-xs">{song.duration}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Now Playing */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 flex flex-col">
          <div className="p-4 flex-1">
            <h2 className="text-lg font-semibold text-white mb-4">Now Playing</h2>
            {currentSong ? (
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-lg overflow-hidden mb-6">
                  <img
                    src={currentSong.cover || "/placeholder.svg"}
                    alt={currentSong.album}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-white font-medium text-lg mb-1">{currentSong.title}</h3>
                <p className="text-white/70 mb-4">{currentSong.artist}</p>
                <p className="text-white/50 text-sm mb-6">{currentSong.album}</p>

                <div className="w-full mb-6 overflow-y-auto hide-scrollbar">
                  <Slider value={[progress]} onValueChange={setProgress} max={100} step={0.1} className="mb-2" />
                  <div className="flex justify-between text-xs text-white/50">
                    <span>
                      {Math.floor((progress / 100) * Number.parseInt(currentSong.duration.split(":")[0]) * 60) +
                        Math.floor((progress / 100) * Number.parseInt(currentSong.duration.split(":")[1]))}
                      s
                    </span>
                    <span>{currentSong.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4 mb-6">
                  <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Shuffle className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={togglePlayPause}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-full w-12 h-12"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                    <SkipForward className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                    <Repeat className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center w-full space-x-3">
                  <Volume2 className="w-4 h-4 text-white/70" />
                  <Slider value={volume} onValueChange={setVolume} max={100} className="w-full" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-white/60">
                <p className="mb-2">No song selected</p>
                <p className="text-sm">Select a song from the library to play</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
