"use client";

import React from "react";
import { Button } from "@heroui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  totalPages,
  currentPage,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-6 pb-2 w-full">
      <Button
        className="border-default-200 text-default-600 bg-content1 rounded-xl px-4 h-9 font-medium hover:bg-default-100"
        isDisabled={currentPage <= 1}
        startContent={<ChevronLeft size={16} />}
        variant="bordered"
        onPress={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </Button>

      <span className="text-xs sm:text-sm text-default-500 font-medium px-2">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        className="border-default-200 text-default-600 bg-content1 rounded-xl px-4 h-9 font-medium hover:bg-default-100"
        endContent={<ChevronRight size={16} />}
        isDisabled={currentPage >= totalPages}
        variant="bordered"
        onPress={() => handlePageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};
