import { useEffect, useState } from 'react'
import './App.css'

// In dev, Vite proxies /api to Django on :8000. In production the React
// build is served by Django itself, so relative /api just works.
const API = '/api'

function useFetch(path) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
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
  }, [path])

  return { data, error }
}

function Section({ title, error, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {error ? <p className="error">Couldn't load: {error}</p> : children}
    </section>
  )
}

function SchoolEvents() {
  const { data, error } = useFetch('/school-events/')
  return (
    <Section title="🎒 School Events" error={error}>
      {!data ? (
        <p className="muted">Loading…</p>
      ) : data.length === 0 ? (
        <p className="muted">No upcoming events.</p>
      ) : (
        <ul className="list">
          {data.map((e) => (
            <li key={e.id}>
              <div className="row">
                <strong>{e.title}</strong>
                <span className="badge">{e.date}</span>
              </div>
              {e.source && <div className="meta">via {e.source}</div>}
              {e.notes && <p className="notes">{e.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function Packages() {
  const { data, error } = useFetch('/packages/')
  return (
    <Section title="📦 Packages" error={error}>
      {!data ? (
        <p className="muted">Loading…</p>
      ) : data.length === 0 ? (
        <p className="muted">Nothing on the way.</p>
      ) : (
        <ul className="list">
          {data.map((p) => (
            <li key={p.id}>
              <div className="row">
                <strong>{p.carrier}</strong>
                <span className="badge badge-blue">{p.status}</span>
              </div>
              {p.expected_date && (
                <div className="meta">Expected {p.expected_date}</div>
              )}
              {p.tracking_note && <p className="notes">{p.tracking_note}</p>}
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function Digest() {
  const { data, error } = useFetch('/digest/')
  return (
    <Section title="✉️ Inbox Digest" error={error}>
      {!data ? (
        <p className="muted">Loading…</p>
      ) : (
        <ul className="digest">
          {data.map((d) => (
            <li key={d.id}>
              <span>{d.category}</span>
              <span className="count">{d.count}</span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

export default function App() {
  return (
    <div className="page">
      <header className="header">
        <h1>Family Hub</h1>
        <p>A quick glance at school, packages, and your inbox.</p>
      </header>
      <main className="grid">
        <SchoolEvents />
        <Packages />
        <Digest />
      </main>
    </div>
  )
}
