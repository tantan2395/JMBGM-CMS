'use client'
import { useEffect } from 'react'
import { SermonPlayer } from './SermonPlayer'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  audioUrl?: string
  videoUrl?: string
}

export function PlaybackModal({ open, onClose, title, audioUrl, videoUrl }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-lg border border-[#E2D9CC] bg-[#FBF6EE] p-4 text-[#2F3E33]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-[#2F3E33] hover:bg-[#EFE8DC]"
          >
            ✕
          </button>
        </div>
        <SermonPlayer audioUrl={audioUrl} videoUrl={videoUrl} title={title} />
      </div>
    </div>
  )
}