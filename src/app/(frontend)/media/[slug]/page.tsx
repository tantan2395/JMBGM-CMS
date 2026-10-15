import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { Badge } from '@/components/ui/badge'
import { SermonPlayer } from '@/components/media/SermonPlayer'
import { SermonThumbnail } from '@/components/media/SermonThumbnail'
import { getAutoThumbnail } from '@/lib/video'
import { RichText } from '@payloadcms/richtext-lexical/react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'sermons',
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { equals: 'published' } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
  })
  const sermon = docs[0] as any
  if (!sermon) return { title: 'Sermon Not Found' }
  return { title: sermon.title, description: sermon.summary || undefined }
}

export default async function SermonPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'sermons',
    where: {
      and: [
        { slug: { equals: slug } },
        { status: { equals: 'published' } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 2,
  })
  const sermon: any = docs[0]
  if (!sermon) notFound()

  const thumb =
    sermon.thumbnail?.sizes?.hero?.url ||
    sermon.thumbnail?.url ||
    getAutoThumbnail(sermon.videoUrl) ||
    '/media/background.jpg'

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-[#5C6F62]">
        <Link href="/" className="transition-colors hover:text-[#C1683B]">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/media" className="transition-colors hover:text-[#C1683B]">
          Media
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page" className="truncate font-semibold text-[#2F3E33]">
          {sermon.title}
        </span>
      </nav>
      {thumb && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
          <SermonThumbnail
            src={thumb}
            alt={sermon.thumbnail?.alt || sermon.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      )}

      <Badge variant="sage" className="mt-6 bg-[#8A9A5B]/15 text-[#526033]">
        Proclaiming Truth
      </Badge>
      <h1 className="text-3xl font-bold">{sermon.title}</h1>
      <p className="mt-2 text-[#5C6F62]">
        {sermon.speaker?.name}
        {sermon.date && ` • ${new Date(sermon.date).toLocaleDateString()}`}
        {sermon.scripture && ` • ${sermon.scripture}`}
      </p>

      {sermon.series?.title && (
        <Link
          href={`/media?series=${sermon.series.slug}`}
          className="mt-2 inline-block rounded-full bg-[#C1683B]/10 px-3 py-1 text-xs font-medium text-[#A95530]"
        >
          Series: {sermon.series.title}
        </Link>
      )}

      {sermon.summary && <p className="mt-4 text-lg">{sermon.summary}</p>}

      <SermonPlayer
        audioUrl={sermon.audio?.url}
        videoUrl={sermon.videoUrl}
        title={sermon.title}
      />

      {sermon.studyGuide?.url && (
        <a
          href={sermon.studyGuide.url}
          className="mt-6 inline-block rounded-md bg-[#C1683B] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#A95530]"
          download
        >
          Download Study Guide (PDF)
        </a>
      )}

      {sermon.studyNotes && (
        <section className="mt-10 max-w-none rounded-lg border border-[#E2D9CC] bg-white p-6">
          <h2 className="mb-4 text-2xl font-semibold text-[#2F3E33]">
            Study Notes
          </h2>
          <RichText
            data={sermon.studyNotes}
            className="space-y-4 text-[#2F3E33] [&_a]:text-[#C1683B] [&_a]:underline [&_h1]:my-5 [&_h1]:text-3xl [&_h2]:my-4 [&_h2]:text-2xl [&_h3]:my-3 [&_h3]:text-xl [&_li]:ml-5 [&_ol]:list-decimal [&_p]:my-3 [&_ul]:list-disc"
          />
        </section>
      )}

      <div className="mt-10">
        <Link href="/media" className="text-sm text-[#C1683B] underline">
          ← Back to Media
        </Link>
      </div>
    </article>
  )
}