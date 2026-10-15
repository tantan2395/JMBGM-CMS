'use client'
import { useState } from 'react'
import { VideoEmbed } from './VideoEmbed'

type Props = { audioUrl?: string; videoUrl?: string; title: string }

export function SermonPlayer({ audioUrl, videoUrl, title }: Props) {
  const [tab, setTab] = useState<'video' | 'audio'>(videoUrl ? 'video' : 'audio')
  const hasVideo = Boolean(videoUrl)
  const hasAudio = Boolean(audioUrl)
  if (!hasVideo && !hasAudio) return null

  return (
    <div className="mt-6">
      {hasVideo && hasAudio && (
        <div className="mb-3 flex gap-2">
          <button
            onClick={() => setTab('video')}
            className={`rounded px-3 py-1 ${
              tab === 'video'
                ? 'bg-[#2F3E33] text-[#FBF6EE]'
                : 'bg-[#EFE8DC] text-[#2F3E33] hover:bg-[#E2D9CC]'
            }`}
          >
            Watch
          </button>
          <button
            onClick={() => setTab('audio')}
            className={`rounded px-3 py-1 ${
              tab === 'audio'
                ? 'bg-[#2F3E33] text-[#FBF6EE]'
                : 'bg-[#EFE8DC] text-[#2F3E33] hover:bg-[#E2D9CC]'
            }`}
          >
            Listen
          </button>
        </div>
      )}

      {tab === 'video' && hasVideo && <VideoEmbed url={videoUrl!} title={title} />}

      {tab === 'audio' && hasAudio && (
        <audio controls className="w-full" preload="metadata">
          <source src={audioUrl} />
        </audio>
      )}
    </div>
  )
}