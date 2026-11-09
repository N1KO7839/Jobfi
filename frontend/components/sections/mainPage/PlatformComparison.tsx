import { Check, X, ShieldCheck } from "lucide-react";

export default function PlatformComparison() {
  const PAIN_POINTS = [
    "Checking 6 different websites manually every morning",
    "Duplicate listings with varying job titles and company names",
    "Inconsistent salary rates (hourly net vs gross B2B vs UoP)",
    "Non-technical sponsored advertisements cluttering results",
    "Having to create accounts on every portal to set basic filters",
  ];

  const JOBFI_ADVANTAGES = [
    "One unified chronological feed aggregated across all 6 boards",
    "Automatic deduplication matching employer, title, and location",
    "Normalized monthly PLN compensation for transparent comparisons",
    "No sponsored clutter, only verified tech positions",
    "Single email digest tailored to your exact tech stack & salary floor",
  ];

  return (
    <section className="py-12 sm:py-16 border-t border-default-200">
      <div className="flex flex-col items-center text-center gap-2 mb-10 max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          Why Jobfi
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Stop hopping between 6 different job portals
        </h2>
        <p className="text-default-500 text-sm max-w-lg">
          We do the heavy lifting of gathering, cleaning, and indexing Polish
          tech openings so you can focus on finding your next role.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-content1/60 border border-default-200 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-default-100">
            <div className="w-7 h-7 rounded-lg bg-default-100 flex items-center justify-center text-default-500">
              <X size={15} />
            </div>
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Traditional Job Hunting
            </h3>
          </div>
          <ul className="flex flex-col gap-3">
            {PAIN_POINTS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-xs text-default-500 leading-relaxed"
              >
                <X className="text-default-400 shrink-0 mt-0.5" size={14} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-content1 border border-stone-300 dark:border-stone-700 flex flex-col gap-4 shadow-xs relative">
          <div className="flex items-center justify-between pb-2 border-b border-default-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-700 dark:text-stone-300">
                <Check size={15} />
              </div>
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                The Jobfi Way
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
              <ShieldCheck size={12} />
              <span>Deduplicated</span>
            </span>
          </div>
          <ul className="flex flex-col gap-3">
            {JOBFI_ADVANTAGES.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-xs text-foreground font-medium leading-relaxed"
              >
                <Check
                  className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                  size={14}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
