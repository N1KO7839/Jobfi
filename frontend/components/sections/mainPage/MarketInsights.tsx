import Link from "next/link";
import { Layers, TrendingUp, Globe2, RefreshCw } from "lucide-react";

const STATS = [
  {
    icon: Layers,
    value: "6 Portals",
    label: "Top Job Boards",
    detail: "NoFluffJobs, JustJoin, Pracuj, The Protocol, Bulldog, Solid",
  },
  {
    icon: TrendingUp,
    value: "100%",
    label: "Salary Transparent",
    detail: "Normalized monthly PLN B2B and UoP compensation",
  },
  {
    icon: Globe2,
    value: "60%+",
    label: "Remote Opportunities",
    detail: "Work from anywhere in Poland or worldwide",
  },
  {
    icon: RefreshCw,
    value: "30 min",
    label: "Fresh Listings",
    detail: "Continuously updated and checked for duplicates",
  },
];

const POPULAR_STACKS = [
  { name: "Python", query: "Python" },
  { name: "TypeScript", query: "TypeScript" },
  { name: "React", query: "React" },
  { name: "Java", query: "Java" },
  { name: "AWS", query: "AWS" },
  { name: "Kubernetes", query: "Kubernetes" },
  { name: "Go", query: "Go" },
  { name: "Node.js", query: "Node.js" },
  { name: "SQL", query: "SQL" },
  { name: "Docker", query: "Docker" },
  { name: ".NET", query: ".NET" },
  { name: "Vue.js", query: "Vue" },
];

export default function MarketInsights() {
  return (
    <section className="py-8 sm:py-12 border-t border-default-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-content1 border border-default-200 flex flex-col justify-between gap-3 shadow-xs hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center text-stone-700 dark:text-stone-300">
                  <Icon size={17} />
                </div>
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">
                  {stat.value}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  {stat.label}
                </h3>
                <p className="text-xs text-default-500 leading-relaxed">
                  {stat.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-stone-100/60 dark:bg-stone-900/30 border border-stone-200/80 dark:border-stone-800/70 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider shrink-0">
          Popular stacks:
        </span>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {POPULAR_STACKS.map((stack) => (
            <Link
              key={stack.name}
              className="px-2.5 py-1 rounded-lg bg-content1 border border-stone-200 dark:border-stone-700/80 hover:border-stone-400 dark:hover:border-stone-500 text-stone-700 dark:text-stone-100 hover:text-foreground dark:hover:text-white dark:bg-stone-800/80 text-xs font-medium transition-all shadow-2xs"
              href={`/offers?search=${stack.query}`}
            >
              {stack.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
