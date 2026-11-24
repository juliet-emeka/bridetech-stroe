import { Navigate } from 'react-router-dom'
import { LogOut, ShieldAlert } from 'lucide-react'
import { Button, EmptyState, LoadingState } from '../common'
import { useAuth } from '../../context/useAuth'

export default function AdminRoute({ children }) {
  const { loading, session, isAdmin, signOut } = useAuth()

  if (loading) return <LoadingState label="Checking admin access…" />
  if (!session) return <Navigate to="/admin/login" replace />

  if (!isAdmin) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Admin access required"
        description="This account does not have administrator permissions. Contact the store owner if you believe this is a mistake."
        action={
          <Button variant="outline" onClick={() => signOut()}>
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        }
      />
    )
  }

  return children
}
