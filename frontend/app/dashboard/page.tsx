'use client'

import { useGetMyOrganizationQuery } from '@/store/api/organizationApi'
import { useGetProjectsQuery } from '@/store/api/projectApi'
import { useGetTasksQuery } from '@/store/api/taskApi'
import Link from 'next/link'
import { Building2, FolderOpen, CheckSquare, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const { data: org, isLoading: orgLoading } = useGetMyOrganizationQuery()
  const { data: projects = [] } = useGetProjectsQuery(undefined, { skip: !org?.id })
  const { data: tasks = [] } = useGetTasksQuery(undefined, { skip: !org?.id })

  const todoCount = tasks.filter((t) => t.status === 'TODO').length
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length
  const doneCount = tasks.filter((t) => t.status === 'DONE').length

  if (orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!org) {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="glass rounded-2xl border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create your organization
            </CardTitle>
            <CardDescription>
              You need an organization to manage projects and tasks. Create one to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild className="rounded-xl font-semibold">
              <Link href="/dashboard/org">
                <Plus className="mr-2 h-4 w-4" />
                Create organization
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your organization
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projects
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{projects.length}</p>
            <Button variant="link" className="h-auto p-0 text-primary" asChild>
              <Link href="/dashboard/projects">View all</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              To do
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{todoCount}</p>
            <Button variant="link" className="h-auto p-0 text-primary" asChild>
              <Link href="/dashboard/tasks">View tasks</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{inProgressCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Done
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{doneCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Organization</CardTitle>
              <CardDescription>{org.name}</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <Link href="/dashboard/org">
                <Building2 className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Quick actions</CardTitle>
            <Button className="rounded-xl font-semibold" asChild>
              <Link href="/dashboard/projects">
                <Plus className="mr-2 h-4 w-4" />
                New project
              </Link>
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
