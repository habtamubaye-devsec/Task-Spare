export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface TaskUser {
  id: string
  email: string
  name?: string
}

export interface Comment {
  id: string
  content: string
  taskId: string
  authorId: string
  orgId: string
  author?: TaskUser
  createdAt?: string
  updatedAt?: string
}

export interface Task {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  projectId: string
  creatorId: string
  assigneeId?: string | null
  orgId: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  assignee?: TaskUser | null
  creator?: TaskUser | null
  comments?: Comment[]
  project?: { id: string; name: string }
}
