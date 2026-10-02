'use client'

import { useState } from 'react'
import { Calendar, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

const PURPOSES = [
  'Pastoral conversation',
  'Counseling',
  'Baptism guidance',
  'Membership & belonging',
] as const

const PASTORAL_EMAIL = 'pastoral@jmbgm.org'

export function PastoralBooking() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const phone = String(form.get('phone') ?? '').trim()
    const purpose = String(form.get('purpose') ?? '').trim()
    const preferredAt = String(form.get('preferredAt') ?? '').trim()
    const notes = String(form.get('notes') ?? '').trim()
    if (!name || !email) return

    const subject = encodeURIComponent(`Pastoral call request: ${purpose || 'Conversation'}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\nPurpose: ${purpose}\nPreferred time: ${preferredAt || 'Flexible'}\n\n${notes}`,
    )
    window.location.href = `mailto:${PASTORAL_EMAIL}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-2xl border-[#E2D9CC] bg-white">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2 className="h-8 w-8 text-[#8A9A5B]" />
          <p className="font-semibold text-[#2F3E33]">Request ready to send.</p>
          <p className="text-sm text-[#5C6F62]">
            A pastoral team member will follow up to confirm a time that works for you.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl border-[#E2D9CC] bg-white">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="name" placeholder="Name" required className="border-[#C8D2CA]" />
            <Input name="email" type="email" placeholder="Email" required className="border-[#C8D2CA]" />
          </div>
          <Input name="phone" type="tel" placeholder="Phone (optional)" className="border-[#C8D2CA]" />
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              name="purpose"
              defaultValue="Pastoral conversation"
              className="flex h-9 w-full rounded-md border border-[#C8D2CA] bg-transparent px-3 text-sm"
            >
              {PURPOSES.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
            <Input
              name="preferredAt"
              type="datetime-local"
              className="border-[#C8D2CA]"
              aria-label="Preferred date and time"
            />
          </div>
          <Textarea
            name="notes"
            placeholder="Anything our pastoral team should know before the call?"
            rows={4}
            className="border-[#C8D2CA]"
          />
          <Button type="submit" variant="terracotta" className="gap-1.5">
            Request a pastoral call
            <Calendar className="h-3.5 w-3.5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
