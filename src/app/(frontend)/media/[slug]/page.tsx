import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { SermonPlayer } from '@/components/media/SermonPlayer'
import { getAutoThumbnail } from '@/lib/video'

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
    getAutoThumbnail(sermon.videoUrl)

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {thumb && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={thumb}
            alt={sermon.thumbnail?.alt || sermon.title}
            fill
            className="object-cover"
            unoptimized={thumb.startsWith('https://img.youtube.com')}
          />
        </div>
      )}

      <h1 className="text-3xl font-bold">{sermon.title}</h1>
      <p className="mt-2 text-gray-600">
        {sermon.speaker?.name}
        {sermon.date && ` • ${new Date(sermon.date).toLocaleDateString()}`}
        {sermon.scripture && ` • ${sermon.scripture}`}
      </p>

      {sermon.series?.title && (
        <Link
          href={`/media?series=${sermon.series.slug}`}
          className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs"
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
          className="mt-6 inline-block rounded bg-black px-4 py-2 text-white"
          download
        >
          Download Study Guide (PDF)
        </a>
      )}

      {sermon.studyNotes && (
        <section className="prose mt-10 max-w-none">
          <h2>Study Notes</h2>
          {/* Render with your RichText component */}
        </section>
      )}

      <div className="mt-10">
        <Link href="/media" className="text-sm underline">
          ← Back to Media
        </Link>
      </div>
    </article>
  )
}