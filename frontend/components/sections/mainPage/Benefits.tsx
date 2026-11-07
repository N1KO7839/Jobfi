import { Layers, Calculator, Filter, Bell } from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "6 job boards, one unified feed",
    description:
      "NoFluffJobs, JustJoin.it, Pracuj.pl, The Protocol, Bulldogjob, and Solid.Jobs are scanned, normalized, and deduplicated automatically every 30 minutes.",
  },
  {
    icon: Calculator,
    title: "Transparent, comparable compensation",
    description:
      "Positions without salary data are deprioritized. B2B net and UoP employment contracts are formatted consistently so you can evaluate offers objectively.",
  },
  {
    icon: Filter,
    title: "Deep tech stack filtering",
    description:
      "Languages, frameworks, databases, and DevOps tools are indexed directly from each offer text, letting you search by your precise technology arsenal.",
  },
  {
    icon: Bell,
    title: "Curated daily email digest",
    description:
      "Save your minimum compensation threshold and work mode once. Receive a clean morning digest with only new listings, no spam or reposted roles.",
  },
];

export default function Benefits() {
  return (
    <section
      className="py-14 md:py-20 border-t border-default-200"
      id="features"
    >
      <div className="flex flex-col items-center text-center gap-2 mb-12 max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          Why Jobfi
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Built for how developers actually search
        </h2>
        <p className="text-default-500 text-sm mt-1 max-w-lg">
          No sponsored banner ads, no duplicate listings, and no paywalls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-content1 border border-default-200 flex flex-col gap-3 shadow-xs hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-900/70 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center text-stone-700 dark:text-stone-300 shrink-0">
                  <Icon size={16} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-stone-400">
                    0{i + 1}
                  </span>
                  <h3 className="font-bold text-foreground text-base">
                    {feature.title}
                  </h3>
                </div>
              </div>
              <p className="text-default-500 text-sm leading-relaxed pl-11">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
