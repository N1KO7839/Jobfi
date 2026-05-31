import React from "react";

import { fetchOffers } from "./actions";

import { OfferCard } from "@/components/OfferCard";
import { PaginationControls } from "@/components/PaginationControls";
import { JobOffer, sort_type } from "@/types/offers";

interface PaginatedOffersParams {
  page: number;
  size: number;
  sort_type: sort_type;
  min_salary?: string;
  max_salary?: string;
  working_mode?: string;
  location?: string;
}

const PaginatedOffers = async ({
  page,
  size,
  sort_type,
  min_salary,
  max_salary,
  working_mode,
  location,
}: PaginatedOffersParams) => {
  const response = await fetchOffers(
    page,
    size,
    sort_type,
    min_salary,
    max_salary,
    working_mode,
    location,
  );

  if (!response.success) {
    return <div className="text-danger">We couldn&apos;t fetch offers</div>;
  }

  const { items, total_pages, page: currentPage } = response.data;

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-default-500">
        <h3 className="text-xl font-semibold mb-2">No offers found</h3>
        <p>Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {items.map((offer: JobOffer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
      <PaginationControls currentPage={currentPage} totalPages={total_pages} />
    </div>
  );
};

export default PaginatedOffers;
