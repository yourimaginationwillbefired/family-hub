// SVG icons copied from the Family Hub static preview.

export function ParcelIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m3 6 9 5 9-5M12 11v10M5 7.2V17l7 4 7-4V7.2L12 3 5 7.2Z" />
    </svg>
  )
}

const ICONS = {
  school: {
    tone: '',
    label: 'School',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 10v10h16V10M2 10l10-7 10 7M8 20v-7h8v7" />
      </svg>
    ),
  },
  orders: {
    tone: 'blue',
    label: 'Orders & shipping',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 7h18v13H3zM3 7l3-4h12l3 4M9 11h6" />
      </svg>
    ),
  },
  newsletters: {
    tone: 'warm',
    label: 'Newsletters',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  bills: {
    tone: '',
    label: 'Bills',
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 2h10v20l-5-3-5 3V2ZM9 7h6M9 11h6" />
      </svg>
    ),
  },
}

export function digestIcon(category) {
  const c = (category || '').toLowerCase()
  if (/school/.test(c)) return ICONS.school
  if (/order|ship|deliver|package/.test(c)) return ICONS.orders
  if (/news|letter/.test(c)) return ICONS.newsletters
  if (/bill|payment|invoice/.test(c)) return ICONS.bills
  return ICONS.school
}
