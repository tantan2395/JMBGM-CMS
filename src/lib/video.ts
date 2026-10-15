export type VideoProvider = 'youtube' | 'facebook' | 'vimeo' | 'unknown'

function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '')
  } catch {
    return null
  }
}

export function getVideoProvider(url?: string): VideoProvider {
  if (!url) return 'unknown'
  const hostname = getHostname(url)
  if (
    hostname === 'youtube.com' ||
    hostname?.endsWith('.youtube.com') ||
    hostname === 'youtu.be'
  ) {
    return 'youtube'
  }
  if (
    hostname === 'facebook.com' ||
    hostname?.endsWith('.facebook.com') ||
    hostname === 'fb.watch'
  ) {
    return 'facebook'
  }
  if (hostname === 'vimeo.com' || hostname?.endsWith('.vimeo.com')) return 'vimeo'
  return 'unknown'
}

export function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '')

    if (hostname === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      return id && /^[\w-]+$/.test(id) ? id : null
    }

    if (hostname !== 'youtube.com' && !hostname.endsWith('.youtube.com')) {
      return null
    }

    if (parsed.pathname === '/watch') {
      const id = parsed.searchParams.get('v')
      return id && /^[\w-]+$/.test(id) ? id : null
    }

    const match = parsed.pathname.match(/^\/(?:embed|shorts)\/([\w-]+)/)
    if (match) return match[1]
  } catch {
    return null
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