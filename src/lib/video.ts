export type VideoProvider = 'youtube' | 'facebook' | 'vimeo' | 'unknown'

export function getVideoProvider(url?: string): VideoProvider {
  if (!url) return 'unknown'
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube'
  if (/facebook\.com|fb\.watch/.test(url)) return 'facebook'
  if (/vimeo\.com/.test(url)) return 'vimeo'
  return 'unknown'
}

export function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]+)/,
    /(?:youtu\.be\/)([\w-]+)/,
    /(?:youtube\.com\/embed\/)([\w-]+)/,
    /(?:youtube\.com\/shorts\/)([\w-]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

export function getEmbedUrl(url: string): string | null {
  const provider = getVideoProvider(url)
  if (provider === 'youtube') {
    const id = getYouTubeId(url)
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : null
  }
  if (provider === 'vimeo') {
    const id = getVimeoId(url)
    return id ? `https://player.vimeo.com/video/${id}` : null
  }
  if (provider === 'facebook') {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      url
    )}&show_text=false&width=800`
  }
  return null
}

export function getAutoThumbnail(url?: string): string | null {
  if (!url) return null
  if (getVideoProvider(url) === 'youtube') {
    const id = getYouTubeId(url)
    return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null
  }
  return null
}