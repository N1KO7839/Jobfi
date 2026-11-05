import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import Link from "next/link";

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
  const sourceParam = resolvedSearchParams?.source as string | undefined;
  const searchParam = resolvedSearchParams?.search as string | undefined;

  const locations = await fetchLocations();

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div className="flex flex-col gap-1.5 pt-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Browse Offers
        </h1>
        <p className="text-default-500 text-sm">
          Search and compare developer roles with transparent salary ranges.
        </p>
      </div>

      {!isLoggedIn && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-content1 border border-default-200 text-sm shadow-2xs">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-foreground">
              Browsing as guest
            </span>
            <span className="text-default-500 text-xs">
              Create an account to save filters and receive daily morning email
              notifications with newly published listings.
            </span>
          </div>
          <Button
            as={Link}
            className="font-semibold shrink-0 bg-foreground text-background hover:opacity-90 text-xs px-4 h-8 rounded-lg shadow-xs transition-opacity"
            href="/auth/register"
            size="sm"
            variant="solid"
          >
            Create Alert Account
          </Button>
        </div>
      )}

      <OffersFilter locations={locations} />

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Spinner color="default" size="md" />
            <p className="text-default-400 text-xs">Loading offers...</p>
          </div>
        }
      >
        <PaginatedOffers
          location={locationParam}
          max_salary={maxSalaryParam}
          min_salary={minSalaryParam}
          page={pageParam}
          search={searchParam}
          size={sizeParam}
          sort_type={sortTypeParam}
          source={sourceParam}
          working_mode={workingModeParam}
        />
      </Suspense>
    </div>
  );
};

export default page;
