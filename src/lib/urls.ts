/** Prefix a user-entered URL with https:// when a protocol is missing. */
export function ensureHttps(value: unknown): unknown {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  if (!trimmed) return value
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}
