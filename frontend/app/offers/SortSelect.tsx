"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowDownUp } from "lucide-react";

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest" },
  { value: "date_asc", label: "Oldest" },
  { value: "payment_desc", label: "Highest salary" },
  { value: "payment_asc", label: "Lowest salary" },
];

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get("sort_type") || "date_desc";

  const onChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");
    if (sort === "date_desc") params.delete("sort_type");
    else params.set("sort_type", sort);

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <label className="inline-flex items-center gap-2 text-xs text-default-500">
      <ArrowDownUp size={13} />
      <span className="sr-only">Sort by</span>
      <select
        className="bg-transparent font-medium text-foreground outline-none cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {SORT_OPTIONS.map((option) => (
          <option
            key={option.value}
            className="bg-content1"
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
