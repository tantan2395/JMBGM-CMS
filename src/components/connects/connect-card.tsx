import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ExternalLink, ArrowRight } from 'lucide-react';
import type { Media } from '@/payload-types';

type ConnectCardProps = {
  connect: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: number | Media | null;
    googleFormUrl: string;
  };
};

export function ConnectCard({ connect }: ConnectCardProps) {
  const imageUrl =
    typeof connect.image === 'object' && connect.image !== null
      ? connect.image.sizes?.card?.url || connect.image.url
      : null;

  return (
    <Card className="border-[#E2D9CC] bg-white shadow-md flex flex-col">
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={typeof connect.image === 'object' && connect.image !== null ? connect.image.alt : connect.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl text-[#2F3E33]">{connect.name}</CardTitle>
        {connect.description && (
          <CardDescription className="text-[#5C6F62]">
            {connect.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="mt-auto flex flex-col sm:flex-row gap-2">
        {/* Register button → Google Form */}
        <Button
          asChild
          variant="terracotta"
          size="sm"
          className="flex-1"
        >
          <a
            href={connect.googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-1.5"
          >
            Register
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>

        {/* Learn More button → detail page */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 border-[#E2D9CC]"
        >
          <Link href={`/connect/${connect.slug}`} className="gap-1.5">
            Learn More
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}