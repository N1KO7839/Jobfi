import Link from "next/link";
import {
  Server,
  Layout,
  Cloud,
  Database,
  Smartphone,
  ShieldCheck,
  Building2,
  MapPin,
  Laptop,
} from "lucide-react";

const CATEGORIES = [
  {
    title: "Backend Development",
    description:
      "Distributed architectures, microservices, and high-load APIs.",
    tags: ["Python", "Java", "Go", ".NET", "Node.js"],
    icon: Server,
    href: "/offers?search=Backend",
  },
  {
    title: "Frontend & Web",
    description:
      "Modern component-driven web applications and reactive interfaces.",
    tags: ["React", "TypeScript", "Next.js", "Vue", "Tailwind"],
    icon: Layout,
    href: "/offers?search=Frontend",
  },
  {
    title: "DevOps & Cloud",
    description:
      "Cloud automation, container orchestration, and platform reliability.",
    tags: ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD"],
    icon: Cloud,
    href: "/offers?search=DevOps",
  },
  {
    title: "Data & Machine Learning",
    description:
      "Data pipelines, predictive modeling, and analytics platforms.",
    tags: ["Python", "SQL", "BigQuery", "PyTorch", "Spark"],
    icon: Database,
    href: "/offers?search=Data",
  },
  {
    title: "Mobile Engineering",
    description: "Cross-platform and native applications for iOS and Android.",
    tags: ["React Native", "Flutter", "Swift", "Kotlin", "iOS"],
    icon: Smartphone,
    href: "/offers?search=Mobile",
  },
  {
    title: "QA & Security",
    description:
      "Automated testing pipelines, penetration testing, and security.",
    tags: ["Cypress", "Playwright", "Selenium", "AppSec", "CI"],
    icon: ShieldCheck,
    href: "/offers?search=QA",
  },
];

const HUBS = [
  {
    name: "Warszawa",
    tagline: "Capital Hub · Largest market",
    query: "location=Warszawa",
    icon: Building2,
  },
  {
    name: "Kraków",
    tagline: "R&D Centers & AI teams",
    query: "location=Kraków",
    icon: Building2,
  },
  {
    name: "Wrocław",
    tagline: "Cloud & Embedded Tech",
    query: "location=Wrocław",
    icon: Building2,
  },
  {
    name: "Trójmiasto",
    tagline: "Gdańsk / Gdynia / Sopot",
    query: "location=Gdańsk",
    icon: Building2,
  },
  {
    name: "Poznań",
    tagline: "Fintech & High-growth startups",
    query: "location=Poznań",
    icon: Building2,
  },
  {
    name: "Remote (Polska)",
    tagline: "Work from anywhere",
    query: "working_mode=Remote",
    icon: Laptop,
  },
];

export default function ExploreCategories() {
  return (
    <section className="py-10 md:py-14 border-t border-default-200">
      <div className="flex flex-col gap-1.5 mb-8">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          Explore roles
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Browse by tech specialization
        </h2>
        <p className="text-default-500 text-sm">
          Jump directly into high-demand technologies across the Polish IT
          market.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;

          return (
            <Link
              key={cat.title}
              className="p-5 rounded-2xl bg-content1 border border-default-200 hover:border-stone-400 dark:hover:border-stone-600 transition-all flex flex-col justify-between gap-4 shadow-xs group"
              href={cat.href}
            >
              <div className="flex flex-col gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center text-stone-700 dark:text-stone-300">
                  <Icon size={18} />
                </div>
                <h3 className="font-bold text-foreground text-base group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-default-500 text-xs leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-default-100">
                {cat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[11px] rounded-md bg-stone-100 dark:bg-stone-800/90 text-stone-700 dark:text-stone-100 border border-stone-200/80 dark:border-stone-700/80 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl bg-content1 border border-default-200 p-6 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-default-100">
          <div className="flex items-center gap-2">
            <MapPin className="text-stone-500 dark:text-stone-400" size={17} />
            <h3 className="font-bold text-foreground text-base sm:text-lg">
              Top Polish Tech Hubs
            </h3>
          </div>
          <span className="text-xs text-default-400">
            Compare compensation by location
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {HUBS.map((hub) => {
            const Icon = hub.icon;

            return (
              <Link
                key={hub.name}
                className="p-3.5 rounded-xl border border-default-100 hover:border-stone-400 dark:hover:border-stone-600 bg-default-50/50 hover:bg-stone-100/60 dark:hover:bg-stone-900/40 transition-all flex flex-col gap-1.5 group"
                href={`/offers?${hub.query}`}
              >
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
                  <Icon size={14} />
                  <span className="font-bold text-xs sm:text-sm text-foreground group-hover:text-stone-700 dark:group-hover:text-stone-200">
                    {hub.name}
                  </span>
                </div>
                <span className="text-[11px] text-default-400 truncate">
                  {hub.tagline}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
