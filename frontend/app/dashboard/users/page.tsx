'use client'

import { useState } from 'react'
import { useGetMyOrganizationQuery } from '@/store/api/organizationApi'
import {
  useGetOrgUsersQuery,
  useInviteUserMutation,
  useUpdateUserRoleMutation,
  useRemoveUserMutation,
} from '@/store/api/userApi'
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
import { Mail, Plus, Loader2, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Role } from '@/types/auth'

const inviteSchema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['ADMIN', 'MANAGER', 'MEMBER']),
})

type InviteFormData = z.infer<typeof inviteSchema>

export default function UsersPage() {
  const { data: org } = useGetMyOrganizationQuery()
  const { data: users = [], isLoading } = useGetOrgUsersQuery(undefined, {
    skip: !org?.id,
  })
  const [inviteUser, { isLoading: inviting }] = useInviteUserMutation()
  const [updateRole] = useUpdateUserRoleMutation()
  const [removeUser] = useRemoveUserMutation()
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'MEMBER' },
  })

  const onSubmit = async (data: InviteFormData) => {
    setError(null)
    try {
      await inviteUser({
        name: data.name,
        email: data.email,
        role: data.role as Role,
      }).unwrap()
      reset()
      setModalOpen(false)
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message
      setError(msg || 'Failed to invite user')
    }
  }

  const handleRoleChange = async (userId: string, role: Role) => {
    try {
      await updateRole({ id: userId, role }).unwrap()
    } catch {
      // Error handled by RTK
    }
  }

  const handleRemove = async (userId: string) => {
    if (!confirm('Remove this user from the organization?')) return
    try {
      await removeUser(userId).unwrap()
    } catch {
      // Error handled by RTK
    }
  }

  if (!org) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
        Create an organization first to manage team members.
        <Button variant="link" className="mt-2" asChild>
          <a href="/dashboard/org">Go to Organization</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Team
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage organization members and roles
          </p>
        </div>
        <Button
          className="rounded-xl font-semibold shrink-0"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Invite user
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : users.length === 0 ? (
        <Card className="rounded-2xl border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-lg">No members yet</CardTitle>
            <CardDescription className="mt-1 text-center">
              Invite users to your organization
            </CardDescription>
            <Button
              className="mt-4 rounded-xl font-semibold"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Invite user
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Members</CardTitle>
            <CardDescription>{users.length} members in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={user.role ?? 'MEMBER'}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value as Role)
                      }
                      className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MANAGER">Manager</option>
                      <option value="MEMBER">Member</option>
                    </select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemove(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); reset(); setError(null); }}
        title="Invite user"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            placeholder="Alex"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="alex@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="space-y-1">
            <label className="text-sm font-medium">Role</label>
            <select
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register('role')}
            >
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="MEMBER">Member</option>
            </select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            className="w-full rounded-xl font-semibold"
            disabled={inviting}
          >
            {inviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send invite
          </Button>
        </form>
      </Modal>
    </div>
  )
}
