'use client'

import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

const INQUIRY_TYPES = [
  'First-time visitor',
  'Pastoral care',
  'Membership',
  'Baptism',
  'Life group inquiry',
  'Other',
] as const

const CONTACT_EMAIL = 'info@jmbgm.org'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const inquiry = String(form.get('inquiry') ?? '').trim()
    const message = String(form.get('message') ?? '').trim()
    if (!name || !email || !message) return

    const subject = encodeURIComponent(`Connect inquiry: ${inquiry || 'General'}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInquiry type: ${inquiry}\n\n${message}`,
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-2xl border-[#E2D9CC] bg-white">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <CheckCircle2 className="h-8 w-8 text-[#8A9A5B]" />
          <p className="font-semibold text-[#2F3E33]">Your email client should open shortly.</p>
          <p className="text-sm text-[#5C6F62]">
            If it does not, write us directly at {CONTACT_EMAIL}.
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
          <select
            name="inquiry"
            defaultValue="First-time visitor"
            className="flex h-9 w-full rounded-md border border-[#C8D2CA] bg-transparent px-3 text-sm"
          >
            {INQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <Textarea
            name="message"
            placeholder="How can we help?"
            required
            rows={5}
            className="border-[#C8D2CA]"
          />
          <Button type="submit" variant="terracotta" className="gap-1.5">
            Send message
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
