import { useEffect, useState } from 'react'

// Same-origin API. In dev, Vite proxies /api to Django on :8000.
// In production Django serves the React build itself, so relative
// paths just work with the session cookie.
const API = '/api'

export function useApi(path) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setError(null)
    fetch(`${API}${path}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) setData(json)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [path, retryKey])

  return { data, error, retry: () => setRetryKey((k) => k + 1) }
}
