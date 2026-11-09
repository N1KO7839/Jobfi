import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { fetchOffers } from "@/app/offers/actions";
import { OfferCard } from "@/components/OfferCard";
import { JobOffer } from "@/types/offers";

export default async function FeaturedOffers() {
  const response = await fetchOffers(1, 4, "date_desc");
  const offers: JobOffer[] = response.success ? response.data.items || [] : [];

  if (offers.length === 0) return null;

  return (
    <section className="py-10 md:py-14 border-t border-default-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Latest listings
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Recent tech opportunities in Poland
          </h2>
          <p className="text-default-500 text-sm">
            Live openings freshly indexed across NoFluffJobs, JustJoin.it,
            Pracuj.pl, and more.
          </p>
        </div>

        <Link
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground hover:opacity-75 transition-opacity shrink-0 pb-1"
          href="/offers"
        >
          <span>View all offers</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
