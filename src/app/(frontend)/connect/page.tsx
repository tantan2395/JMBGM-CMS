import { getPayload } from 'payload';
import config from '@payload-config';
import { ConnectCard } from '@/components/connects/connect-card';

export const metadata = {
  title: 'Connect & Gatherings | JMBGM',
  description:
    'Join Jesus the Master Builder Global Ministry this Sunday for worship, prayer, and life group fellowship.',
};

export default async function ConnectPage() {
  const payload = await getPayload({ config });

  const { docs: connects } = await payload.find({
    collection: 'connects',
    where: { isActive: { equals: true } },
    sort: 'order',
    depth: 2,
    limit: 100,
  });

  const connectCards = connects.map((connect) => ({
    id: String(connect.id),
    name: connect.name,
    slug: connect.slug,
    description: connect.description ?? undefined,
    image: connect.image,
    googleFormUrl: connect.googleFormUrl,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Community & Connection Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2F3E33]">
            Community &amp; Connection
          </h2>
          <p className="text-sm text-[#5C6F62] mt-2">
            Find your people. Grow in faith. Serve with purpose.
          </p>
        </div>

        {connectCards.length === 0 ? (
          <p className="text-center text-sm text-[#5C6F62] italic">
            No active connects at the moment. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectCards.map((connect) => (
              <ConnectCard key={connect.id} connect={connect} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}