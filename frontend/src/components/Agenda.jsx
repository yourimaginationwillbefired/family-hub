import { StateEmpty, StateError, StateLoading } from './SectionState'
import { fmtDowShort, fmtShort, parseDay, relativeLabel } from '../dates'

/**
 * School events agenda. Receives the (optionally day-filtered) event list.
 */
export default function Agenda({ events, error, retry, todayKey, filtered }) {
  if (error) return <StateError retry={retry} />
  if (!events) return <StateLoading />
  if (events.length === 0) {
    return <StateEmpty text={filtered ? 'Nothing scheduled for this day.' : 'No upcoming events.'} />
  }

  return (
    <ul className="agenda">
      {events.map((e) => {
        const d = parseDay(e.date)
        const rel = relativeLabel(e.date, todayKey)
        return (
          <li key={e.id} className="agenda-item">
            <div className="agenda-date" aria-hidden="true">
              <span className="agenda-dow">{fmtDowShort(d)}</span>
              <span className="agenda-dom">{fmtShort(d)}</span>
            </div>
            <div className="agenda-body">
              <div className="agenda-title-row">
                <span className="agenda-title">{e.title}</span>
                {rel && <span className="rel">{rel}</span>}
              </div>
              {e.source && <div className="meta">via {e.source}</div>}
              {e.notes && <p className="notes">{e.notes}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
