import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ExternalLink, ArrowRight } from 'lucide-react'
import type { Media } from '@/payload-types'
import type { ConnectCategory } from '@/lib/constants/connect'
import { CONNECT_CATEGORY_LABELS } from '@/lib/constants/connect'
import { ensureHttps } from '@/lib/urls'

export type ConnectCardData = {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  category?: ConnectCategory
  schedule?: string | null
  image?: number | Media | null
  googleFormUrl: string
}

type ConnectCardProps = {
  connect: ConnectCardData
}

export function ConnectCard({ connect }: ConnectCardProps) {
  const imageUrl =
    typeof connect.image === 'object' && connect.image !== null
      ? connect.image.sizes?.card?.url || connect.image.url
      : null

  const safeFormUrl = ensureHttps(connect.googleFormUrl)
  const formHref = typeof safeFormUrl === 'string' ? safeFormUrl : undefined
  const categoryLabel = connect.category ? CONNECT_CATEGORY_LABELS[connect.category] : null

  return (
    <Card className="border-[#E2D9CC] bg-white shadow-md flex flex-col overflow-hidden">
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={
              typeof connect.image === 'object' && connect.image !== null
                ? connect.image.alt
                : connect.name
            }
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          {connect.icon && (
            <span
              className="absolute top-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg shadow-sm backdrop-blur"
              aria-hidden="true"
            >
              {connect.icon}
            </span>
          )}
        </div>
      )}

      <CardHeader>
        {categoryLabel && (
          <Badge variant="sage" className="w-fit text-[10px] uppercase tracking-wider">
            {categoryLabel}
          </Badge>
        )}
        <CardTitle className="text-xl text-[#2F3E33]">
          {!imageUrl && connect.icon && (
            <span className="mr-2" aria-hidden="true">{connect.icon}</span>
          )}
          {connect.name}
        </CardTitle>
        {connect.schedule && (
          <p className="text-xs font-medium text-[#C1683B]">{connect.schedule}</p>
        )}
        {connect.description && (
          <CardDescription className="text-[#5C6F62]">
            {connect.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="mt-auto flex flex-col sm:flex-row gap-2">
        {formHref && (
          <Button asChild variant="terracotta" size="sm" className="flex-1">
            <a
              href={formHref}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1.5"
            >
              Register
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        )}

        <Button asChild variant="outline" size="sm" className="flex-1 border-[#E2D9CC]">
          <Link href={`/connect/${connect.slug}`} className="gap-1.5">
            Learn More
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
