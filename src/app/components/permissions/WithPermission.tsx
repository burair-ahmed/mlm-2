'use client'
import { ReactNode } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { hasPermission } from '../../../../lib/auth/permissions'

interface WithPermissionProps {
  slug: string
  children: ReactNode
  fallback?: ReactNode
}

export function WithPermission({
  slug,
  children,
  fallback = null,
}: WithPermissionProps) {
  const { user, loading } = useAuth()

  // While we’re still fetching user info, render nothing
  if (loading) return null

  // If the user has the right permission, render the children
  if (hasPermission(user, slug)) {
    return <>{children}</>
  }

  // Otherwise render the fallback (or nothing, if you didn’t pass one)
  return <>{fallback}</>
}
