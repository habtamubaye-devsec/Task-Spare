'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useGetMyOrganizationQuery } from '@/store/api/organizationApi'
import { useGetProjectsQuery } from '@/store/api/projectApi'
import { useGetTasksQuery } from '@/store/api/taskApi'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle, Loader2, ArrowRight } from 'lucide-react'
import type { TaskStatus } from '@/types/task'

const tabs: { id: 'all' | TaskStatus; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'TODO', label: 'To do' },
  { id: 'IN_PROGRESS', label: 'In progress' },
  { id: 'DONE', label: 'Done' },
]

export default function TasksPage() {
  const { data: org } = useGetMyOrganizationQuery()
  const { data: projects = [] } = useGetProjectsQuery(undefined, { skip: !org?.id })
  const { data: tasks = [], isLoading } = useGetTasksQuery(undefined, { skip: !org?.id })
  const [activeTab, setActiveTab] = useState<'all' | TaskStatus>('all')
  const [projectFilter, setProjectFilter] = useState<string>('')

  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.name]))
  const filtered = tasks.filter((t) => {
    const matchStatus = activeTab === 'all' || t.status === activeTab
    const matchProject = !projectFilter || t.projectId === projectFilter
    return matchStatus && matchProject
  })

  if (!org) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
        Create an organization first to see tasks.
        <Link href="/dashboard/org" className="mt-2 block font-medium text-primary">
          Go to Organization
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Tasks
        </h1>
        <p className="mt-1 text-muted-foreground">
          View and filter all tasks across projects
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex rounded-xl border border-border bg-card p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-lg">No tasks match</CardTitle>
            <CardDescription className="mt-1 text-center">
              Change filters or create tasks from a project
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <Link
              key={task.id}
              href={`/dashboard/projects/${task.projectId}`}
              className="block"
            >
              <Card className="rounded-2xl border-border bg-card transition-colors hover:border-primary/20 hover:bg-card/80">
                <CardContent className="p-4 flex items-center gap-4">
                  {task.status === 'DONE' ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-medium ${
                        task.status === 'DONE'
                          ? 'line-through text-muted-foreground'
                          : 'text-foreground'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {projectMap[task.projectId] ?? 'Project'} · {task.status.replace('_', ' ')}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
