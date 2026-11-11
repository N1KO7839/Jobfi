import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { Button } from "@heroui/button";
import Link from "next/link";

import PaginatedOffers from "./PaginatedOffers";
import OffersFilter from "./OffersFilter";
import OffersSkeleton from "./OffersSkeleton";
import { fetchLocations, fetchSourceCounts } from "./actions";

import { sort_type } from "@/types/offers";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const PAGE_SIZE = 12;

const page = async ({ searchParams }: PageProps) => {
  const cookieStore = await cookies();
  const isLoggedIn =
    cookieStore.has("access_token") || cookieStore.has("refresh_token");

  const params = await searchParams;
  const getParam = (key: string) => params?.[key] as string | undefined;

  const pageParam = Number(getParam("page")) || 1;
  const sortTypeParam = (getParam("sort_type") as sort_type) || "date_desc";

  const [locations, sourceCounts] = await Promise.all([
    fetchLocations(),
    fetchSourceCounts(),
  ]);

  const filters = {
    min_salary: getParam("min_salary"),
    max_salary: getParam("max_salary"),
    working_mode: getParam("working_mode"),
    location: getParam("location"),
    source: getParam("source"),
    search: getParam("search"),
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Browse Offers
          </h1>
          <p className="text-default-500 text-sm">
            Developer roles from six Polish job boards, refreshed every hour.
          </p>
        </div>

        {!isLoggedIn && (
          <div className="flex items-center gap-3 text-xs text-default-500">
            <span className="hidden md:inline">
              Get new matches by email every morning
            </span>
            <Button
              as={Link}
              className="font-semibold shrink-0 bg-foreground text-background hover:opacity-90 text-xs px-4 h-8 rounded-lg"
              href="/auth/register"
              size="sm"
            >
              Create alert
            </Button>
          </div>
        )}
      </div>

      <OffersFilter locations={locations} sourceCounts={sourceCounts} />

      <Suspense
        key={JSON.stringify({ ...filters, pageParam, sortTypeParam })}
        fallback={<OffersSkeleton count={PAGE_SIZE} />}
      >
        <PaginatedOffers
          {...filters}
          page={pageParam}
          size={PAGE_SIZE}
          sort_type={sortTypeParam}
        />
      </Suspense>
    </div>
  );
};

export default page;
