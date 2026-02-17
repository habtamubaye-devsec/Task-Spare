export interface Organization {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  isSuspended?: boolean
}
