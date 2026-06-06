'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import { useParams } from 'next/navigation'

type Citation = {
  timestamp: string
  speaker?: string
}

type Insight = {
  text: string
  citations: Citation[]
}

type ActionItem = Insight & {
  assignee?: string
  dueDate?: string | null
}

type AnalysisResponse = {
  analysis: {
    summary: Insight[]
    decisions: Insight[]
    followUps: Insight[]
  } | null
  actionItems: ActionItem[]
}

const formatCitations = (citations: Citation[]) =>
  citations.map(({ timestamp, speaker }) => speaker ? `${timestamp} - ${speaker}` : timestamp).join(' | ')

export default function MeetingDetailsPage() {
  const params = useParams()
  const queryClient = useQueryClient()
  const id = params.id as string

  const { data: meeting, isLoading } = useQuery({
    queryKey: ['meeting', id],
    queryFn: async () => {
      const res = await api.get(`/meetings/${id}`)
      return res.data.data
    }
  })

  const { data: analysisData, isLoading: analysisLoading } = useQuery<AnalysisResponse>({
    queryKey: ['analysis', id],
    queryFn: async () => {
      const res = await api.get(`/meetings/${id}/analysis`)
      return res.data.data
    }
  })

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/meetings/${id}/analyze`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analysis', id] })
    }
  })

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading meeting...</div>
  if (!meeting) return <div className="p-8 text-muted-foreground">Meeting not found</div>

  return (
    <div className="px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Meeting detail</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">{meeting.title}</h2>
            <p className="mt-2 text-muted-foreground">{new Date(meeting.date).toLocaleDateString()}</p>
          </div>
          <button
            onClick={() => analyzeMutation.mutate()}
            disabled={analyzeMutation.isPending || analysisLoading}
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {analyzeMutation.isPending ? 'Analyzing...' : 'Run analysis'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {!analysisData?.analysis && !analysisLoading && (
              <div className="rounded-3xl border border-dashed bg-card p-12 text-center shadow-sm">
                <h3 className="text-lg font-semibold">No analysis yet</h3>
                <p className="mt-2 text-muted-foreground">Run analysis to create a cited summary, decisions, and follow-up list.</p>
              </div>
            )}

            {analysisData?.analysis && (
              <div className="space-y-6">
                <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                  <div className="border-b bg-muted/60 px-6 py-4 font-semibold">Executive summary</div>
                  <div className="space-y-5 p-6">
                    {analysisData.analysis.summary.map((summary, idx) => (
                      <div key={idx}>
                        <p className="leading-7">{summary.text}</p>
                        <div className="mt-3 inline-block rounded-xl border bg-background px-3 py-2 text-xs text-muted-foreground">
                          <span className="font-semibold text-primary">Citation:</span> {formatCitations(summary.citations)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                  <div className="border-b bg-muted/60 px-6 py-4 font-semibold">Decisions</div>
                  <div className="space-y-4 p-6">
                    {analysisData.analysis.decisions.map((decision, idx) => (
                      <div key={idx} className="rounded-2xl border bg-background p-4">
                        <p className="font-medium leading-7">{decision.text}</p>
                        <div className="mt-3 rounded-xl bg-card px-3 py-2 text-xs text-muted-foreground ring-1 ring-border">
                          <span className="font-semibold text-primary">Citation:</span> {formatCitations(decision.citations)}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b bg-muted/60 px-5 py-4 font-semibold">
                Action items
                {analysisData?.actionItems && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {analysisData.actionItems.length}
                  </span>
                )}
              </div>
              <div className="space-y-3 p-5">
                {analysisData?.actionItems.length ? analysisData.actionItems.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border bg-background p-4 text-sm">
                    <div className="font-medium leading-6">{item.text}</div>
                    <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
                      <span>{item.assignee || 'Unassigned'}</span>
                      <span>{formatCitations(item.citations)}</span>
                    </div>
                  </div>
                )) : (
                  <p className="py-5 text-center text-sm text-muted-foreground">No action items extracted yet.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
