export const CONNECT_CATEGORIES = [
  { label: 'Youth & NextGen', value: 'youth' },
  { label: 'Men of Faith', value: 'men' },
  { label: 'Women of Grace', value: 'women' },
  { label: 'Couples & Family', value: 'family' },
  { label: 'Young Professionals & Singles', value: 'young-adults' },
  { label: 'Kingdom Serve Teams', value: 'serve' },
  { label: 'General Fellowship', value: 'general' },
] as const

export type ConnectCategory = (typeof CONNECT_CATEGORIES)[number]['value']

export const CONNECT_CATEGORY_LABELS: Record<ConnectCategory, string> = Object.fromEntries(
  CONNECT_CATEGORIES.map((option) => [option.value, option.label]),
) as Record<ConnectCategory, string>
