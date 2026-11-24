import { useEffect, useState } from 'react'

export function useAsyncResource(loader, key) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let active = true
    loader()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null })
      })
      .catch((error) => {
        if (active) setState({ data: null, loading: false, error })
      })
    return () => {
      active = false
    }
  }, [key, loader])

  return state
}
