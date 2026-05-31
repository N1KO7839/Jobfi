import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { Spinner } from "@heroui/spinner";

import RedirectWithToast from "./RedirectWithToast";
import PaginatedOffers from "./PaginatedOffers";
import OffersFilter from "./OffersFilter";
import { fetchLocations } from "./actions";

import { sort_type } from "@/types/offers";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const page = async ({ searchParams }: PageProps) => {
  const cookieStore = await cookies();
  const isLoggedIn =
    cookieStore.has("access_token") || cookieStore.has("refresh_token");

  if (!isLoggedIn) {
    return <RedirectWithToast />;
  }

  const resolvedSearchParams = await searchParams;
  const pageParam = Number(resolvedSearchParams?.page) || 1;
  const sizeParam = Number(resolvedSearchParams?.size) || 10;
  const sortTypeParam =
    (resolvedSearchParams?.sort_type as sort_type) || "date_desc";

  const minSalaryParam = resolvedSearchParams?.min_salary as string | undefined;
  const maxSalaryParam = resolvedSearchParams?.max_salary as string | undefined;
  const workingModeParam = resolvedSearchParams?.working_mode as
    | string
    | undefined;
  const locationParam = resolvedSearchParams?.location as string | undefined;

  const locations = await fetchLocations();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-semibold">Latest offers</h2>
        <h4 className="text-md font-medium text-white/30">
          Fresh roles aggregated from across the web — updated every 30 minutes
        </h4>
      </div>

      <OffersFilter locations={locations} />

      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        }
      >
        <PaginatedOffers
          location={locationParam}
          max_salary={maxSalaryParam}
          min_salary={minSalaryParam}
          page={pageParam}
          size={sizeParam}
          sort_type={sortTypeParam}
          working_mode={workingModeParam}
        />
      </Suspense>
    </div>
  );
};

export default page;
