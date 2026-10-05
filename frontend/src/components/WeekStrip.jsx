import { dayKey, fmtDowShort } from '../dates'

/**
 * 7-day strip (Mon–Sun). Highlights today, marks days that have events,
 * and lets the user tap a day to filter the agenda.
 */
export default function WeekStrip({ days, todayKey, selectedKey, eventCounts, onSelect }) {
  return (
    <nav className="week-strip" aria-label="Week">
      {days.map((d) => {
        const key = dayKey(d)
        const count = eventCounts[key] || 0
        const classes = ['day']
        if (key === todayKey) classes.push('is-today')
        if (key === selectedKey) classes.push('is-selected')
        return (
          <button
            key={key}
            type="button"
            className={classes.join(' ')}
            aria-pressed={key === selectedKey}
            onClick={() => onSelect(key)}
          >
            <span className="dow">{fmtDowShort(d)}</span>
            <span className="dom">{d.getDate()}</span>
            <span className="dots" aria-hidden="true">
              {count > 0 && <i className="dot" title={`${count} event${count > 1 ? 's' : ''}`} />}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
