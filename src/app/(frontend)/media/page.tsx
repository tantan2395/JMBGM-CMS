import Link from 'next/link'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { MediaCard } from '@/components/media/MediaCard'

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

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">
          Media &amp; Sermon Archives
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Anointed message recordings, sermon series study guides, and worship
          recordings to build your faith wherever you are.
        </p>
      </header>

      <form className="mb-8 flex flex-wrap gap-3" method="get">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search title..."
          className="rounded border px-3 py-2"
        />
        <input
          type="text"
          name="scripture"
          defaultValue={scripture}
          placeholder="Scripture (e.g. John 3)"
          className="rounded border px-3 py-2"
        />
        <select name="series" defaultValue={series || ''} className="rounded border px-3 py-2">
          <option value="">All Series</option>
          {allSeries.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
        <select name="speaker" defaultValue={speaker || ''} className="rounded border px-3 py-2">
          <option value="">All Speakers</option>
          {allSpeakers.map((s) => (
            <option key={s.id} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
        <button className="rounded bg-black px-4 py-2 text-white">Filter</button>
        {hasFilters && (
          <Link href="/media" className="rounded border px-4 py-2">
            Reset
          </Link>
        )}
      </form>

      {sermons.length === 0 ? (
        <p className="text-gray-500">
          {hasFilters
            ? 'No sermons match your filters.'
            : 'No sermons published yet.'}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sermons.map((s) => (
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
                n === currentPage ? 'bg-black text-white' : ''
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