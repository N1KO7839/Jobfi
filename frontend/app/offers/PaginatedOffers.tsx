import React from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";

import { fetchOffers } from "./actions";
import SortSelect from "./SortSelect";

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
  source?: string;
  search?: string;
}

const POPULAR_SEARCHES = ["Python", "React", "Java", "DevOps", "QA"];

const PaginatedOffers = async ({
  page,
  size,
  sort_type,
  min_salary,
  max_salary,
  working_mode,
  location,
  source,
  search,
}: PaginatedOffersParams) => {
  const response = await fetchOffers(
    page,
    size,
    sort_type,
    min_salary,
    max_salary,
    working_mode,
    location,
    source,
    search,
  );

  if (!response.success) {
    return (
      <div className="p-6 rounded-2xl border border-danger-200 bg-danger-50/20 text-danger text-sm text-center">
        We couldn&apos;t load job offers right now. Please refresh the page or
        try again in a moment.
      </div>
    );
  }

  const { items, total_pages, page: currentPage, total_items } = response.data;

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-default-200 bg-content1/40">
        <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-400 mb-4">
          <SearchX size={22} />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1.5">
          No matching offers
        </h3>
        <p className="text-sm text-default-500 max-w-md mb-6 leading-relaxed">
          {search
            ? `Nothing matches "${search}" with the current filters. Try a broader term or remove some filters.`
            : "No offers match the current filters. Try lowering the salary range or picking a different city."}
        </p>

        <Link
          className="px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
          href="/offers"
        >
          Clear all filters
        </Link>

        <div className="mt-8 pt-6 border-t border-default-100 flex flex-wrap items-center justify-center gap-2 text-xs text-default-400">
          <span>Try:</span>
          {POPULAR_SEARCHES.map((term) => (
            <Link
              key={term}
              className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 font-medium transition-colors"
              href={`/offers?search=${term}`}
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const firstItem = (currentPage - 1) * size + 1;
  const lastItem = firstItem + items.length - 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm text-default-500 pb-3 border-b border-default-100">
        <span>
          <span className="font-semibold text-foreground tabular-nums">
            {total_items.toLocaleString("pl-PL")}
          </span>{" "}
          {total_items === 1 ? "offer" : "offers"}
          {total_pages > 1 && (
            <span className="hidden sm:inline text-default-400">
              {" "}
              · showing {firstItem}–{lastItem}
            </span>
          )}
        </span>

        <SortSelect />
      </div>

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
