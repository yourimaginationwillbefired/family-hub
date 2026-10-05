/** Shared loading / error / empty states for dashboard sections. */

export function StateError({ retry }) {
  return (
    <div className="state">
      <p className="state-error">Couldn't load this section.</p>
      <button type="button" className="retry" onClick={retry}>
        Retry
      </button>
    </div>
  )
}

export function StateLoading() {
  return (
    <div className="state" aria-busy="true" aria-label="Loading">
      <div className="skeleton" />
      <div className="skeleton" />
      <div className="skeleton short" />
    </div>
  )
}

export function StateEmpty({ text }) {
  return <p className="muted">{text}</p>
}
