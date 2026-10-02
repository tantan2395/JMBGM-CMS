import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Connect, Media } from '@/payload-types'
import { FALLBACK_CONNECTS } from '@/lib/constants/connect-fallbacks'
import { CONNECT_CATEGORY_LABELS, type ConnectCategory } from '@/lib/constants/connect'
import { ensureHttps } from '@/lib/urls'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

type MinistryView = {
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  category?: ConnectCategory
  schedule?: string | null
  googleFormUrl: string
  imageUrl: string | null
  imageAlt: string
}

function mediaUrl(image: Connect['image']): string | null {
  if (typeof image === 'object' && image !== null && typeof image.url === 'string') {
    return image.sizes?.hero?.url || image.url
  }
  return null
}

function mediaAlt(image: Connect['image'], fallback: string): string {
  if (typeof image === 'object' && image !== null) {
    const media = image as Media
    return media.alt || fallback
  }
  return fallback
}

function toView(ministry: Connect | (typeof FALLBACK_CONNECTS)[number]): MinistryView {
  const image = 'image' in ministry ? ministry.image : null
  return {
    name: ministry.name,
    slug: ministry.slug,
    description: ministry.description,
    icon: ministry.icon,
    category: ministry.category as ConnectCategory,
    schedule: ministry.schedule,
    googleFormUrl: ministry.googleFormUrl,
    imageUrl: mediaUrl(image ?? null),
    imageAlt: mediaAlt(image ?? null, ministry.name),
  }
}

async function getMinistry(slug: string) {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'connects',
      where: {
        and: [
          { slug: { equals: slug } },
          { isActive: { equals: true } },
          { _status: { equals: 'published' } },
        ],
      },
      depth: 2,
      limit: 1,
    })
    if (docs[0]) return toView(docs[0])
  } catch (err) {
    console.error('[connect/[slug]] DB fetch failed:', err)
  }

  const fallback = FALLBACK_CONNECTS.find((c) => c.slug === slug)
  return fallback ? toView(fallback) : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const ministry = await getMinistry(slug)

  if (!ministry) return { title: 'Ministry Not Found | JMBGM' }

  return {
    title: `${ministry.name} | JMBGM`,
    description:
      ministry.description ?? `Learn more about ${ministry.name} at JMBGM.`,
    openGraph: {
      title: ministry.name,
      description: ministry.description ?? undefined,
      images: ministry.imageUrl ? [ministry.imageUrl] : undefined,
    },
  }
}

export default async function MinistryPage({ params }: Props) {
  const { slug } = await params
  const ministry = await getMinistry(slug)

  if (!ministry) notFound()

  const formHref = ensureHttps(ministry.googleFormUrl)
  const categoryLabel = ministry.category ? CONNECT_CATEGORY_LABELS[ministry.category] : null

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#5C6F62]">
        <Link href="/" className="hover:text-[#C1683B] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/connect" className="hover:text-[#C1683B] transition-colors">Connect</Link>
        <span>/</span>
        <span className="font-semibold text-[#2F3E33]">{ministry.name}</span>
      </nav>

      {ministry.imageUrl && (
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          <Image
            src={ministry.imageUrl}
            alt={ministry.imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {ministry.icon && (
            <span className="text-3xl" aria-hidden="true">
              {ministry.icon}
            </span>
          )}
          {categoryLabel && (
            <Badge variant="sage" className="text-[10px] uppercase tracking-wider">
              {categoryLabel}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold text-[#2F3E33]">{ministry.name}</h1>
        {ministry.schedule && (
          <p className="text-sm font-medium text-[#C1683B]">{ministry.schedule}</p>
        )}
        {ministry.description && (
          <p className="text-[#5C6F62] leading-relaxed">{ministry.description}</p>
        )}
      </header>

      <div className="flex flex-wrap gap-3">
        {typeof formHref === 'string' && (
          <Button asChild variant="terracotta">
            <a href={formHref} target="_blank" rel="noopener noreferrer" className="gap-1.5">
              Register / Join
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}
        <Button asChild variant="outline" className="border-[#E2D9CC]">
          <Link href="/connect" className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            All ministries
          </Link>
        </Button>
      </div>
    </article>
  )
}
