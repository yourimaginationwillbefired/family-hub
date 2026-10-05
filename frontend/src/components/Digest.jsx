import { StateEmpty, StateError, StateLoading } from './SectionState'

/** Inbox digest: category rows with counts and relative volume bars. */
export default function Digest({ req }) {
  const { data, error, retry } = req
  if (error) return <StateError retry={retry} />
  if (!data) return <StateLoading />
  if (data.length === 0) return <StateEmpty text="Nothing to show." />

  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <ul className="digest">
      {data.map((d) => (
        <li key={d.id}>
          <div className="row">
            <span>{d.category}</span>
            <span className="count">{d.count}</span>
          </div>
          <div className="bar" aria-hidden="true">
            <i style={{ width: `${Math.round((d.count / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
