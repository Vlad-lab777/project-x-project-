import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

const AUTH_KEY = 'detail_auth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuth = !!localStorage.getItem(AUTH_KEY)
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />
}

export const AUTH_KEY_EXPORT = AUTH_KEY
