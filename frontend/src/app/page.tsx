'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface ActionItem {
  id: string;
  task: string;
  status: string;
  dueDate?: string;
  citations?: { timestamp: string; speaker: string; }[];
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    meetings: 0,
    actionItems: 0,
    pending: 0,
    overdue: 0
  });
  const [recentAction, setRecentAction] = useState<ActionItem | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);

    if (token) {
      Promise.all([
        api.get('/meetings'),
        api.get('/action-items')
      ]).then(([meetingsRes, actionItemsRes]) => {
        const meetingsData = meetingsRes.data.data;
        const actionItemsData = actionItemsRes.data.data.items || [];
        
        const meetingsCount = meetingsData.pagination ? meetingsData.pagination.total : meetingsData.items.length;
        const pendingCount = actionItemsData.filter((i: ActionItem) => i.status === 'PENDING').length;
        const overdueCount = actionItemsData.filter((i: ActionItem) => {
          if (i.status !== 'PENDING' || !i.dueDate) return false;
          return new Date(i.dueDate) < new Date();
        }).length;

        setStats({
          meetings: meetingsCount,
          actionItems: actionItemsData.length,
          pending: pendingCount,
          overdue: overdueCount
        });

        if (actionItemsData.length > 0) {
          setRecentAction(actionItemsData[0]);
        }
      }).catch(console.error);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(196,106,69,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(40,81,95,0.16),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div>
            <div className="mb-8 inline-flex items-center rounded-full border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
              <span className="mr-3 h-2 w-2 rounded-full bg-accent"></span>
              Built for messy meeting notes, owners, and deadlines
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.045em] text-foreground md:text-7xl">
              Turn meeting transcripts into work people can trust.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              Upload a transcript, review cited decisions, and keep action items moving without digging through pages of notes.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
                Start a workspace
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-full border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted">
                Sign in
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border bg-card p-5 shadow-[0_24px_70px_rgba(40,61,76,0.14)]">
            <div className="rounded-[1.5rem] border bg-background p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Product sync</p>
                  <h2 className="mt-1 text-xl font-semibold">Friday planning notes</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">Reviewed</span>
              </div>
              <div className="space-y-3">
                {[
                  ['Decision', 'Keep the beta launch on Friday, with support coverage ready by Thursday.'],
                  ['Owner', 'Maya to publish release notes and send the customer email draft.'],
                  ['Follow-up', 'Confirm whether analytics events are landing before Wednesday standup.']
                ].map(([label, text]) => (
                  <div key={label} className="rounded-2xl border bg-card p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">{label}</span>
                      <span className="text-xs text-muted-foreground">00:12</span>
                    </div>
                    <p className="text-sm leading-6 text-foreground">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/15">
                <p className="text-sm font-medium text-primary">Citation trail</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">&quot;Let&apos;s keep Friday, but make sure support has the handoff first.&quot;</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Dashboard</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">Welcome back.</h2>
            <p className="mt-3 text-muted-foreground">A quick view of meetings, open work, and recent analysis.</p>
          </div>
          <Link href="/meetings/create" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            New meeting
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Meetings reviewed', val: stats.meetings.toString(), note: 'All time' },
            { title: 'Action items', val: stats.actionItems.toString(), note: 'Across all meetings' },
            { title: 'Pending', val: stats.pending.toString(), note: 'Open tasks' },
            { title: 'Overdue', val: stats.overdue.toString(), note: 'Past due date' }
          ].map((stat, i) => (
            <div key={i} className="rounded-3xl border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
              <div className="mt-3 text-4xl font-semibold tracking-tight">{stat.val}</div>
              <p className="mt-3 text-sm text-muted-foreground">{stat.note}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight">Recent review</h3>
            <Link href="/meetings" className="text-sm font-semibold text-primary hover:text-primary/80">View meetings</Link>
          </div>

          {recentAction && (
            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <div className="rounded-2xl border bg-background p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">Action item</p>
                    <p className="mt-2 text-lg font-medium">{recentAction.task}</p>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {recentAction.status}
                  </span>
                </div>
                {recentAction.citations && recentAction.citations.length > 0 && (
                  <div className="mt-5 rounded-2xl bg-card p-4 text-sm leading-6 text-muted-foreground ring-1 ring-border">
                    <span className="font-semibold text-foreground">Citation:</span> 
                    <span className="ml-2 font-mono text-xs">{recentAction.citations[0].timestamp} - {recentAction.citations[0].speaker}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
