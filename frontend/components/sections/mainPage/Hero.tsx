"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

const POPULAR_SEARCHES = [
  { label: "Remote", query: "working_mode=Remote" },
  { label: "Python", query: "search=Python" },
  { label: "React", query: "search=React" },
  { label: "Warszawa", query: "location=Warszawa" },
  { label: "Kraków", query: "location=Kraków" },
  { label: "Wrocław", query: "location=Wrocław" },
  { label: "Senior", query: "search=Senior" },
];

const PLATFORMS = [
  "NoFluffJobs",
  "JustJoin.it",
  "Pracuj.pl",
  "The Protocol",
  "Bulldogjob",
  "Solid.Jobs",
];

export default function Hero() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword.trim()) params.set("search", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    if (minSalary.trim()) params.set("min_salary", minSalary.trim());
    const qs = params.toString();

    router.push(qs ? `/offers?${qs}` : "/offers");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="flex flex-col items-center text-center gap-7 py-10 md:py-16 w-full max-w-4xl mx-auto">
      <div className="flex flex-col items-center gap-3.5 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
          Find your next tech role <br />
          <span className="text-stone-500 dark:text-stone-400">in Poland</span>
        </h1>
        <p className="text-default-500 text-base sm:text-lg max-w-2xl leading-relaxed">
          Aggregated daily from NoFluffJobs, JustJoin.it, Pracuj.pl, The
          Protocol, Bulldogjob, and Solid.Jobs. Transparent salaries included.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-default-200 bg-content1 shadow-sm p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-[1.3] min-w-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-default-100 sm:border-transparent focus-within:border-default-400">
          <Search className="text-default-400 shrink-0" size={17} />
          <input
            className="w-full min-w-0 bg-transparent outline-none text-sm text-foreground placeholder:text-default-400"
            placeholder="Job title or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="hidden sm:block h-7 w-px bg-default-200 shrink-0" />

        <div className="flex-1 min-w-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-default-100 sm:border-transparent focus-within:border-default-400">
          <MapPin className="text-default-400 shrink-0" size={17} />
          <input
            className="w-full min-w-0 bg-transparent outline-none text-sm text-foreground placeholder:text-default-400"
            placeholder="Location (e.g. Warszawa)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="hidden sm:block h-7 w-px bg-default-200 shrink-0" />

        <div className="flex-[0.9] min-w-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-default-100 sm:border-transparent focus-within:border-default-400">
          <span className="text-default-400 text-xs font-semibold shrink-0 uppercase tracking-wider">
            PLN
          </span>
          <input
            className="w-full min-w-0 bg-transparent outline-none text-sm text-foreground placeholder:text-default-400"
            placeholder="Min salary (15000)"
            type="number"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          className="rounded-xl px-7 py-3 bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-xs"
          type="button"
          onClick={handleSearch}
        >
          <Search size={15} />
          <span>Search</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap text-sm">
        <span className="text-default-400 font-medium shrink-0">Popular:</span>
        {POPULAR_SEARCHES.map((item) => (
          <button
            key={item.label}
            className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700/80 text-stone-700 dark:text-stone-100 text-xs font-medium hover:border-stone-400 dark:hover:border-stone-500 hover:text-foreground dark:hover:text-white hover:bg-stone-100/80 dark:hover:bg-stone-800 transition-all bg-content1 dark:bg-stone-800/60 cursor-pointer shadow-2xs"
            type="button"
            onClick={() =>
              router.push(item.query ? `/offers?${item.query}` : "/offers")
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2.5 flex-wrap text-xs text-default-400 pt-2">
        <span className="font-medium text-default-500">Aggregated from:</span>
        {PLATFORMS.map((name, i) => (
          <span key={name} className="flex items-center gap-2.5">
            <span className="text-default-500 hover:text-foreground transition-colors cursor-default">
              {name}
            </span>
            {i < PLATFORMS.length - 1 && (
              <span className="text-default-300 dark:text-default-700">·</span>
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
