'use client'

import { useState } from 'react'

const FALLBACK_THUMBNAIL = '/media/background.jpg'

type Props = {
  src: string
  alt: string
  className: string
}

export function SermonThumbnail({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={failed ? FALLBACK_THUMBNAIL : src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
