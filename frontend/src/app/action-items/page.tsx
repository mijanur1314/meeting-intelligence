'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'

type ActionItem = {
  id: string
  task: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  dueDate: string | null
  assigneeName: string | null
  assignee: { email: string } | null
}

const statusClasses: Record<ActionItem['status'], string> = {
  PENDING: 'bg-amber-50 text-amber-800 ring-amber-200',
  IN_PROGRESS: 'bg-sky-50 text-sky-800 ring-sky-200',
  COMPLETED: 'bg-emerald-50 text-emerald-800 ring-emerald-200'
}

export default function ActionItemsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['action-items'],
    queryFn: async () => {
      const res = await api.get('/action-items')
      return res.data.data
    }
  })

  return (
    <div className="px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Follow-through</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">Action items</h2>
          <p className="mt-2 text-muted-foreground">Track owners, status, and dates pulled from meeting discussions.</p>
        </div>
      
        {isLoading ? (
          <div className="rounded-3xl border bg-card p-8 text-muted-foreground shadow-sm">Loading action items...</div>
        ) : (
          <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/60">
                <tr>
                  <th className="px-6 py-4 font-semibold">Task</th>
                  <th className="px-6 py-4 font-semibold">Assignee</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Due date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.map((item: ActionItem) => (
                  <tr key={item.id} className="transition-colors hover:bg-muted/35">
                    <td className="px-6 py-4 font-medium">{item.task}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.assigneeName || item.assignee?.email || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClasses[item.status]}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Not set'}
                    </td>
                  </tr>
                ))}
                {data?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                      No action items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
