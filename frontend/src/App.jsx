import { useMemo, useState } from 'react'
import './App.css'
import { useApi } from './api'
import { addDays, dayKey, fmtLong, fmtToday, startOfWeek } from './dates'
import WeekStrip from './components/WeekStrip'
import Agenda from './components/Agenda'
import Packages from './components/Packages'
import Digest from './components/Digest'

export default function App() {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const todayKey = dayKey(today)

  const weekDays = useMemo(() => {
    const start = startOfWeek(today)
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [today])

  // Tapping a day in the strip filters the agenda; tapping again clears.
  const [selectedKey, setSelectedKey] = useState(null)

  const eventsReq = useApi('/school-events/')
  const packagesReq = useApi('/packages/')
  const digestReq = useApi('/digest/')

  const events = useMemo(() => {
    if (!eventsReq.data) return null
    return [...eventsReq.data].sort((a, b) => a.date.localeCompare(b.date))
  }, [eventsReq.data])

  const eventCounts = useMemo(() => {
    const counts = {}
    for (const e of events ?? []) counts[e.date] = (counts[e.date] || 0) + 1
    return counts
  }, [events])

  const visibleEvents = useMemo(() => {
    if (!events) return null
    return selectedKey ? events.filter((e) => e.date === selectedKey) : events
  }, [events, selectedKey])

  const selectedDay = selectedKey
    ? weekDays.find((d) => dayKey(d) === selectedKey)
    : null

  return (
    <div className="app">
      <header className="site-header">
        <div>
          <h1>Family Hub</h1>
          <p className="dateline">{fmtToday(today)}</p>
        </div>
        {selectedKey && (
          <button
            type="button"
            className="clear-filter"
            onClick={() => setSelectedKey(null)}
          >
            Clear day filter
          </button>
        )}
      </header>

      <WeekStrip
        days={weekDays}
        todayKey={todayKey}
        selectedKey={selectedKey}
        eventCounts={eventCounts}
        onSelect={(key) => setSelectedKey((prev) => (prev === key ? null : key))}
      />

      <div className="layout">
        <section className="card" aria-label="Agenda">
          <h2>{selectedDay ? fmtLong(selectedDay) : 'This week'}</h2>
          <Agenda
            events={visibleEvents}
            error={eventsReq.error}
            retry={eventsReq.retry}
            todayKey={todayKey}
            filtered={!!selectedKey}
          />
        </section>

        <div className="side">
          <section className="card" aria-label="Packages">
            <h2>Packages</h2>
            <Packages req={packagesReq} />
          </section>
          <section className="card" aria-label="Inbox digest">
            <h2>Inbox digest</h2>
            <Digest req={digestReq} />
          </section>
        </div>
      </div>
    </div>
  )
}
