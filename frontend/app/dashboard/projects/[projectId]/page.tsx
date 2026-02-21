'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useGetProjectQuery } from '@/store/api/projectApi'
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '@/store/api/taskApi'
import { useGetOrgUsersQuery } from '@/store/api/userApi'
import { useCreateCommentMutation } from '@/store/api/commentApi'
import { useGetTaskQuery } from '@/store/api/taskApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import {
  Plus,
  Loader2,
  CheckCircle2,
  Circle,
  ArrowLeft,
  MessageSquare,
  Trash2,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Task } from '@/types/task'

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title required'),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
})

type CreateTaskFormData = z.infer<typeof createTaskSchema>

const commentSchema = z.object({ content: z.string().min(1, 'Comment required') })
type CommentFormData = z.infer<typeof commentSchema>

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const { data: project, isLoading: projectLoading } = useGetProjectQuery(projectId)
  const { data: tasks = [], isLoading: tasksLoading } = useGetTasksQuery(projectId)
  const { data: users = [] } = useGetOrgUsersQuery(undefined, { skip: !projectId })
  const [createTask, { isLoading: creating }] = useCreateTaskMutation()
  const [updateTask] = useUpdateTaskMutation()
  const [deleteTask] = useDeleteTaskMutation()
  const [createComment, { isLoading: commenting }] = useCreateCommentMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
  })

  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    reset: resetComment,
  } = useForm<CommentFormData>({ resolver: zodResolver(commentSchema) })

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      await createTask({
        title: data.title,
        description: data.description,
        projectId,
        assigneeId: data.assigneeId || undefined,
      }).unwrap()
      setModalOpen(false)
      reset()
    } catch {
      // Error handled by RTK
    }
  }

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE'
    try {
      await updateTask({ id: task.id, status: newStatus }).unwrap()
    } catch {
      // Error handled by RTK
    }
  }

  const onCommentSubmit = async (data: CommentFormData) => {
    if (!selectedTask) return
    try {
      await createComment({ content: data.content, taskId: selectedTask.id }).unwrap()
      resetComment()
    } catch {
      // Error handled by RTK
    }
  }

  if (projectLoading || !project) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/dashboard/projects"
            className="text-sm font-medium text-muted-foreground hover:text-foreground mb-1 inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Projects
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {project.name}
          </h1>
          <CardDescription className="mt-1">
            {project.description || 'No description'}
          </CardDescription>
        </div>
        <Button
          className="rounded-xl font-semibold shrink-0"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New task
        </Button>
      </div>

      {tasksLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : tasks.length === 0 ? (
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-lg">No tasks yet</CardTitle>
            <CardDescription className="mt-1 text-center">
              Create your first task for this project
            </CardDescription>
            <Button
              className="mt-4 rounded-xl font-semibold"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="rounded-2xl border-border bg-card transition-colors hover:border-primary/20"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => toggleStatus(task)}
                  className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                >
                  {task.status === 'DONE' ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </button>
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <h3
                    className={`font-medium ${
                      task.status === 'DONE'
                        ? 'line-through text-muted-foreground'
                        : 'text-foreground'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {task.description || 'No description'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-lg ${
                      task.status === 'TODO'
                        ? 'bg-muted text-muted-foreground'
                        : task.status === 'IN_PROGRESS'
                          ? 'bg-primary/15 text-primary'
                          : 'bg-primary/15 text-primary'
                    }`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                  {task.assignee && (
                    <span
                      className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-semibold"
                      title={task.assignee.email}
                    >
                      {(task.assignee.name || task.assignee.email)[0].toUpperCase()}
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm('Delete this task?')) deleteTask(task.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset(); }}
        title="New task"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            placeholder="Fix login bug"
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="space-y-1">
            <label className="text-sm font-medium">Description (optional)</label>
            <textarea
              className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Details..."
              {...register('description')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Assignee (optional)</label>
            <select
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register('assigneeId')}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            className="w-full rounded-xl font-semibold"
            disabled={creating}
          >
            {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create task
          </Button>
        </form>
      </Modal>

      {selectedTask && (
        <TaskDetailModal
          taskId={selectedTask.id}
          onClose={() => setSelectedTask(null)}
          onCommentSubmit={onCommentSubmit}
          registerComment={registerComment}
          handleCommentSubmit={handleCommentSubmit}
          resetComment={resetComment}
          commenting={commenting}
        />
      )}
    </div>
  )
}

function TaskDetailModal({
  taskId,
  onClose,
  onCommentSubmit,
  registerComment,
  handleCommentSubmit,
  resetComment,
  commenting,
}: {
  taskId: string
  onClose: () => void
  onCommentSubmit: (data: CommentFormData) => Promise<void>
  registerComment: (name: 'content') => ReturnType<typeof useForm>['register']
  handleCommentSubmit: (e: React.BaseSyntheticEvent) => void
  resetComment: () => void
  commenting: boolean
}) {
  const { data: task, isLoading } = useGetTaskQuery(taskId)
  const comments = task?.comments ?? []
  if (isLoading || !task) {
    return (
      <Modal isOpen onClose={onClose} title="Task">
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Modal>
    )
  }
  return (
    <Modal isOpen onClose={onClose} title={task.title}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {task.description || 'No description'}
        </p>
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments ({comments.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-auto">
            {comments.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-sm"
              >
                <p className="text-foreground">{c.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {c.author?.email ?? 'Unknown'} · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                </p>
              </div>
            ))}
          </div>
          <form
              onSubmit={handleCommentSubmit((data) => {
                onCommentSubmit(data).then(() => resetComment())
              })}
              className="mt-3 flex gap-2"
            >
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...registerComment('content')}
            />
            <Button
              type="submit"
              size="sm"
              className="rounded-xl font-semibold"
              disabled={commenting}
            >
              {commenting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}
