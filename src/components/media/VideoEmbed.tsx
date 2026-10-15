'use client'
import { getEmbedUrl, getVideoProvider } from '@/lib/video'

type Props = { url: string; title?: string }

export function VideoEmbed({ url, title }: Props) {
  const embed = getEmbedUrl(url)
  const provider = getVideoProvider(url)

  if (!embed) {
    return (
      <div className="rounded-lg border border-dashed border-[#E2D9CC] bg-[#FBF6EE] p-6 text-center text-sm text-[#5C6F62]">
        Unsupported video link.{' '}
        <a href={url} target="_blank" rel="noreferrer" className="text-[#C1683B] underline">
          Open in new tab →
        </a>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <iframe
        src={embed}
        title={title || 'Video'}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        style={provider === 'facebook' ? { border: 'none', overflow: 'hidden' } : undefined}
      />
    </div>
  )
}