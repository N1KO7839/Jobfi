import React from "react";

interface OffersSkeletonProps {
  count: number;
}

export default function OffersSkeleton({ count }: OffersSkeletonProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-6 w-40 rounded-md bg-default-100 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 p-5 sm:p-6 rounded-2xl border border-default-200 bg-content1"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-default-100 animate-pulse shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 w-1/3 rounded bg-default-100 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-default-100 animate-pulse" />
              </div>
            </div>
            <div className="h-3 w-1/2 rounded bg-default-100 animate-pulse" />
            <div className="h-7 w-36 rounded-lg bg-default-100 animate-pulse" />
            <div className="flex gap-1.5">
              <div className="h-6 w-14 rounded-lg bg-default-100 animate-pulse" />
              <div className="h-6 w-16 rounded-lg bg-default-100 animate-pulse" />
              <div className="h-6 w-12 rounded-lg bg-default-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
