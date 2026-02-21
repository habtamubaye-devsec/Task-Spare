import type { Task } from './task'

export interface Project {
  id: string
  name: string
  description?: string | null
  organizationId: string
  createdAt: string
  updatedAt?: string
  deletedAt?: string | null
  tasks?: Task[]
  _count?: { tasks: number }
}
