import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPayload } from 'payload';
import config from '@payload-config';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';

type Params = { params: Promise<{ slug: string }> };

export default async function ConnectDetailPage({ params }: Params) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: 'connects',
    where: { slug: { equals: slug }, isActive: { equals: true } },
    limit: 1,
  });

  const connect = docs[0];
  if (!connect) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <Button asChild variant="ghost" size="sm">
        <Link href="/connect" className="gap-1.5 text-[#5C6F62]">
          <ArrowLeft className="h-4 w-4" />
          Back to Connect
        </Link>
      </Button>

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2F3E33]">
          {connect.name}
        </h1>
        {connect.description && (
          <p className="text-[#5C6F62] leading-relaxed">{connect.description}</p>
        )}
      </div>

      <Button asChild variant="terracotta">
        <a
          href={connect.googleFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="gap-2"
        >
          Register Now
          <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}