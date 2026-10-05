import { useState } from 'react'
import { addDays, dayKey, parseDay } from '../dates'

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function startOfWeekSunday(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  x.setDate(x.getDate() - x.getDay())
  return x
}

function weekLabel(start) {
  const end = addDays(start, 6)
  const m0 = MONTHS_LONG[start.getMonth()]
  if (start.getMonth() === end.getMonth()) {
    return `${m0} ${start.getDate()}–${end.getDate()}`
  }
  return `${m0.slice(0, 3)} ${start.getDate()} – ${MONTHS_LONG[end.getMonth()].slice(0, 3)} ${end.getDate()}`
}

export default function CalendarTab({ today, events, packages }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const weekStart = addDays(startOfWeekSunday(today), weekOffset * 7)
  const todayK = dayKey(today)

  const schoolByDay = {}
  for (const e of events || []) {
    ;(schoolByDay[e.date] = schoolByDay[e.date] || []).push(e)
  }
  const deliveryByDay = {}
  for (const p of packages || []) {
    if (!p.expected_date) continue
    ;(deliveryByDay[p.expected_date] = deliveryByDay[p.expected_date] || []).push(p)
  }

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="calendar-wrap">
      <article className="card calendar-card">
        <div className="calendar-head">
          <h2>{weekLabel(weekStart)}</h2>
          <div className="week-nav">
            <button
              type="button"
              className="week-nav-btn"
              aria-label="Previous week"
              onClick={() => setWeekOffset((o) => o - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="week-nav-btn"
              aria-label="Next week"
              onClick={() => setWeekOffset((o) => o + 1)}
            >
              ›
            </button>
          </div>
        </div>
        <div className="week-grid" aria-label={`Week of ${weekLabel(weekStart)}`}>
          {WEEKDAYS.map((d) => (
            <div className="weekday" key={d}>{d}</div>
          ))}
          {days.map((d) => {
            const key = dayKey(d)
            const isToday = key === todayK
            const chips = []
            for (const e of schoolByDay[key] || []) {
              chips.push(
                <span className="cal-event warm" key={`s-${e.id}`}>{e.title}</span>
              )
            }
            for (const p of deliveryByDay[key] || []) {
              chips.push(
                <span className="cal-event" key={`p-${p.id}`}>{p.carrier} delivery</span>
              )
            }
            return (
              <div className={`date-cell${isToday ? ' today' : ''}`} key={key}>
                <span className="date-num">{d.getDate()}</span>
                {chips}
              </div>
            )
          })}
        </div>
      </article>
      <aside className="card legend-card">
        <h2 className="section-title">Calendar key</h2>
        <div className="legend-list">
          <div className="legend-row"><i></i><span>Family plan</span></div>
          <div className="legend-row"><i className="warm"></i><span>School</span></div>
          <div className="legend-row"><i className="blue"></i><span>Delivery</span></div>
        </div>
      </aside>
    </div>
  )
}
