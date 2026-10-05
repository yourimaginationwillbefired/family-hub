// Local-date helpers. API dates are YYYY-MM-DD strings; parse them as
// local dates (not UTC) so days never shift across timezones.

const DOW_MON_FIRST = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DOW_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function parseDay(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function dayKey(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Monday of the week containing d. */
export function startOfWeek(d) {
  const x = new Date(d)
  const offset = (x.getDay() + 6) % 7 // Monday => 0
  x.setDate(x.getDate() - offset)
  return x
}

export function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

const monIndex = (d) => (d.getDay() + 6) % 7

export function fmtDowShort(d) {
  return DOW_MON_FIRST[monIndex(d)]
}

export function fmtShort(d) {
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`
}

export function fmtLong(d) {
  return `${DOW_LONG[d.getDay()]}, ${MONTHS_LONG[d.getMonth()]} ${d.getDate()}`
}

export function fmtToday(d) {
  return `${DOW_LONG[d.getDay()]}, ${MONTHS_LONG[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

/** "Today" / "Tomorrow" / "In N days" relative to a YYYY-MM-DD today key. */
export function relativeLabel(iso, todayKey) {
  if (iso === todayKey) return 'Today'
  const ms = parseDay(iso) - parseDay(todayKey)
  const diff = Math.round(ms / 86400000)
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff > 1 && diff < 7) return `In ${diff} days`
  if (diff < -1 && diff > -7) return `${-diff} days ago`
  return null
}
