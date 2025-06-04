"use client"

import { useState } from "react"
import { Plus, Search, Edit3, Trash2, Star, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Note {
  id: string
  title: string
  content: string
  timestamp: Date
  isStarred: boolean
}

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "AI-Generated Meeting Summary",
      content:
        "Key points from today's team meeting:\n\n• Project timeline updated\n• New features prioritized\n• Budget allocation discussed\n\nAI Insight: Consider scheduling follow-up meetings for detailed planning.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isStarred: true,
    },
    {
      id: "2",
      title: "Ideas for WebOS Enhancement",
      content:
        "Brainstorming session notes:\n\n• Improved gesture controls\n• Better AI integration\n• Enhanced privacy features\n• Developer API improvements",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isStarred: false,
    },
  ])
  const [selectedNote, setSelectedNote] = useState<string | null>(notes[0]?.id || null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedNoteData = notes.find((note) => note.id === selectedNote)

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "",
      timestamp: new Date(),
      isStarred: false,
    }
    setNotes((prev) => [newNote, ...prev])
    setSelectedNote(newNote.id)
    setIsEditing(true)
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...updates, timestamp: new Date() } : note)))
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
    if (selectedNote === id) {
      setSelectedNote(notes.find((note) => note.id !== id)?.id || null)
    }
  }

  const generateAISummary = () => {
    if (!selectedNoteData) return

    const aiSummary =
      "\n\n--- AI Summary ---\nThis note contains important information about project planning and team coordination. Key action items have been identified for follow-up."
    updateNote(selectedNoteData.id, {
      content: selectedNoteData.content + aiSummary,
    })
  }

  return (
    <div className="h-full flex bg-black/20">
      {/* Notes List */}
      <div className="w-1/3 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-2 mb-3">
            <Button size="sm" onClick={createNewNote} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-1" />
              New Note
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="p-2">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => {
                  setSelectedNote(note.id)
                  setIsEditing(false)
                }}
                className={`w-full p-3 rounded-lg text-left transition-colors mb-1 ${
                  selectedNote === note.id ? "bg-blue-500/20 border border-blue-400/30" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white truncate flex-1">{note.title}</span>
                  {note.isStarred && <Star className="w-3 h-3 text-yellow-400 fill-current ml-2" />}
                </div>
                <p className="text-xs text-white/50 line-clamp-2 mb-1">{note.content}</p>
                <span className="text-xs text-white/40">{note.timestamp.toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Note Content */}
      <div className="flex-1 flex flex-col">
        {selectedNoteData ? (
          <>
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <Input
                    value={selectedNoteData.title}
                    onChange={(e) => updateNote(selectedNoteData.id, { title: e.target.value })}
                    className="bg-transparent border-none text-lg font-semibold text-white p-0 focus:ring-0"
                  />
                ) : (
                  <h2 className="text-lg font-semibold text-white">{selectedNoteData.title}</h2>
                )}

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={generateAISummary}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    title="Generate AI Summary"
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateNote(selectedNoteData.id, { isStarred: !selectedNoteData.isStarred })}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Star className={`w-4 h-4 ${selectedNoteData.isStarred ? "text-yellow-400 fill-current" : ""}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNote(selectedNoteData.id)}
                    className="text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-white/50 mt-2">
                Last modified: {selectedNoteData.timestamp.toLocaleString()}
              </div>
            </div>

            <div className="flex-1 p-4">
              {isEditing ? (
                <Textarea
                  value={selectedNoteData.content}
                  onChange={(e) => updateNote(selectedNoteData.id, { content: e.target.value })}
                  className="w-full h-full bg-transparent border-none text-white placeholder:text-white/50 resize-none focus:ring-0"
                  placeholder="Start writing..."
                />
              ) : (
                <div className="h-full overflow-y-auto hide-scrollbar">
                  <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                    {selectedNoteData.content || "This note is empty. Click the edit button to add content."}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/60">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Select a note</h3>
              <p>Choose a note from the list to view and edit its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
