// src/app/(frontend)/connect/page.tsx
import { getPayload } from 'payload';
import config from '@payload-config';
import { ConnectCard } from '@/components/connects/connect-card';
import { ContactForm } from '@/components/connects/contact-form';
import { PastoralBooking } from '@/components/connects/pastoral-booking';
import { FALLBACK_CONNECTS } from '@/lib/constants/connect-fallbacks';

export const metadata = {
  title: 'Connect | JMBGM',
  description:
    'Find your people at JMBGM — explore life groups, ministries, and interest-based communities.',
};

export default async function ConnectPage() {
  let connects: any[] = [];
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: 'connects',
      where: { isActive: { equals: true } },
      sort: 'order',
      depth: 2,
      limit: 100,
    });
    connects = result.docs;
  } catch (err) {
    console.error('[connect] Failed to fetch connects:', err);
  }

  const isFallback = connects.length === 0;
  const source = isFallback ? FALLBACK_CONNECTS : connects;

  const connectCards = source.map((connect: any) => ({
    id: String(connect.id),
    name: connect.name,
    slug: connect.slug,
    description: connect.description ?? undefined,
    icon: connect.icon ?? undefined,
    image: connect.image ?? null,
    googleFormUrl: connect.googleFormUrl,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* 1. MINISTRIES DIRECTORY */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2F3E33]">
            Ministries Directory
          </h2>
          <p className="text-sm text-[#5C6F62] mt-2">
            Life groups, demographics, and interest-based communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectCards.map((connect) => (
            <ConnectCard key={connect.id} connect={connect} />
          ))}
        </div>
      </section>

      {/* 2. DIRECT CONTACT FORM */}
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

      {/* 3. PASTORAL CALL BOOKING */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2F3E33]">
            Book a Pastoral Call
          </h2>
          <p className="text-sm text-[#5C6F62] mt-2">
            Schedule a 1-on-1 conversation — counseling, baptism guidance, or
            pastoral care.
          </p>
        </div>
        <PastoralBooking />
      </section>
    </div>
  );
}