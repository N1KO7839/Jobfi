"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@heroui/input";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface OffersFilterProps {
  locations: string[];
  sourceCounts: Record<string, number>;
}

const WORKING_MODES = ["Remote", "Hybrid", "Office"];

const PLATFORMS = [
  { value: "JustJoinIt", label: "JustJoin.it" },
  { value: "NoFluffJobs", label: "NoFluffJobs" },
  { value: "Pracuj.pl", label: "Pracuj.pl" },
  { value: "The Protocol", label: "The Protocol" },
  { value: "Bulldogjob", label: "Bulldogjob" },
  { value: "Solid.Jobs", label: "Solid.Jobs" },
];

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-md bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 font-medium">
      {label}
      <button
        aria-label={`Remove ${label}`}
        className="p-0.5 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-100 transition-colors cursor-pointer"
        type="button"
        onClick={onRemove}
      >
        <X size={12} />
      </button>
    </span>
  );
}

const formatPln = (value: string) =>
  `${Number(value).toLocaleString("pl-PL")} PLN`;

export default function OffersFilter({
  locations,
  sourceCounts,
}: OffersFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = (key: string) => searchParams.get(key) || "";

  const [search, setSearch] = useState(current("search"));
  const [location, setLocation] = useState(current("location"));
  const [minSalary, setMinSalary] = useState(current("min_salary"));
  const [maxSalary, setMaxSalary] = useState(current("max_salary"));
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(
      current("location") ||
        current("min_salary") ||
        current("max_salary") ||
        current("working_mode"),
    ),
  );

  useEffect(() => {
    setSearch(current("search"));
    setLocation(current("location"));
    setMinSalary(current("min_salary"));
    setMaxSalary(current("max_salary"));
  }, [searchParams]);

  const source = current("source");
  const workingMode = current("working_mode");
  const totalCount = Object.values(sourceCounts).reduce((a, b) => a + b, 0);

  const updateParams = (changes: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");
    Object.entries(changes).forEach(([key, val]) => {
      if (val.trim()) params.set(key, val.trim());
      else params.delete(key);
    });

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const applyInputs = () =>
    updateParams({
      search,
      location,
      min_salary: minSalary,
      max_salary: maxSalary,
    });

  const clearFilters = () => {
    const sort = current("sort_type");

    router.push(sort ? `${pathname}?sort_type=${sort}` : pathname, {
      scroll: false,
    });
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") applyInputs();
  };

  const activeChips = [
    { key: "search", label: `"${current("search")}"` },
    { key: "source", label: current("source") },
    { key: "location", label: current("location") },
    { key: "working_mode", label: current("working_mode") },
    {
      key: "min_salary",
      label:
        current("min_salary") && `From ${formatPln(current("min_salary"))}`,
    },
    {
      key: "max_salary",
      label:
        current("max_salary") && `Up to ${formatPln(current("max_salary"))}`,
    },
  ].filter((chip) => current(chip.key));

  const tabClass = (isActive: boolean) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 cursor-pointer font-medium ${
      isActive
        ? "bg-foreground text-background font-semibold"
        : "hover:bg-default-100 text-default-600 dark:text-default-400 hover:text-foreground"
    }`;

  const countClass = (isActive: boolean) =>
    `tabular-nums ${isActive ? "opacity-70" : "text-default-400"}`;

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-content1 border border-default-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-xl bg-default-100/60 dark:bg-default-50/40 border border-default-200">
        <div className="flex-1 min-w-0 flex items-center gap-2.5 px-3 py-2">
          <Search className="text-default-400 shrink-0" size={18} />
          <input
            className="w-full min-w-0 bg-transparent outline-none text-sm text-foreground placeholder:text-default-400"
            placeholder="Job title, technology or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onEnter}
          />
          {search && (
            <button
              aria-label="Clear search"
              className="text-default-400 hover:text-foreground p-1 shrink-0 cursor-pointer"
              type="button"
              onClick={() => {
                setSearch("");
                updateParams({ search: "" });
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            className={`text-xs font-medium h-9 px-3 rounded-lg ${
              showAdvanced
                ? "text-foreground bg-default-200/60"
                : "text-default-600 dark:text-default-400 hover:text-foreground"
            }`}
            startContent={<SlidersHorizontal size={14} />}
            variant="light"
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            Filters
          </Button>

          <Button
            className="flex-1 sm:flex-none bg-foreground text-background font-semibold text-xs h-9 px-5 rounded-lg hover:opacity-90 transition-opacity"
            size="sm"
            onPress={applyInputs}
          >
            Search
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-default-100">
        <button
          className={tabClass(!source)}
          type="button"
          onClick={() => updateParams({ source: "" })}
        >
          All platforms
          {totalCount > 0 && (
            <span className={countClass(!source)}>{totalCount}</span>
          )}
        </button>
        {PLATFORMS.map((p) => {
          const isActive = source === p.value;
          const count = sourceCounts[p.value] ?? 0;

          return (
            <button
              key={p.value}
              className={`${tabClass(isActive)} ${count === 0 && !isActive ? "opacity-50" : ""}`}
              type="button"
              onClick={() => updateParams({ source: p.value })}
            >
              {p.label}
              <span className={countClass(isActive)}>{count}</span>
            </button>
          );
        })}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto] gap-3 items-center">
          <Autocomplete
            allowsCustomValue
            className="w-full"
            defaultItems={locations.map((city) => ({ value: city }))}
            inputValue={location}
            label="City"
            placeholder="Any city"
            selectedKey={locations.includes(location) ? location : null}
            size="sm"
            variant="bordered"
            onInputChange={setLocation}
            onKeyDown={onEnter}
            onSelectionChange={(key) => {
              if (key) updateParams({ location: key as string });
            }}
          >
            {(item) => (
              <AutocompleteItem key={item.value}>{item.value}</AutocompleteItem>
            )}
          </Autocomplete>

          <Input
            className="w-full"
            endContent={<span className="text-xs text-default-400">PLN</span>}
            label="Min monthly salary"
            size="sm"
            type="number"
            value={minSalary}
            variant="bordered"
            onKeyDown={onEnter}
            onValueChange={setMinSalary}
          />

          <Input
            className="w-full"
            endContent={<span className="text-xs text-default-400">PLN</span>}
            label="Max monthly salary"
            size="sm"
            type="number"
            value={maxSalary}
            variant="bordered"
            onKeyDown={onEnter}
            onValueChange={setMaxSalary}
          />

          <div className="flex items-center gap-1 p-1 rounded-xl border border-default-200 h-12">
            {["", ...WORKING_MODES].map((mode) => {
              const isActive = workingMode === mode;

              return (
                <button
                  key={mode || "any"}
                  className={`h-full px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-foreground text-background font-semibold"
                      : "text-default-600 dark:text-default-400 hover:bg-default-100 hover:text-foreground"
                  }`}
                  type="button"
                  onClick={() => updateParams({ working_mode: mode })}
                >
                  {mode || "Any"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {activeChips.map((chip) => (
              <FilterChip
                key={chip.key}
                label={chip.label}
                onRemove={() => updateParams({ [chip.key]: "" })}
              />
            ))}
          </div>

          <Button
            className="text-xs font-medium text-default-500 hover:text-foreground h-7 px-2"
            size="sm"
            variant="light"
            onPress={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
