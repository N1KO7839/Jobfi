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
    <div className="flex items-center justify-between mt-8 w-full max-w-5xl mx-auto px-4">
      <Button
        className="border-default-200 text-default-600 bg-transparent rounded-full px-5 font-medium hover:bg-default-100"
        isDisabled={currentPage <= 1}
        startContent={<ChevronLeft size={18} />}
        variant="bordered"
        onPress={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </Button>

      <span className="text-[14px] text-default-500 font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        className="border-default-200 text-default-600 bg-transparent rounded-full px-5 font-medium hover:bg-default-100"
        endContent={<ChevronRight size={18} />}
        isDisabled={currentPage >= totalPages}
        variant="bordered"
        onPress={() => handlePageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};
