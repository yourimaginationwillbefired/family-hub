import { useMemo, useRef, useState } from 'react'
import { useApi } from './api'
import { addDays, dayKey, fmtDowShort, fmtLong, fmtShort, parseDay, relativeLabel } from './dates'
import { ParcelIcon, digestIcon } from './components/icons'
import CalendarTab from './components/CalendarTab'
import InboxTab from './components/InboxTab'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'inbox', label: 'Inbox' },
]

function greeting(hour) {
  if (hour < 12) return 'Good morning.'
  if (hour < 18) return 'Good afternoon.'
  return 'Good evening.'
}

function dayLabel(iso, todayKey) {
  const rel = relativeLabel(iso, todayKey)
  if (rel === 'Today' || rel === 'Tomorrow') return rel
  return fmtDowShort(parseDay(iso))
}

function progressFor(status) {
  const s = (status || '').toLowerCase()
  if (s.includes('deliver')) return 100
  if (s.includes('transit')) return 68
  if (s.includes('ship')) return 35
  return 15
}

function arrivalWord(iso, todayKey) {
  const rel = relativeLabel(iso, todayKey)
  if (rel === 'Today') return 'today'
  if (rel === 'Tomorrow') return 'tomorrow'
  const d = parseDay(iso)
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()]
}

function ErrorCard({ message, onRetry }) {
  return (
    <div className="state-error">
      <p>Couldn't load this section: {message}</p>
      <button type="button" className="retry-btn" onClick={onRetry}>Retry</button>
    </div>
  )
}

function AgendaCard({ events, packages, todayKey, error, onRetry }) {
  const days = useMemo(() => {
    const map = new Map()
    const add = (iso, item) => {
      if (!map.has(iso)) map.set(iso, { school: [], deliveries: [] })
      map.get(iso)[item.kind].push(item)
    }
    for (const e of events || []) {
      if (e.date >= todayKey) add(e.date, { kind: 'school', ...e })
    }
    for (const p of packages || []) {
      if (p.expected_date && p.expected_date >= todayKey) {
        add(p.expected_date, { kind: 'deliveries', ...p })
      }
    }
    return [...map.entries()].sort(([a], [b]) => (a < b ? -1 : 1))
  }, [events, packages, todayKey])

  if (error) return <ErrorCard message={error} onRetry={onRetry} />
  if (!events || !packages) return <p className="state-note">Loading the week ahead…</p>

  const range =
    days.length > 0
      ? `${fmtShort(parseDay(days[0][0]))}–${fmtShort(parseDay(days[days.length - 1][0]))}`
      : 'Nothing ahead'

  return (
    <>
      <div className="card-head"><h2>This week</h2><span>{range}</span></div>
      {days.length === 0 && <p className="state-note">Nothing on the calendar.</p>}
      {days.map(([iso, group]) => (
        <div className="agenda-day" key={iso}>
          <div className="day-label">
            <strong>{dayLabel(iso, todayKey)}</strong>
            <span>{fmtShort(parseDay(iso))}</span>
          </div>
          <div className="event-list">
            {group.school.map((e) => (
              <div className="event school" key={`s-${e.id}`}>
                <span className="event-dot" aria-hidden="true"></span>
                <div className="event-copy">
                  <strong>{e.title}</strong>
                  <small>{e.notes || e.source}</small>
                </div>
                <span className="event-time"></span>
              </div>
            ))}
            {group.deliveries.map((p) => (
              <div className="event delivery" key={`p-${p.id}`}>
                <span className="event-dot" aria-hidden="true"></span>
                <div className="event-copy">
                  <strong>{p.carrier} delivery</strong>
                  <small>{p.tracking_note || p.status}</small>
                </div>
                <span className="event-time">All day</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

function DeliveryCard({ packages, todayKey }) {
  if (!packages) return null
  const upcoming = (packages || [])
    .filter((p) => p.expected_date)
    .sort((a, b) => (a.expected_date < b.expected_date ? -1 : 1))
  const next = upcoming.find((p) => p.expected_date >= todayKey) || upcoming[upcoming.length - 1]
  if (!next) return null
  return (
    <article className="card delivery-card">
      <div className="delivery-top">
        <span className="eyebrow">NEXT DELIVERY</span>
        <span className="parcel-icon" aria-hidden="true"><ParcelIcon /></span>
      </div>
      <h3>{next.carrier} · arriving {arrivalWord(next.expected_date, todayKey)}</h3>
      <p>{next.tracking_note || next.status}</p>
      <div className="progress" aria-label="Delivery progress">
        <span style={{ width: `${progressFor(next.status)}%` }}></span>
      </div>
      <div className="track"><span>Shipped</span><span>In transit</span><span>Delivered</span></div>
    </article>
  )
}

function DigestCard({ digest, error, onRetry }) {
  if (error) return <ErrorCard message={error} onRetry={onRetry} />
  if (!digest) return <p className="state-note">Loading digest…</p>
  const total = digest.reduce((n, d) => n + (d.count || 0), 0)
  return (
    <article className="card digest-card">
      <div className="card-head"><h2>Inbox digest</h2><span>{total} updates</span></div>
      {digest.map((d) => {
        const icon = digestIcon(d.category)
        return (
          <div className="digest-row" key={d.id}>
            <span className={`digest-icon${icon.tone ? ' ' + icon.tone : ''}`} aria-hidden="true">{icon.svg}</span>
            <div className="digest-copy">
              <strong>{d.category}</strong>
              <span>{d.count === 1 ? '1 update' : `${d.count} updates`}</span>
            </div>
            <span className="count">{d.count}</span>
          </div>
        )
      })}
    </article>
  )
}

export default function App() {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const todayKey = dayKey(today)
  const nowHour = new Date().getHours()

  const [tab, setTab] = useState('overview')
  const tabRefs = useRef([])

  const events = useApi('/school-events/')
  const packages = useApi('/packages/')
  const digest = useApi('/digest/')

  const agendaError = events.error || packages.error
  const retryAgenda = () => {
    events.retry()
    packages.retry()
  }

  const eventsAhead = (events.data || []).filter((e) => e.date >= todayKey).length
  const deliveryCount = (packages.data || []).length

  const activateTab = (id) => setTab(id)
  const onTabKeyDown = (e, index) => {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length
    else return
    e.preventDefault()
    activateTab(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="shell">
      <header className="topline">
        <div className="date-block">
          <div className="date-mark" aria-hidden="true">{today.getDate()}</div>
          <div className="date-copy">
            <strong>{fmtLong(today)}</strong>
            <span>{today.getFullYear()}</span>
          </div>
        </div>
      </header>

      <section className="intro" aria-labelledby="greeting">
        <div>
          <h1 id="greeting">{greeting(nowHour)}</h1>
          <p>Here’s the week ahead, the things on their way, and the inbox updates worth noticing.</p>
        </div>
        <div className="quick-stats" aria-label="At a glance">
          <div className="stat"><b>{events.data ? eventsAhead : '–'}</b><span>events ahead</span></div>
          <div className="stat"><b>{packages.data ? deliveryCount : '–'}</b><span>deliveries</span></div>
        </div>
      </section>

      <nav className="tabs" aria-label="Dashboard sections" role="tablist">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => (tabRefs.current[i] = el)}
            className="tab"
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={tab === t.id ? 'true' : 'false'}
            aria-controls={t.id}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => activateTab(t.id)}
            onKeyDown={(e) => onTabKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main>
        <section
          className="panel"
          id="overview"
          role="tabpanel"
          aria-labelledby="tab-overview"
          hidden={tab !== 'overview'}
        >
          <div className="dashboard">
            <article className="card agenda">
              <AgendaCard
                events={events.data}
                packages={packages.data}
                todayKey={todayKey}
                error={agendaError}
                onRetry={retryAgenda}
              />
            </article>
            <aside className="side">
              <DeliveryCard packages={packages.data} todayKey={todayKey} />
              <DigestCard digest={digest.data} error={digest.error} onRetry={digest.retry} />
            </aside>
          </div>
        </section>

        <section
          className="panel"
          id="calendar"
          role="tabpanel"
          aria-labelledby="tab-calendar"
          hidden={tab !== 'calendar'}
        >
          {events.error || packages.error ? (
            <div className="card"><ErrorCard message={events.error || packages.error} onRetry={retryAgenda} /></div>
          ) : !events.data || !packages.data ? (
            <div className="card"><p className="state-note">Loading the calendar…</p></div>
          ) : (
            <CalendarTab today={today} events={events.data} packages={packages.data} />
          )}
        </section>

        <section
          className="panel"
          id="inbox"
          role="tabpanel"
          aria-labelledby="tab-inbox"
          hidden={tab !== 'inbox'}
        >
          {digest.error ? (
            <div className="card"><ErrorCard message={digest.error} onRetry={digest.retry} /></div>
          ) : !digest.data ? (
            <div className="card"><p className="state-note">Loading the inbox…</p></div>
          ) : (
            <InboxTab digest={digest.data} />
          )}
        </section>
      </main>
    </div>
  )
}
