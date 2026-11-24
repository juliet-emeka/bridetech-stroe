import { useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profileState, setProfileState] = useState({ userId: null, role: null })
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session)
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const userId = session?.user?.id

  useEffect(() => {
    if (!userId || !isSupabaseConfigured) return

    let active = true
    supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setProfileState({ userId, role: data?.role ?? null })
      })

    return () => {
      active = false
    }
  }, [userId])

  const signIn = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin:
        profileState.userId === userId && profileState.role === 'admin',
      role: profileState.userId === userId ? profileState.role : null,
      loading,
      signIn,
      signOut,
    }),
    [session, userId, profileState, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
