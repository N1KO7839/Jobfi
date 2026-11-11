import React from "react";
import Link from "next/link";
import { MapPin, Briefcase, Clock, ArrowUpRight } from "lucide-react";

import { JobOffer } from "@/types/offers";

interface OfferCardProps {
  offer: JobOffer;
}

interface PlatformStyle {
  name: string;
  badgeClass: string;
}

function getPlatformStyle(offer: JobOffer): PlatformStyle {
  const raw = (offer.source || "").toLowerCase();
  const url = (offer.url || "").toLowerCase();

  if (raw.includes("justjoin") || url.includes("justjoin.it")) {
    return {
      name: "JustJoin.it",
      badgeClass:
        "bg-rose-500/10 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300 border border-rose-500/25",
    };
  }
  if (raw.includes("pracuj") || url.includes("pracuj.pl")) {
    return {
      name: "Pracuj.pl",
      badgeClass:
        "bg-sky-500/10 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300 border border-sky-500/25",
    };
  }
  if (raw.includes("nofluff") || url.includes("nofluffjobs.com")) {
    return {
      name: "NoFluffJobs",
      badgeClass:
        "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 border border-emerald-500/25",
    };
  }
  if (raw.includes("protocol") || url.includes("theprotocol.it")) {
    return {
      name: "The Protocol",
      badgeClass:
        "bg-purple-500/10 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 border border-purple-500/25",
    };
  }
  if (raw.includes("bulldog") || url.includes("bulldogjob.pl")) {
    return {
      name: "Bulldogjob",
      badgeClass:
        "bg-amber-500/10 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-500/25",
    };
  }
  if (raw.includes("solid") || url.includes("solid.jobs")) {
    return {
      name: "Solid.Jobs",
      badgeClass:
        "bg-teal-500/10 text-teal-800 dark:bg-teal-500/15 dark:text-teal-300 border border-teal-500/25",
    };
  }

  return {
    name:
      offer.source && offer.source !== "Unknown" ? offer.source : "Job Board",
    badgeClass:
      "bg-stone-100 text-stone-700 dark:bg-stone-800/90 dark:text-stone-300 border border-stone-200 dark:border-stone-700",
  };
}

const AVATAR_COLORS = [
  "bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200",
  "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
  "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  "bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
  "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
];

function getAvatarColor(company: string): string {
  const sum = company.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function getInitials(company: string): string {
  const words = company
    .replace(/\b(sp\.?\s*z\.?\s*o\.?\s*o\.?|s\.a\.)/gi, "")
    .split(/[\s\-.]+/)
    .filter(Boolean);

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return (words[0][0] + words[1][0]).toUpperCase();
}

function CompanyAvatar({ company }: { company: string }) {
  return (
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm tracking-tight shrink-0 border border-stone-300 dark:border-stone-700/80 ${getAvatarColor(company)}`}
    >
      {getInitials(company)}
    </div>
  );
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const platform = getPlatformStyle(offer);

  const techStackList = offer.tech_stack
    ? offer.tech_stack
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];
  const displayTags = techStackList.slice(0, 5);
  const remainingCount = techStackList.length - displayTags.length;

  const formattedSalary = (() => {
    if (!offer.salary || offer.salary === "null" || offer.salary === "0") {
      return null;
    }
    const num = Number(offer.salary);
    const displayNum = !isNaN(num) ? num.toLocaleString("pl-PL") : offer.salary;
    const period =
      {
        hourly: " / hr",
        daily: " / day",
        monthly: " / mo",
      }[offer.salary_period] ?? "";

    return `${displayNum} ${offer.currency || "PLN"}${period}`;
  })();

  const dateLabel = (() => {
    const d = new Date(offer.created_datetime);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1d ago";
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
  })();

  return (
    <Link
      className="group relative flex flex-col justify-between h-full bg-content1 hover:bg-default-50/80 dark:bg-content1 dark:hover:bg-content2/80 border border-default-200 hover:border-stone-400 dark:hover:border-stone-500 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-xs hover:shadow-md"
      href={offer.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex flex-col gap-3.5">
        <div className="flex items-start gap-3.5">
          <CompanyAvatar company={offer.company} />
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 truncate">
                {offer.company}
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${platform.badgeClass}`}
              >
                {platform.name}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-stone-900 dark:group-hover:text-white transition-colors leading-snug line-clamp-2">
              {offer.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm text-default-500 flex-wrap">
          {offer.location && offer.location !== offer.working_mode && (
            <span className="inline-flex items-center gap-1.5 font-medium text-stone-600 dark:text-stone-300">
              <MapPin
                className="text-stone-400 dark:text-stone-500 shrink-0"
                size={13}
              />
              <span>{offer.location}</span>
            </span>
          )}
          {offer.working_mode && offer.working_mode !== "Unknown" && (
            <span className="inline-flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-medium">
              <Briefcase
                className="text-stone-400 dark:text-stone-500 shrink-0"
                size={13}
              />
              <span>{offer.working_mode}</span>
            </span>
          )}
        </div>

        {formattedSalary ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-mono font-semibold text-xs sm:text-sm w-fit border border-emerald-500/25 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>{formattedSalary}</span>
          </div>
        ) : (
          <div className="text-xs text-stone-400 dark:text-stone-500 font-medium italic">
            Salary undisclosed
          </div>
        )}

        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {displayTags.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 text-stone-800 dark:bg-stone-800/90 dark:text-stone-100 border border-stone-200/90 dark:border-stone-700/80 transition-colors shadow-2xs"
              >
                {tech}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="px-2 py-1 text-xs font-semibold text-stone-500 dark:text-stone-300 bg-stone-100/60 dark:bg-stone-800/50 rounded-lg border border-dashed border-stone-300 dark:border-stone-700">
                +{remainingCount} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-3.5 mt-4 border-t border-default-100/90 flex items-center justify-between text-xs text-default-400">
        <div className="flex items-center gap-1.5">
          <Clock className="text-stone-400 dark:text-stone-500" size={12} />
          <span className="font-medium text-stone-500 dark:text-stone-400">
            {dateLabel}
          </span>
        </div>
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-150 text-foreground dark:text-stone-100 font-semibold flex items-center gap-1 transform translate-x-1 group-hover:translate-x-0">
          <span>Apply on {platform.name}</span>
          <ArrowUpRight className="shrink-0" size={14} />
        </span>
      </div>
    </Link>
  );
};
