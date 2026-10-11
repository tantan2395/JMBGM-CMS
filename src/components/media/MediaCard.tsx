'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { getAutoThumbnail } from '@/lib/video'
import { PlaybackModal } from './PlaybackModal'

type MediaThumb = {
  url?: string | null
  alt?: string | null
  sizes?: {
    card?: { url?: string | null }
  }
}

type MediaRelation<T> = T | number | null | undefined

type MediaCardItem = {
  title?: string | null
  slug?: string | null
  date?: string | null
  videoUrl?: string | null
  audio?: number | MediaThumb | null
  speaker?: MediaRelation<string | { name?: string | null }>
  series?: MediaRelation<string | { title?: string | null }>
  thumbnail?: number | MediaThumb | null
}

function formatDate(value?: string | null) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString()
}

export function MediaCard({ item }: { item: MediaCardItem }) {
  const [open, setOpen] = useState(false)

  const thumbnailData =
    typeof item.thumbnail === 'object' && item.thumbnail !== null ? item.thumbnail : null
  const audioData =
    typeof item.audio === 'object' && item.audio !== null ? item.audio : null

  const thumb = useMemo(
    () =>
      thumbnailData?.sizes?.card?.url ||
      thumbnailData?.url ||
      getAutoThumbnail(item.videoUrl || undefined),
    [thumbnailData, item.videoUrl]
  )

  const speakerName =
    typeof item.speaker === 'object' && item.speaker !== null
      ? item.speaker?.name ?? undefined
      : typeof item.speaker === 'string'
        ? item.speaker
        : undefined

  const seriesTitle =
    typeof item.series === 'object' && item.series !== null
      ? item.series?.title ?? undefined
      : typeof item.series === 'string'
        ? item.series
        : undefined

  const titleText = item.title ?? speakerName ?? 'Sermon'
  const formattedDate = formatDate(item.date)
  const hasValidThumb = typeof thumb === 'string' && thumb.length > 0
  const hasTitleLink = Boolean(item.slug)
  const imageAlt = thumbnailData?.alt ?? titleText
  const audioUrl = audioData?.url ?? undefined

  return (
    <>
      <div className="group overflow-hidden rounded-lg border shadow-sm transition hover:shadow-md">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative block aspect-video w-full bg-gray-100"
          aria-label={`Play ${titleText}`}
        >
          {hasValidThumb ? (
            <Image
              src={thumb}
              alt={imageAlt}
              fill
              className="object-cover transition group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized={thumb.startsWith('https://img.youtube.com')}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              {speakerName || 'Sermon'}
            </div>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium">
              ▶ Play
            </span>
          </span>
        </button>
        <div className="p-4">
          {hasTitleLink ? (
            <Link href={`/media/${item.slug}`} className="block">
              <h2 className="text-lg font-semibold hover:underline">{titleText}</h2>
            </Link>
          ) : (
            <h2 className="text-lg font-semibold">{titleText}</h2>
          )}
          <p className="mt-1 text-sm text-gray-600">
            {speakerName}
            {formattedDate && ` • ${formattedDate}`}
          </p>
          {seriesTitle && (
            <span className="mt-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs">
              {seriesTitle}
            </span>
          )}
        </div>
      </div>

      <PlaybackModal
        open={open}
        onClose={() => setOpen(false)}
        title={titleText}
        audioUrl={audioUrl}
        videoUrl={item.videoUrl ?? undefined}
      />
    </>
  )
}