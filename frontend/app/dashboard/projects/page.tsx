'use client'

import { useGetMyOrganizationQuery } from '@/store/api/organizationApi'
import { useGetProjectsQuery } from '@/store/api/projectApi'
import { useCreateProjectMutation } from '@/store/api/projectApi'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { FolderOpen, Plus, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function ProjectsPage() {
  const { data: org } = useGetMyOrganizationQuery()
  const { data: projects = [], isLoading } = useGetProjectsQuery(undefined, { skip: !org?.id })
  const [createProject, { isLoading: creating }] = useCreateProjectMutation()
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      await createProject({ name: data.name, description: data.description }).unwrap()
      reset()
      setModalOpen(false)
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      setError(msg || 'Failed to create project')
    }
  }

  if (!org) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
        Create an organization first to add projects.
        <Button variant="link" className="mt-2" asChild>
          <Link href="/dashboard/org">Go to Organization</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your projects and tasks
          </p>
        </div>
        <Button
          className="rounded-xl font-semibold shrink-0"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-lg">No projects yet</CardTitle>
            <CardDescription className="mt-1 text-center">
              Create your first project to start adding tasks
            </CardDescription>
            <Button
              className="mt-4 rounded-xl font-semibold"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="rounded-2xl border-border bg-card transition-colors hover:border-primary/30 hover:bg-card/80 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold line-clamp-1">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {(project as { _count?: { tasks: number } })._count?.tasks ?? 0} tasks
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset(); setError(null); }}
        title="New project"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Project name"
            placeholder="Website redesign"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Description (optional)"
            placeholder="Brief description"
            error={errors.description?.message}
            {...register('description')}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full rounded-xl font-semibold"
            disabled={creating}
          >
            {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create project
          </Button>
        </form>
      </Modal>
    </div>
  )
}
