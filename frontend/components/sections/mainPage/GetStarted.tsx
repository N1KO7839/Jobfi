"use client";

import { Button } from "@heroui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GetStarted() {
  const router = useRouter();

  return (
    <section className="my-10 sm:my-16 max-w-4xl mx-auto w-full">
      <div className="rounded-2xl bg-content1 border border-default-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex flex-col gap-1.5 max-w-xl">
          <span className="text-xs font-semibold text-default-400 uppercase tracking-wider">
            Daily Alerts
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Configure your job match notifications
          </h2>
          <p className="text-default-500 text-sm leading-relaxed">
            Specify your salary floor, work mode, and seniority once. Jobfi
            scans all 6 boards every 30 minutes and dispatches daily digests.
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <Button
            className="w-full md:w-auto font-semibold text-sm bg-foreground text-background hover:opacity-90 px-6 h-10 shadow-xs"
            endContent={<ArrowRight size={15} />}
            size="md"
            variant="solid"
            onClick={() => router.push("/auth/register")}
          >
            Create Free Account
          </Button>
        </div>
      </div>
    </section>
  );
}
