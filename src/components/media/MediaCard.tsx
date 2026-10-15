'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { getAutoThumbnail } from '@/lib/video'
import { PlaybackModal } from './PlaybackModal'
import { SermonThumbnail } from './SermonThumbnail'

type MediaThumb = {
  url?: string | null
  alt?: string | null
  sizes?: {
    card?: { url?: string | null }
  }
}

type MediaRelation<T> = T | number | null | undefined

const FALLBACK_THUMBNAIL = '/media/background.jpg'

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
      getAutoThumbnail(item.videoUrl || undefined) ||
      FALLBACK_THUMBNAIL,
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
  const audioUrl = audioData?.url ?? undefined
  const hasPlayback = Boolean(item.videoUrl || audioUrl)
  const hasTitleLink = Boolean(item.slug)
  const imageAlt = thumbnailData?.alt ?? titleText

  return (
    <>
      <div className="group overflow-hidden rounded-lg border border-[#E2D9CC] bg-white shadow-sm transition hover:border-[#C1683B]/50 hover:shadow-md">
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={!hasPlayback}
          className="relative block aspect-video w-full bg-[#EFE8DC] disabled:cursor-default"
          aria-label={hasPlayback ? `Play ${titleText}` : `${titleText} thumbnail`}
        >
          <SermonThumbnail
            src={thumb}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
          />
          {hasPlayback && (
            <span className="absolute inset-0 flex items-center justify-center bg-[#2F3E33]/20 opacity-0 transition group-hover:opacity-100">
              <span className="rounded-full bg-[#FBF6EE]/95 px-4 py-2 text-sm font-semibold text-[#C1683B]">
                ▶ Play
              </span>
            </span>
          )}
        </button>
        <div className="p-4">
          {hasTitleLink ? (
            <Link href={`/media/${item.slug}`} className="block">
              <h2 className="text-lg font-semibold text-[#2F3E33] hover:text-[#C1683B] hover:underline">
                {titleText}
              </h2>
            </Link>
          ) : (
            <h2 className="text-lg font-semibold text-[#2F3E33]">{titleText}</h2>
          )}
          <p className="mt-1 text-sm text-[#5C6F62]">
            {speakerName}
            {formattedDate && ` • ${formattedDate}`}
          </p>
          {seriesTitle && (
            <span className="mt-2 inline-block rounded-full bg-[#C1683B]/10 px-2 py-0.5 text-xs font-medium text-[#A95530]">
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