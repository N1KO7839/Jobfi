"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";

interface OffersFilterProps {
  locations: string[];
}

const WORKING_MODES = ["Remote", "Hybrid", "Office", "Unknown"];

const SORT_OPTIONS = [
  { value: "date_desc", label: "Date (Newest first)" },
  { value: "date_asc", label: "Date (Oldest first)" },
  { value: "payment_desc", label: "Salary (High to Low)" },
  { value: "payment_asc", label: "Salary (Low to High)" },
];

export default function OffersFilter({ locations }: OffersFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
  const [sortType, setSortType] = useState(
    searchParams.get("sort_type") || "date_desc",
  );

  useEffect(() => {
    setMinSalary(searchParams.get("min_salary") || "");
    setMaxSalary(searchParams.get("max_salary") || "");
    setWorkingMode(searchParams.get("working_mode") || "");
    setLocation(searchParams.get("location") || "");
    setSortType(searchParams.get("sort_type") || "date_desc");
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (minSalary) params.set("min_salary", minSalary);
    else params.delete("min_salary");

    if (maxSalary) params.set("max_salary", maxSalary);
    else params.delete("max_salary");

    if (workingMode) params.set("working_mode", workingMode);
    else params.delete("working_mode");

    if (location) params.set("location", location);
    else params.delete("location");

    if (sortType) params.set("sort_type", sortType);
    else params.delete("sort_type");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-500/10 border border-white/5 mb-2">
      <Autocomplete
        allowsCustomValue
        className="w-full lg:w-48"
        defaultItems={locations.map((city) => ({ value: city, label: city }))}
        inputValue={location}
        label="Location"
        placeholder="e.g. Warszawa"
        selectedKey={locations.includes(location) ? location : null}
        size="sm"
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
        className="w-full lg:w-32"
        label="Min Salary"
        placeholder="Min PLN"
        size="sm"
        type="number"
        value={minSalary}
        onValueChange={setMinSalary}
      />

      <Input
        className="w-full lg:w-32"
        label="Max Salary"
        placeholder="Max PLN"
        size="sm"
        type="number"
        value={maxSalary}
        onValueChange={setMaxSalary}
      />

      <Select
        className="w-full lg:w-40"
        label="Work Type"
        placeholder="Select mode"
        selectedKeys={workingMode ? [workingMode] : []}
        size="sm"
        onChange={(e) => setWorkingMode(e.target.value)}
      >
        {WORKING_MODES.map((mode) => (
          <SelectItem key={mode}>{mode}</SelectItem>
        ))}
      </Select>

      <Select
        className="w-full lg:w-48"
        label="Sort By"
        placeholder="Sort offers"
        selectedKeys={[sortType]}
        size="sm"
        onChange={(e) => setSortType(e.target.value)}
      >
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value}>{option.label}</SelectItem>
        ))}
      </Select>

      <div className="flex w-full lg:w-auto gap-2 lg:ml-auto h-[48px] items-center">
        <Button
          className="flex-1 lg:flex-none bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
          variant="flat"
          onPress={clearFilters}
        >
          Clear
        </Button>
        <Button
          className="flex-1 lg:flex-none bg-[#2A1D45] text-[#D0B5FA] hover:bg-[#3b2961]"
          onPress={applyFilters}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
