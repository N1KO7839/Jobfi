"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";

interface OffersFilterProps {
  locations: string[];
}

const WORKING_MODES = ["Remote", "Hybrid", "Office", "Unknown"];

const PLATFORMS = [
  { value: "", label: "All Platforms" },
  { value: "NoFluffJobs", label: "NoFluffJobs" },
  { value: "JustJoinIT", label: "JustJoin.it" },
  { value: "Pracuj.pl", label: "Pracuj.pl" },
  { value: "The Protocol", label: "The Protocol" },
  { value: "Bulldogjob", label: "Bulldogjob" },
  { value: "Solid.Jobs", label: "Solid.Jobs" },
];

const SORT_OPTIONS = [
  { value: "date_desc", label: "Date (Newest)" },
  { value: "date_asc", label: "Date (Oldest)" },
  { value: "payment_desc", label: "Salary (High to Low)" },
  { value: "payment_asc", label: "Salary (Low to High)" },
];

export default function OffersFilter({ locations }: OffersFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minSalary, setMinSalary] = useState(
    searchParams.get("min_salary") || "",
  );
  const [maxSalary, setMaxSalary] = useState(
    searchParams.get("max_salary") || "",
  );
  const [workingMode, setWorkingMode] = useState(
    searchParams.get("working_mode") || "",
  );
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [source, setSource] = useState(searchParams.get("source") || "");
  const [sortType, setSortType] = useState(
    searchParams.get("sort_type") || "date_desc",
  );
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(minSalary || maxSalary || workingMode || location),
  );

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setMinSalary(searchParams.get("min_salary") || "");
    setMaxSalary(searchParams.get("max_salary") || "");
    setWorkingMode(searchParams.get("working_mode") || "");
    setLocation(searchParams.get("location") || "");
    setSource(searchParams.get("source") || "");
    setSortType(searchParams.get("sort_type") || "date_desc");
  }, [searchParams]);

  const updateUrlWithParams = (newParams: {
    [key: string]: string | undefined;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    Object.entries(newParams).forEach(([key, val]) => {
      if (val && val.trim() !== "") {
        params.set(key, val.trim());
      } else {
        params.delete(key);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePlatformClick = (platformVal: string) => {
    setSource(platformVal);
    updateUrlWithParams({
      search,
      source: platformVal,
      min_salary: minSalary,
      max_salary: maxSalary,
      working_mode: workingMode,
      location,
      sort_type: sortType,
    });
  };

  const applyFilters = () => {
    updateUrlWithParams({
      search,
      source,
      min_salary: minSalary,
      max_salary: maxSalary,
      working_mode: workingMode,
      location,
      sort_type: sortType,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setMinSalary("");
    setMaxSalary("");
    setWorkingMode("");
    setLocation("");
    setSource("");
    setSortType("date_desc");

    const params = new URLSearchParams();

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = Boolean(
    search || minSalary || maxSalary || workingMode || location || source,
  );

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-content1 border border-default-200 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-xl bg-default-100/60 dark:bg-default-50/40 border border-default-200">
        <div className="flex-1 min-w-0 flex items-center gap-2.5 px-3 py-2">
          <Search className="text-default-400 shrink-0" size={18} />
          <input
            className="w-full min-w-0 bg-transparent outline-none text-sm text-foreground placeholder:text-default-400"
            placeholder="Search by job title, technology, or company (e.g. Python, React, TeamQuest)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters();
            }}
          />
          {search && (
            <button
              className="text-default-400 hover:text-foreground p-1 shrink-0 cursor-pointer"
              type="button"
              onClick={() => {
                setSearch("");
                updateUrlWithParams({ search: "" });
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            className="text-xs font-medium text-default-600 dark:text-default-400 hover:text-foreground h-9 px-3 rounded-lg"
            startContent={<SlidersHorizontal size={14} />}
            variant="light"
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            Filters
          </Button>

          <Button
            className="bg-foreground text-background font-semibold text-xs h-9 px-5 rounded-lg shrink-0 hover:opacity-90 transition-opacity"
            size="sm"
            variant="solid"
            onPress={applyFilters}
          >
            Search
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-default-100">
        {PLATFORMS.map((p) => {
          const isActive = source === p.value;

          return (
            <button
              key={p.value}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 cursor-pointer font-medium ${
                isActive
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "hover:bg-default-100 text-default-600 dark:text-default-400 hover:text-foreground"
              }`}
              type="button"
              onClick={() => handlePlatformClick(p.value)}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          <Autocomplete
            allowsCustomValue
            className="w-full"
            defaultItems={locations.map((city) => ({
              value: city,
              label: city,
            }))}
            inputValue={location}
            label="Location"
            placeholder="e.g. Warszawa"
            selectedKey={locations.includes(location) ? location : null}
            size="sm"
            variant="bordered"
            onInputChange={(val) => setLocation(val)}
            onSelectionChange={(key) => {
              if (key) setLocation(key as string);
            }}
          >
            {(item) => (
              <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
            )}
          </Autocomplete>

          <Input
            className="w-full"
            label="Min Salary (PLN)"
            placeholder="e.g. 15000"
            size="sm"
            type="number"
            value={minSalary}
            variant="bordered"
            onValueChange={setMinSalary}
          />

          <Input
            className="w-full"
            label="Max Salary (PLN)"
            placeholder="e.g. 30000"
            size="sm"
            type="number"
            value={maxSalary}
            variant="bordered"
            onValueChange={setMaxSalary}
          />

          <Select
            className="w-full"
            label="Work Mode"
            placeholder="All modes"
            selectedKeys={workingMode ? [workingMode] : []}
            size="sm"
            variant="bordered"
            onChange={(e) => setWorkingMode(e.target.value)}
          >
            {WORKING_MODES.map((mode) => (
              <SelectItem key={mode}>{mode}</SelectItem>
            ))}
          </Select>

          <Select
            className="w-full"
            label="Sort By"
            placeholder="Sort offers"
            selectedKeys={[sortType]}
            size="sm"
            variant="bordered"
            onChange={(e) => setSortType(e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>
      )}

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-default-400 font-medium">Active:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 font-medium shadow-2xs">
                Keyword: &ldquo;{search}&rdquo;
                <button
                  className="p-0.5 rounded text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
                  type="button"
                  onClick={() => {
                    setSearch("");
                    updateUrlWithParams({ search: "" });
                  }}
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {source && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 font-medium shadow-2xs">
                Platform: {source}
                <button
                  className="p-0.5 rounded text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
                  type="button"
                  onClick={() => {
                    setSource("");
                    updateUrlWithParams({ source: "" });
                  }}
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 font-medium shadow-2xs">
                City: {location}
                <button
                  className="p-0.5 rounded text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
                  type="button"
                  onClick={() => {
                    setLocation("");
                    updateUrlWithParams({ location: "" });
                  }}
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {workingMode && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 font-medium shadow-2xs">
                Mode: {workingMode}
                <button
                  className="p-0.5 rounded text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
                  type="button"
                  onClick={() => {
                    setWorkingMode("");
                    updateUrlWithParams({ working_mode: "" });
                  }}
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {minSalary && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 font-medium shadow-2xs">
                Min: {minSalary} PLN
                <button
                  className="p-0.5 rounded text-stone-400 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
                  type="button"
                  onClick={() => {
                    setMinSalary("");
                    updateUrlWithParams({ min_salary: "" });
                  }}
                >
                  <X size={12} />
                </button>
              </span>
            )}
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
