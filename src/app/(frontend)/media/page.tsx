import Link from 'next/link'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { MediaCard } from '@/components/media/MediaCard'
import { FALLBACK_SERMONS } from '@/lib/constants/media-fallbacks'
import { Badge } from '@/components/ui/badge'

export const metadata = {
  title: 'Media & Sermon Archives',
  description:
    'Anointed message recordings, sermon series study guides, and worship recordings to build your faith wherever you are.',
}

const PAGE_SIZE = 9

type SearchParams = {
  q?: string
  scripture?: string
  series?: string
  speaker?: string
  page?: string
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { q, scripture, series, speaker, page: pageParam } = await searchParams
  const page = Number(pageParam) || 1
  const payload = await getPayloadClient()

  const filters: Where[] = [
    { status: { equals: 'published' } },
    { _status: { equals: 'published' } },
  ]
  if (q) filters.push({ title: { like: q } })
  if (scripture) filters.push({ scripture: { like: scripture } })
  if (series) filters.push({ 'series.slug': { equals: series } })
  if (speaker) filters.push({ 'speaker.slug': { equals: speaker } })

  const { docs: sermons, totalPages, page: currentPage } = await payload.find({
    collection: 'sermons',
    where: { and: filters },
    limit: PAGE_SIZE,
    page,
    sort: '-date',
    depth: 2,
  })

  const { docs: allSeries } = await payload.find({
    collection: 'series',
    limit: 100,
    sort: 'title',
  })
  const { docs: allSpeakers } = await payload.find({
    collection: 'speakers',
    limit: 100,
    sort: 'name',
  })

  const hasFilters = Boolean(q || scripture || series || speaker)
  const displaySermons =
    sermons.length === 0 && !hasFilters
      ? FALLBACK_SERMONS.map((sermon) => ({
          id: sermon.id,
          title: sermon.title,
          date: sermon.date,
          speaker: sermon.speaker,
          series: sermon.series,
          thumbnail: { url: sermon.thumbnailUrl, alt: sermon.title },
        }))
      : sermons

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 text-[#2F3E33]">
      <header className="mb-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-[#5C6F62]">
          <Link href="/" className="transition-colors hover:text-[#C1683B]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-[#2F3E33]">
            Media
          </span>
        </nav>
        <div className="space-y-3">
          <Badge variant="sage" className="bg-[#8A9A5B]/15 text-[#526033]">
            Proclaiming Truth
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-[#2F3E33]">
            Media &amp; Sermon Archives
          </h1>
          <p className="mt-3 text-lg text-[#5C6F62]">
            Anointed message recordings, sermon series study guides, and worship
            recordings to build your faith wherever you are.
          </p>
        </div>
      </header>

      <form className="mb-8 flex flex-wrap gap-3" method="get">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search title..."
          className="rounded-md border border-[#E2D9CC] bg-white px-3 py-2 text-[#2F3E33] placeholder:text-[#5C6F62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1683B]/40"
        />
        <input
          type="text"
          name="scripture"
          defaultValue={scripture}
          placeholder="Scripture (e.g. John 3)"
          className="rounded-md border border-[#E2D9CC] bg-white px-3 py-2 text-[#2F3E33] placeholder:text-[#5C6F62] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1683B]/40"
        />
        <select
          name="series"
          defaultValue={series || ''}
          className="rounded-md border border-[#E2D9CC] bg-white px-3 py-2 text-[#2F3E33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1683B]/40"
        >
          <option value="">All Series</option>
          {allSeries.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
        <select
          name="speaker"
          defaultValue={speaker || ''}
          className="rounded-md border border-[#E2D9CC] bg-white px-3 py-2 text-[#2F3E33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1683B]/40"
        >
          <option value="">All Speakers</option>
          {allSpeakers.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <button className="rounded-md bg-[#C1683B] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#A95530] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C1683B]/40 focus-visible:ring-offset-2">
          Filter
        </button>
        {hasFilters && (
          <Link
            href="/media"
            className="rounded-md border border-[#2F3E33] px-4 py-2 font-medium text-[#2F3E33] transition-colors hover:bg-[#2F3E33] hover:text-[#FBF6EE]"
          >
            Reset
          </Link>
        )}
      </form>

      {displaySermons.length === 0 ? (
        <p className="rounded-lg border border-[#E2D9CC] bg-white p-6 text-[#5C6F62]">
          {hasFilters
            ? 'No sermons match your filters.'
            : 'No sermons published yet.'}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displaySermons.map((s) => (
            <MediaCard key={s.id} item={s} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={{
                pathname: '/media',
                query: { q, scripture, series, speaker, page: n },
              }}
              className={`rounded border px-3 py-1 ${
                n === currentPage
                  ? 'border-[#2F3E33] bg-[#2F3E33] text-[#FBF6EE]'
                  : 'border-[#E2D9CC] bg-white text-[#2F3E33] hover:border-[#C1683B] hover:text-[#C1683B]'
              }`}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </main>
  )
}