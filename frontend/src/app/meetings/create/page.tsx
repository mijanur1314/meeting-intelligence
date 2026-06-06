'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

export default function CreateMeetingPage() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [transcript, setTranscript] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const parseTranscript = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim() !== '')
    const segments = []
    const regex = /^\[([\d:]+)\]\s+([^:]+):\s+(.*)$/
    
    for (const line of lines) {
      const match = line.match(regex)
      if (match) {
        segments.push({
          timestamp: match[1],
          speaker: match[2].trim(),
          text: match[3].trim()
        })
      } else {
        segments.push({
          timestamp: "00:00",
          speaker: "Unknown",
          text: line.trim()
        })
      }
    }
    return segments.length > 0 ? segments : [{ timestamp: "00:00", speaker: "System", text }]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await api.post('/meetings', {
        title,
        date: new Date(date).toISOString(),
        transcripts: parseTranscript(transcript),
        participants: []
      })
      router.push(`/meetings/${res.data.data.id}`)
    } catch (err) {
      console.error(err)
      alert("Failed to create meeting")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">New transcript</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Upload meeting</h2>
          <p className="mt-2 text-muted-foreground">Paste the raw transcript now. You can review analysis after it saves.</p>
        </div>
      
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5 rounded-3xl border bg-card p-6 shadow-sm">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                required
                className="w-full rounded-xl border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:max-w-xs">
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                required
                className="w-full rounded-xl border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium">Raw transcript</label>
              <textarea
                required
                placeholder="Paste transcript text here..."
                className="min-h-[260px] w-full rounded-xl border bg-background px-4 py-3 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="rounded-full border bg-card px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save and continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
