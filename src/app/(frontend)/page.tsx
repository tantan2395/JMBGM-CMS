import Link from "next/link"
import { getPayload } from "payload"
import config from "@payload-config"
import type { Announcement, StoryChapter, Sermon, Outreach, SiteSetting, Media } from "@/payload-types"
import { ScrollyStage } from "@/components/storytelling/ScrollyStage"
import { MobileStoryCards } from "@/components/storytelling/MobileStoryCards"
import { ClosingPortal } from "@/components/storytelling/ClosingPortal"
import { OutreachesGlobeSection, type ChurchBranch } from "@/components/outreaches/OutreachesGlobeSection"
import { EventFilterGrid, type EventItem } from "@/components/events/EventFilterGrid"
import { ApostolicMissionSection } from "@/components/mission/ApostolicMissionSection"
import { PrayerGivingSection } from "@/components/giving/PrayerGivingSection"
import { mergeWithCanonical } from "@/components/storytelling/story-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight, Heart } from "lucide-react"

export const dynamic = "force-dynamic"

function getMediaUrl(media: string | number | Media | null | undefined): string | null {
  if (!media) return null
  if (typeof media === "string") return media
  if (typeof media === "object" && "url" in media && typeof media.url === "string") return media.url
  return null
}

async function getSiteSettings(): Promise<SiteSetting | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.findGlobal({
      slug: "site-settings",
    })
    return res as SiteSetting
  } catch {
    return null
  }
}

async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: "announcements",
      where: {
        _status: {
          equals: "published",
        },
      },
      sort: "-date",
      limit: 12,
    })
    return res.docs as Announcement[]
  } catch {
    return []
  }
}

async function getSermons(): Promise<Sermon[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: "sermons",
      where: {
        _status: {
          equals: "published",
        },
      },
      sort: "-date",
      limit: 3,
      depth: 2,
    })
    return res.docs as Sermon[]
  } catch {
    return []
  }
}

async function getOutreaches(): Promise<Outreach[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: "outreaches",
      where: {
        _status: {
          equals: "published",
        },
      },
      limit: 20,
    })
    return res.docs as Outreach[]
  } catch {
    return []
  }
}

async function getStoryChapters(): Promise<StoryChapter[]> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: "story-chapters",
      where: {
        _status: {
          equals: "published",
        },
      },
      sort: "order",
      limit: 10,
    })
    return res.docs as StoryChapter[]
  } catch {
    return []
  }
}

// 5 Canonical Planted Church Network Branches as resilient baseline
const CANONICAL_BRANCHES: ChurchBranch[] = [
  {
    id: "metro-manila-main",
    name: "JMBGM - Metro Manila Main Sanctuary",
    slug: "metro-manila-main",
    branchType: "Main Sanctuary",
    leadPastor: "Senior Pastor David & Sarah Santos",
    address: "128 Epifanio de los Santos Ave, Quezon City",
    city: "Quezon City",
    country: "Philippines",
    latitude: 14.5995,
    longitude: 120.9842,
    serviceTimes: [
      { day: "Sunday", time: "10:00 AM", serviceName: "Main Worship & Word Celebration" },
      { day: "Wednesday", time: "7:00 PM", serviceName: "Midweek Word & Corporate Prayer" },
    ],
    contactPhone: "+63 (02) 8123-4567",
    contactEmail: "manila@jmbgm.org",
    coverImageUrl: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "cebu-city-campus",
    name: "JMBGM - Cebu City Campus",
    slug: "cebu-city-campus",
    branchType: "Planted Campus",
    leadPastor: "Pastor Joshua & Grace Mendoza",
    address: "Gorordo Ave, Cebu Business Park, Cebu City",
    city: "Cebu City",
    country: "Philippines",
    latitude: 10.3157,
    longitude: 123.8854,
    serviceTimes: [
      { day: "Sunday", time: "9:30 AM", serviceName: "Worship & Word Celebration" },
      { day: "Friday", time: "6:30 PM", serviceName: "Visayas Prayer & Revival Gathering" },
    ],
    contactPhone: "+63 (32) 412-8890",
    contactEmail: "cebu@jmbgm.org",
    coverImageUrl: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "davao-city-campus",
    name: "JMBGM - Davao City Campus",
    slug: "davao-city-campus",
    branchType: "Planted Campus",
    leadPastor: "Pastor Emmanuel & Ruth Dela Cruz",
    address: "J.P. Laurel Ave, Bajada, Davao City",
    city: "Davao City",
    country: "Philippines",
    latitude: 7.1907,
    longitude: 125.4578,
    serviceTimes: [
      { day: "Sunday", time: "10:00 AM", serviceName: "Kingdom Harvest Celebration" },
      { day: "Thursday", time: "7:00 PM", serviceName: "Mindanao Corporate Intercession" },
    ],
    contactPhone: "+63 (82) 298-7711",
    contactEmail: "davao@jmbgm.org",
    coverImageUrl: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "pampanga-campus",
    name: "JMBGM - Pampanga Campus",
    slug: "pampanga-campus",
    branchType: "Planted Campus",
    leadPastor: "Pastor Timothy & Faith Navarro",
    address: "MacArthur Highway, City of San Fernando, Pampanga",
    city: "San Fernando",
    country: "Philippines",
    latitude: 15.0794,
    longitude: 120.6200,
    serviceTimes: [
      { day: "Sunday", time: "9:00 AM", serviceName: "Sunday Morning Miracle Service" },
      { day: "Wednesday", time: "6:30 PM", serviceName: "Luzon Apostolic Prayer Night" },
    ],
    contactPhone: "+63 (45) 961-3420",
    contactEmail: "pampanga@jmbgm.org",
    coverImageUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "singapore-international",
    name: "JMBGM - Singapore International Outreach",
    slug: "singapore-international",
    branchType: "Pioneering Outreach",
    leadPastor: "Missionary Pastor Caleb & Joy Tan",
    address: "10 Anson Road, International Plaza, Downtown",
    city: "Singapore",
    country: "Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    serviceTimes: [
      { day: "Sunday", time: "3:00 PM", serviceName: "International Diaspora Fellowship" },
      { day: "Saturday", time: "7:00 PM", serviceName: "Apostolic Missions Discipleship" },
    ],
    contactPhone: "+65 6712 3456",
    contactEmail: "singapore@jmbgm.org",
    coverImageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
]

// Fallback Sermons for rich media preview
const FALLBACK_SERMONS = [
  {
    id: "sermon-1",
    title: "The Sovereign Architect: Walking in Divine Order",
    speaker: "Senior Pastor David Santos",
    date: "2026-09-20",
    scripture: "Hebrews 3:4",
    series: "The Master Builder Series",
    summary:
      "Discover the foundational truth that every storm can be navigated when our life and home are established on Christ, the true Builder.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sermon-2",
    title: "Rooted in Good Soil: Deep Discipleship",
    speaker: "Associate Pastor Joshua Mendoza",
    date: "2026-09-13",
    scripture: "Matthew 13:8 & Colossians 2:7",
    series: "Sacred Foundations",
    summary:
      "How to cultivate an unobstructed spiritual soil where God's Word takes deep root and yields thirty, sixty, and a hundredfold fruit.",
    thumbnailUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sermon-3",
    title: "He Makes His Ministers a Flame of Fire",
    speaker: "Guest Evangelist",
    date: "2026-09-06",
    scripture: "Hebrews 1:7 & Acts 2:3–4",
    series: "Kingdom Empowerment",
    summary:
      "Being refueled and purified by the Holy Spirit to burn as unquenchable beacons of truth, love, and revival in our neighborhoods.",
    thumbnailUrl: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=800&q=80",
  },
]

export default async function HomePage() {
  const [siteSettings, announcements, sermons, outreaches, cmsChapters] = await Promise.all([
    getSiteSettings(),
    getAnnouncements(),
    getSermons(),
    getOutreaches(),
    getStoryChapters(),
  ])
  const acts = mergeWithCanonical(cmsChapters)

  // Media URLs from SiteSettings
  const givingQrCodeUrl = getMediaUrl(siteSettings?.givingQrCode)
  const missionHeroImageUrl =
    getMediaUrl(siteSettings?.missionHeroImage) ||
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80"

  // Processed Branches (from Payload CMS Outreaches or Canonical Fallback)
  const activeBranches: ChurchBranch[] =
    outreaches.length > 0
      ? outreaches.map((o) => ({
          id: o.id,
          name: o.name,
          slug: o.slug,
          branchType: (o.branchType as 'Main Sanctuary' | 'Planted Campus' | 'Pioneering Outreach') || 'Planted Campus',
          leadPastor: o.leadPastor,
          address: o.address,
          city: o.city,
          country: o.country || 'Philippines',
          latitude: typeof o.latitude === 'number' ? o.latitude : 14.5995,
          longitude: typeof o.longitude === 'number' ? o.longitude : 120.9842,
          serviceTimes: o.serviceTimes?.map((st) => ({
            day: st.day,
            time: st.time,
            serviceName: st.serviceName,
          })),
          coverImageUrl: getMediaUrl(o.coverImage),
          contactPhone: o.contactPhone,
          contactEmail: o.contactEmail,
          featured: o.featured ?? true,
        }))
      : CANONICAL_BRANCHES

  // Processed Events (from Announcements with Branch Resolution)
  const activeEvents: EventItem[] = announcements.map((item) => {
    let branchId: string | number | null = null
    let branchName: string | null = null

    if (item.branch) {
      if (typeof item.branch === 'object' && 'name' in item.branch) {
        branchId = (item.branch as any).id
        branchName = (item.branch as any).name
      } else {
        branchId = item.branch as any
        const matched = activeBranches.find((b) => String(b.id) === String(branchId))
        if (matched) branchName = matched.city + ' Campus'
      }
    }

    return {
      id: item.id,
      title: item.title,
      category: item.category,
      date: item.date,
      location: item.location,
      summary: item.summary,
      featured: item.featured ?? false,
      imageUrl: getMediaUrl(item.image),
      branchId,
      branchName,
    }
  })

  // Active sermons (CMS or Fallback)
  const activeSermons =
    sermons.length > 0
      ? sermons.map((s) => ({
          id: s.id,
          title: s.title,
          speaker:
            typeof s.speaker === "object" && s.speaker !== null
              ? s.speaker.name
              : "Senior Pastor",
          date: s.date,
          scripture: s.scripture || "Holy Scripture",
          series:
            typeof s.series === "object" && s.series !== null
              ? s.series.title
              : typeof s.series === "string"
                ? s.series
                : "Sunday Celebration",
          summary: s.summary || "Listen to this life-transforming message from the Word of God.",
          thumbnailUrl:
            getMediaUrl(s.thumbnail) ||
            "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80",
        }))
      : FALLBACK_SERMONS

  return (
    <div className="flex flex-col">
      {/* 1. 🎬 Hero: The 5-Act Cinematic Narrative (#cinematic-narrative) */}
      <section id="cinematic-narrative" aria-label="Cinematic Ministry Narrative" className="w-full">
        <ScrollyStage acts={acts} />
        <MobileStoryCards acts={acts} />
      </section>

      {/* 2. 🏛️ Connect & Gatherings (#connect) */}
      <ClosingPortal />

      {/* 3. 🌐 Outreaches as Planted Church Network (Interactive 3D Globe) (#outreaches) */}
      <OutreachesGlobeSection branches={activeBranches} />

      {/* 4. 📢 Branch-Tagged & Filterable Calendar (#events) */}
      <section id="events" className="border-t border-[#E2D9CC] bg-[#EFE8DC]/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="terracotta" className="text-xs uppercase tracking-wider px-3 py-1">
              Multi-Campus Calendar
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#2F3E33] sm:text-4xl">
              Announcements &amp; Campus Gatherings
            </h2>
            <p className="text-sm text-[#5C6F62] max-w-xl mx-auto leading-relaxed">
              Explore church-wide celebrations and campus-specific gatherings across our planted branches.
            </p>
          </div>

          <EventFilterGrid
            events={activeEvents}
            branches={activeBranches.map((b) => ({
              id: b.id,
              name: b.name,
              city: b.city,
              slug: b.slug,
            }))}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild variant="terracotta" size="lg" className="font-semibold shadow-sm">
              <Link href="/events">
                View Full Events Calendar &amp; Archives
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. 🎙️ Media & The Word (#media) */}
      <section id="media" className="border-t border-[#E2D9CC] bg-[#16221A] text-[#FBF6EE] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs uppercase tracking-wider text-[#E3A857] border-[#E3A857]/40 bg-[#E3A857]/10">
                Word &amp; Truth
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Media &amp; Sermon Archives
              </h2>
              <p className="text-sm text-[#E2D9CC]/80 max-w-xl leading-relaxed">
                Be fed spiritually through anointed biblical preaching, inductive verse-by-verse teachings, and worship livestreams.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="terracotta" size="sm" className="font-semibold shadow-md">
                <Link href="/media">
                  Explore Full Media Archive
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeSermons.map((sermon) => (
              <div
                key={sermon.id}
                className="group relative rounded-2xl border border-white/10 bg-[#1C2920] overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#E3A857]/40"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-[#0B120E]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sermon.thumbnailUrl}
                      alt={sermon.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C2920] via-transparent to-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-[#C1683B] text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                        <Play className="h-5 w-5 ml-0.5 fill-white" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-[#E3A857]">
                        {sermon.series}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A9A5B]">
                      {sermon.scripture}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-[#E3A857] transition-colors">
                      {sermon.title}
                    </h3>
                    <p className="text-xs text-[#E2D9CC]/70 line-clamp-2 leading-relaxed">
                      {sermon.summary}
                    </p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs text-[#E2D9CC]/60 border-t border-white/10">
                  <span>{sermon.speaker}</span>
                  <span className="font-mono text-[11px]">
                    {new Date(sermon.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Link to Dedicated Media Page */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 rounded-2xl bg-[#1C2920]/80 p-5">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white">Need past message notes &amp; sermon series?</h4>
              <p className="text-xs text-[#E2D9CC]/70">
                Browse our complete searchable audio and video catalog with scripture references and study guides.
              </p>
            </div>
            <Button asChild variant="terracotta" size="sm" className="font-semibold shadow-md whitespace-nowrap">
              <Link href="/media">
                Open Full Media Library
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. 🌍 Redesigned Apostolic Mission & Church Planting Hub (#mission) */}
      <ApostolicMissionSection missionHeroImageUrl={missionHeroImageUrl} />

      {/* 7. 🎁 Generosity, Prayer & Kingdom Giving (#give) */}
      <PrayerGivingSection
        givingQrCodeUrl={givingQrCodeUrl}
        bankName={siteSettings?.givingBankName}
        accountName={siteSettings?.givingAccountName}
        accountNumber={siteSettings?.givingAccountNumber}
      />

      {/* 🕊️ Bottom Call-to-Action Congregation Banner */}
      <section className="bg-[#2F3E33] border-t border-[#E2D9CC]/30 px-4 py-16 sm:px-6 text-[#FBF6EE]">
        <div className="mx-auto max-w-4xl rounded-2xl bg-[#233127] border border-[#8A9A5B]/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <Badge variant="sage" className="text-xs uppercase tracking-wider">
            All Are Welcome
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl text-[#FBF6EE]">
            Connect with JMBGM Today
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-[#FBF6EE]/80 leading-relaxed">
            Join our church family this week in worship and fellowship. Everyone has a place in the Master Builder&apos;s house.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="terracotta" size="lg" className="w-full sm:w-auto font-semibold shadow-md">
              <Link href="/#connect">
                Plan Your Visit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline-white" size="lg" className="w-full sm:w-auto">
              <Link href="/#give">
                Submit Prayer Request
                <Heart className="ml-2 h-4 w-4 text-[#E3A857]" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
