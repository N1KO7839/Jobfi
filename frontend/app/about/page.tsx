"use client";

import Link from "next/link";
import {
  ArrowRight,
  Layers,
  ShieldCheck,
  RefreshCw,
  Calculator,
} from "lucide-react";

import FAQ from "@/components/sections/about/FAQ";

export default function AboutPage() {
  const steps = [
    {
      step: "01",
      title: "Set Your Preferences",
      description:
        "Define your ideal role: technology stack, minimum salary floor, and remote or hybrid work mode.",
    },
    {
      step: "02",
      title: "Automated Scraping",
      description:
        "Our background engines index 6 Polish job platforms every 30 minutes, deduplicating roles automatically.",
    },
    {
      step: "03",
      title: "Daily Alerts",
      description:
        "Get matching job opportunities delivered straight to your email digest without opening job boards.",
    },
    {
      step: "04",
      title: "Direct Application",
      description:
        "Click directly through to the original posting on NoFluffJobs, JustJoin.it, or Pracuj.pl to submit your resume.",
    },
  ];

  const PLATFORMS = [
    {
      name: "NoFluffJobs",
      focus: "Mandatory Salary Ranges & B2B/UoP Breakdown",
      desc: "Pioneer of salary transparency in Poland. Every listing contains verified min-max ranges.",
    },
    {
      name: "JustJoin.it",
      focus: "Modern Tech Companies & Fast-Growing Startups",
      desc: "The largest tech-specific community job board in Poland with extensive frontend and mobile postings.",
    },
    {
      name: "Pracuj.pl",
      focus: "Enterprise & Established Polish Corporations",
      desc: "Poland's biggest employment site covering enterprise IT, banking systems, and large consulting firms.",
    },
    {
      name: "The Protocol",
      focus: "Fintech, Cloud & High-Seniority Engineering",
      desc: "Curated tech brand by Grupa Pracuj focusing on modern stacks, architecture, and senior positions.",
    },
    {
      name: "Bulldogjob",
      focus: "Developer Community & Software Craftsmanship",
      desc: "Engineering-centric listings featuring in-depth tech stack breakdowns and team descriptions.",
    },
    {
      name: "Solid.Jobs",
      focus: "Radical Transparency & Pure Technical Roles",
      desc: "Clean, no-nonsense board requiring exact pay ranges and technical requirements.",
    },
  ];

  const PRINCIPLES = [
    {
      icon: Layers,
      title: "Intelligent Deduplication",
      desc: "Identifies identical postings across multiple boards and groups them into one clean offer card.",
    },
    {
      icon: Calculator,
      title: "Normalized PLN Salaries",
      desc: "Converts hourly rates, B2B net, and gross UoP into comparable estimated monthly figures.",
    },
    {
      icon: RefreshCw,
      title: "30-Minute Indexing Cycles",
      desc: "Crawlers continuously discover new offers so you never miss an application deadline.",
    },
    {
      icon: ShieldCheck,
      title: "Zero Recruiter Noise",
      desc: "We prioritize listings with clear technical requirements and transparent compensation.",
    },
  ];

  return (
    <div className="flex flex-col gap-12 w-full pb-16">
      <section className="flex flex-col gap-2 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          About Jobfi
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          How Jobfi Works
        </h1>
        <p className="text-base sm:text-lg text-default-500 leading-relaxed">
          Jobfi gathers and standardizes tech job openings across Poland into a
          single interface, so you can compare salaries and stacks without
          jumping between multiple websites.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((item) => (
            <div
              key={item.step}
              className="flex flex-col gap-3 border border-default-200 bg-content1 p-6 rounded-2xl shadow-xs"
            >
              <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400">
                {item.step}
              </span>
              <h3 className="font-semibold text-base text-foreground">
                {item.title}
              </h3>
              <p className="text-default-500 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 pt-6 border-t border-default-200">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Connected Ecosystem
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            The 6 Aggregated Platforms
          </h2>
          <p className="text-default-500 text-sm">
            We continuously harvest listings from the top tech employment
            channels in Poland.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map((plat) => (
            <div
              key={plat.name}
              className="p-5 rounded-2xl bg-content1 border border-default-200 flex flex-col gap-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground text-base">
                  {plat.name}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  Active
                </span>
              </div>
              <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
                {plat.focus}
              </p>
              <p className="text-xs text-default-500 leading-relaxed">
                {plat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 pt-6 border-t border-default-200">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Behind the Scenes
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Core Engineering Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRINCIPLES.map((principle) => {
            const Icon = principle.icon;

            return (
              <div
                key={principle.title}
                className="p-5 rounded-2xl bg-content1 border border-default-200 flex flex-col gap-2.5 shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                  <Icon size={16} />
                </div>
                <h3 className="font-bold text-foreground text-sm">
                  {principle.title}
                </h3>
                <p className="text-xs text-default-500 leading-relaxed">
                  {principle.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="p-6 sm:p-8 rounded-2xl bg-stone-100/70 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            Ready to browse Poland&apos;s tech offers?
          </h3>
          <p className="text-xs sm:text-sm text-default-500">
            Search 250+ active positions across all 6 portals with one query.
          </p>
        </div>
        <Link
          className="px-5 py-2.5 rounded-xl bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 inline-flex items-center gap-1.5 shadow-xs"
          href="/offers"
        >
          <span>Browse All Offers</span>
          <ArrowRight size={15} />
        </Link>
      </section>

      <FAQ />
    </div>
  );
}
