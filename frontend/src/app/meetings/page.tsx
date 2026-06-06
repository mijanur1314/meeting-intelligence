'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import Link from 'next/link'

type Meeting = {
  id: string
  title: string
  date: string
}

export default function MeetingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const res = await api.get('/meetings')
      return res.data.data
    }
  })

  return (
    <div className="px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Library</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">Meetings</h2>
            <p className="mt-2 text-muted-foreground">Browse transcripts and the analysis attached to them.</p>
          </div>
          <Link href="/meetings/create" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            Upload meeting
          </Link>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border bg-card p-8 text-muted-foreground shadow-sm">Loading meetings...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.items?.map((meeting: Meeting) => (
              <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="group">
                <div className="h-full rounded-3xl border bg-card p-6 shadow-sm transition-colors group-hover:bg-muted/45">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Meeting</p>
                  <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-7">{meeting.title}</h3>
                  <div className="mt-6 text-sm text-muted-foreground">
                    {new Date(meeting.date).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
            {data?.items?.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed bg-card p-10 text-center shadow-sm">
                <p className="text-muted-foreground">No meetings yet. Upload one when you are ready.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
