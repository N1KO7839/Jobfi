import React from "react";

import { fetchOffers } from "./actions";

import { OfferCard } from "@/components/OfferCard";
import { PaginationControls } from "@/components/PaginationControls";
import { JobOffer } from "@/types/offers";

interface PaginatedOffersParams {
  page: number;
  size: number;
  sort_type: "date_desc" | "date_asc" | "salary_desc" | "salary_asc";
}

const PaginatedOffers = async ({
  page,
  size,
  sort_type,
}: PaginatedOffersParams) => {
  const response = await fetchOffers(page, size, sort_type);

  if (!response.success) {
    return <div className="text-danger">Nie udało się pobrać ofert.</div>;
  }

  const { items, total_pages, page: currentPage } = response.data;

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
