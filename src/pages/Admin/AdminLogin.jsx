import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole } from 'lucide-react'
import { Button, Container, Input } from '../../components/common'
import { useAuth } from '../../context/useAuth'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function AdminLogin() {
  const { signIn, session, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const setField = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(values)
      navigate('/admin')
    } catch (signInError) {
      setError(signInError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-md">
        <div className="surface p-6 sm:p-8">
          <span className="grid size-11 place-items-center rounded-xl bg-brand-light text-brand-primary">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold text-brand-navy">
            Admin sign in
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-brand-navy/60">
            Only accounts provisioned by the store owner can manage products and
            orders. Public registration is not available.
          </p>

          {!isSupabaseConfigured && (
            <p className="mt-4 rounded-xl bg-brand-light p-3 text-sm text-brand-deep">
              Supabase is not configured. Add the project URL and key to `.env`
              before signing in.
            </p>
          )}

          {session && isAdmin && (
            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-brand-primary">
              You are signed in.
              <Link to="/admin" className="inline-flex items-center gap-1 font-bold hover:underline">
                Open dashboard
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={(event) => setField('email', event.target.value)}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={values.password}
              onChange={(event) => setField('password', event.target.value)}
            />
            {error && <p role="alert" className="text-sm text-danger">{error}</p>}
            <Button type="submit" size="lg" disabled={busy || !isSupabaseConfigured}>
              {busy ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </Container>
  )
}
