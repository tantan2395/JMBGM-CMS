import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Connect } from '@/payload-types'
import { ContactForm } from '@/components/connects/contact-form'
import { PastoralBooking } from '@/components/connects/pastoral-booking'
import { ConnectDirectory } from '@/components/connects/connect-directory'
import type { ConnectCardData } from '@/components/connects/connect-card'
import { FALLBACK_CONNECTS } from '@/lib/constants/connect-fallbacks'
import type { ConnectCategory } from '@/lib/constants/connect'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Connect | JMBGM',
  description:
    'Find your people at JMBGM — explore life groups, ministries, and interest-based communities.',
}

function toCard(connect: Connect | (typeof FALLBACK_CONNECTS)[number]): ConnectCardData {
  return {
    id: String(connect.id),
    name: connect.name,
    slug: connect.slug,
    description: connect.description ?? undefined,
    icon: connect.icon ?? undefined,
    category: connect.category as ConnectCategory,
    schedule: connect.schedule ?? undefined,
    image: 'image' in connect ? connect.image ?? null : null,
    googleFormUrl: connect.googleFormUrl,
  }
}

async function getConnects(): Promise<Connect[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'connects',
      where: {
        and: [
          { isActive: { equals: true } },
          { _status: { equals: 'published' } },
        ],
      },
      sort: 'order',
      depth: 2,
      limit: 100,
    })
    return result.docs
  } catch (err) {
    console.error('[connect] Failed to fetch connects:', err)
    return []
  }
}

export default async function ConnectPage() {
  const docs = await getConnects()
  const connectCards = (docs.length > 0 ? docs : FALLBACK_CONNECTS).map(toCard)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-[#5C6F62]">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-[#C1683B] transition-colors">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#2F3E33]">Connect</span>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-[#5C6F62] hover:text-[#2F3E33]">
          <Link href="/" className="gap-1.5">
            <ArrowLeft className="h-3 w-3" />
            Return to Homepage
          </Link>
        </Button>
      </nav>

      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <Badge variant="outline" className="text-xs uppercase tracking-widest px-3 py-1 text-[#C1683B] border-[#C1683B]/40">
          Community &amp; Connection
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#2F3E33]">
          Find your people
        </h1>
        <p className="text-base text-[#5C6F62] leading-relaxed">
          Life groups, demographic ministries, and serve teams — plus a direct line for first-time
          inquiries and pastoral care. Calendars live on Events; campus maps live on Outreaches.
        </p>
      </div>

      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2F3E33]">
            Ministries Directory
          </h2>
          <p className="text-sm text-[#5C6F62] mt-2">
            Life groups, demographics, and interest-based communities.
          </p>
        </div>
        <ConnectDirectory connects={connectCards} />
      </section>

      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2F3E33]">
            Get in Touch
          </h2>
          <p className="text-sm text-[#5C6F62] mt-2">
            First-time inquiries, pastoral care, and membership questions.
          </p>
        </div>
        <ContactForm />
      </section>

      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2F3E33]">
            Book a Pastoral Call
          </h2>
          <p className="text-sm text-[#5C6F62] mt-2">
            Schedule a 1-on-1 conversation — counseling, baptism guidance, or pastoral care.
          </p>
        </div>
        <PastoralBooking />
      </section>
    </div>
  )
}
