function initials(category) {
  const words = (category || '').split(/[\s&]+/).filter(Boolean).slice(0, 2)
  return words.map((w) => w[0].toUpperCase()).join('') || '?'
}

export default function InboxTab({ digest }) {
  const rows = digest || []
  const total = rows.reduce((n, d) => n + (d.count || 0), 0)

  return (
    <div className="inbox-wrap">
      <article className="card inbox-main">
        <div className="card-head"><h2>Worth a look</h2><span>{total} updates</span></div>
        {rows.length === 0 && (
          <p className="state-note">No digest categories yet.</p>
        )}
        {rows.map((d) => (
          <div className="mail-row" key={d.id}>
            <span className="sender" aria-hidden="true">{initials(d.category)}</span>
            <div className="mail-copy">
              <strong>{d.category}</strong>
              <span>{d.count === 1 ? '1 update grouped' : `${d.count} updates grouped`}</span>
            </div>
            <span className="mail-time">{d.count}</span>
          </div>
        ))}
      </article>
      <aside className="card summary-card">
        <h2 className="section-title">This week</h2>
        <div className="big-number">{total}</div>
        <p>updates grouped into {rows.length} {rows.length === 1 ? 'category' : 'categories'}</p>
        {rows.map((d) => (
          <div className="summary-line" key={d.id}>
            <span>{d.category}</span>
            <span>{d.count}</span>
          </div>
        ))}
      </aside>
    </div>
  )
}
