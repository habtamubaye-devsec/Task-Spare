'use client'

import { useGetMyOrganizationQuery } from '@/store/api/organizationApi'

export function Header() {
  const { data: org } = useGetMyOrganizationQuery(undefined, {
    skip: typeof window === 'undefined',
  })

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          {org?.name ?? 'No organization'}
        </span>
      </div>
    </header>
  )
}
