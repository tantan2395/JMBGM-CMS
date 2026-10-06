import type { ConnectCategory } from '@/lib/constants/connect'

export type FallbackConnect = {
  id: string
  name: string
  slug: string
  description: string
  category: ConnectCategory
  schedule: string
  icon: string
  image: null
  googleFormUrl: string
  order: number
  isActive: true
}

export const FALLBACK_CONNECTS: FallbackConnect[] = [
  {
    id: 'fallback-nextgen',
    name: 'NextGen Youth Elevation',
    slug: 'nextgen-youth-elevation',
    description:
      'A high-energy community for teens and next-gen leaders to grow in faith, friendship, and calling.',
    category: 'youth',
    schedule: 'Fridays · 7:00 PM',
    icon: '🔥',
    image: null,
    googleFormUrl: 'https://forms.gle/nextgen',
    order: 10,
    isActive: true,
  },
  {
    id: 'fallback-life-groups',
    name: 'Life Groups Circles',
    slug: 'life-groups-circles',
    description:
      'Weekly small-group gatherings for prayer, Bible study, and authentic community across every campus.',
    category: 'general',
    schedule: 'Weeknights · various homes',
    icon: '🤝',
    image: null,
    googleFormUrl: 'https://forms.gle/life-groups',
    order: 20,
    isActive: true,
  },
  {
    id: 'fallback-serve',
    name: 'Kingdom Serve Team',
    slug: 'kingdom-serve-team',
    description:
      'Join hospitality, worship, production, kids, and outreach teams that make Sunday and the city come alive.',
    category: 'serve',
    schedule: 'Sundays · serve rotations',
    icon: '🙌',
    image: null,
    googleFormUrl: 'https://forms.gle/serve',
    order: 30,
    isActive: true,
  },
  {
    id: 'fallback-new-believers',
    name: 'New Believers Class',
    slug: 'new-believers-class',
    description:
      'A welcoming first step for new faith, baptism guidance, and belonging in the JMBGM family.',
    category: 'general',
    schedule: 'Sundays after service',
    icon: '🌱',
    image: null,
    googleFormUrl: 'https://forms.gle/new-believers',
    order: 40,
    isActive: true,
  },
  {
    id: 'fallback-men',
    name: 'Men of Faith',
    slug: 'men-of-faith',
    description:
      'Brotherhood for men to be discipled, challenged, and equipped as husbands, fathers, and leaders.',
    category: 'men',
    schedule: 'Saturdays · 6:30 AM',
    icon: '⚔️',
    image: null,
    googleFormUrl: 'https://forms.gle/men',
    order: 50,
    isActive: true,
  },
  {
    id: 'fallback-women',
    name: 'Women of Grace',
    slug: 'women-of-grace',
    description:
      'A sisterhood of worship, Scripture, and encouragement for women in every season of life.',
    category: 'women',
    schedule: 'Saturdays · 9:00 AM',
    icon: '💐',
    image: null,
    googleFormUrl: 'https://forms.gle/women',
    order: 60,
    isActive: true,
  },
  {
    id: 'fallback-family',
    name: 'Couples & Family',
    slug: 'couples-and-family',
    description:
      'Spaces for couples, parents, and kids to grow together in faith, marriage, and household discipleship.',
    category: 'family',
    schedule: 'Monthly family nights',
    icon: '👨‍👩‍👧‍👦',
    image: null,
    googleFormUrl: 'https://forms.gle/family',
    order: 70,
    isActive: true,
  },
  {
    id: 'fallback-young-adults',
    name: 'Young Professionals & Singles',
    slug: 'young-professionals-singles',
    description:
      'Community for young adults navigating vocation, purpose, and faith in the city.',
    category: 'young-adults',
    schedule: 'Thursdays · 7:30 PM',
    icon: '✨',
    image: null,
    googleFormUrl: 'https://forms.gle/young-adults',
    order: 80,
    isActive: true,
  },
]
