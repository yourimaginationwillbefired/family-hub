import { StateEmpty, StateError, StateLoading } from './SectionState'
import { fmtShort, parseDay } from '../dates'

function pillClass(status) {
  const s = (status || '').toLowerCase()
  if (s.includes('deliver')) return 'pill-green'
  if (s.includes('transit') || s.includes('out for')) return 'pill-blue'
  if (s.includes('ship')) return 'pill-violet'
  return 'pill-gray'
}

/** Shipment-tracking style package list. */
export default function Packages({ req }) {
  const { data, error, retry } = req
  if (error) return <StateError retry={retry} />
  if (!data) return <StateLoading />
  if (data.length === 0) return <StateEmpty text="Nothing on the way." />

  return (
    <ul className="packages">
      {data.map((p) => (
        <li key={p.id} className="package">
          <span className={`pkg-dot ${pillClass(p.status)}`} aria-hidden="true" />
          <div className="pkg-body">
            <div className="row">
              <strong>{p.carrier}</strong>
              <span className={`pill ${pillClass(p.status)}`}>{p.status}</span>
            </div>
            {p.expected_date && (
              <div className="meta">Expected {fmtShort(parseDay(p.expected_date))}</div>
            )}
            {p.tracking_note && <p className="notes">{p.tracking_note}</p>}
          </div>
        </li>
      ))}
    </ul>
  )
}
