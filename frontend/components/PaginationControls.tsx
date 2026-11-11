"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
}

function getPageNumbers(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  return sorted.flatMap((page, i) =>
    i > 0 && page - sorted[i - 1] > 1 ? ["gap" as const, page] : [page],
  );
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  totalPages,
  currentPage,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  const arrowClass =
    "flex items-center justify-center w-9 h-9 rounded-lg border border-default-200 bg-content1 text-default-600 hover:bg-default-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer";

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 pt-4"
    >
      <button
        aria-label="Previous page"
        className={arrowClass}
        disabled={currentPage <= 1}
        type="button"
        onClick={() => goTo(currentPage - 1)}
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers(currentPage, totalPages).map((page, i) =>
        page === "gap" ? (
          <span key={`gap-${i}`} className="w-6 text-center text-default-400">
            …
          </span>
        ) : (
          <button
            key={page}
            aria-current={page === currentPage ? "page" : undefined}
            className={`min-w-9 h-9 px-2 rounded-lg text-sm font-medium tabular-nums transition-colors cursor-pointer ${
              page === currentPage
                ? "bg-foreground text-background font-semibold"
                : "text-default-600 hover:bg-default-100"
            }`}
            type="button"
            onClick={() => goTo(page)}
          >
            {page}
          </button>
        ),
      )}

      <button
        aria-label="Next page"
        className={arrowClass}
        disabled={currentPage >= totalPages}
        type="button"
        onClick={() => goTo(currentPage + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};
