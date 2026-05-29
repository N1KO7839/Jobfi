import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { Spinner } from "@heroui/spinner";

import RedirectWithToast from "./RedirectWithToast";
import PaginatedOffers from "./PaginatedOffers";

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
  const sortTypeParam = (resolvedSearchParams?.sort_type as any) || "date_desc";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-semibold">Latest offers</h2>
        <h4 className="text-md font-medium text-white/30">
          Fresh roles aggregated from across the web — updated every 30 minutes
        </h4>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        }
      >
        <PaginatedOffers
          page={pageParam}
          size={sizeParam}
          sort_type={sortTypeParam}
        />
      </Suspense>
    </div>
  );
};

export default page;
