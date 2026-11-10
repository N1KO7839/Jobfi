"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";

const FAQ = () => {
  const FAQ_ITEMS = [
    {
      id: "1",
      title: "What exactly is Jobfi?",
      answer:
        "Jobfi is a unified job aggregator designed specifically for the Polish software and tech market. It continuously indexes postings across 6 major Polish portals (NoFluffJobs, JustJoin.it, Pracuj.pl, The Protocol, Bulldogjob, and Solid.Jobs), deduplicates identical roles, standardizes compensation data, and presents them in one fast, clutter-free dashboard.",
    },
    {
      id: "2",
      title: "Which platforms are indexed and how frequently?",
      answer:
        "We currently index 6 Polish IT boards: NoFluffJobs, JustJoin.it, Pracuj.pl, The Protocol, Bulldogjob, and Solid.Jobs. Our background workers crawl each platform on a 30-minute schedule to ensure newly posted listings appear quickly without delay.",
    },
    {
      id: "3",
      title: "How is compensation normalized between B2B and UoP?",
      answer:
        "Polish tech offers often mix hourly rates, net B2B contracts, and gross UoP employment contracts. Jobfi standardizes all amounts to estimated monthly figures in PLN so you can compare roles fairly at a glance. We also allow you to set minimum monthly salary filters to immediately eliminate underpaying roles.",
    },
    {
      id: "4",
      title: "How does Jobfi prevent duplicate job listings?",
      answer:
        "Many companies cross-post identical openings to 3 or 4 job boards simultaneously. Jobfi's deduplication engine matches company names, job titles, and location metadata to group duplicates into a single canonical offer, preserving links to all original sources.",
    },
    {
      id: "5",
      title: "How do the daily email notifications work?",
      answer:
        "When you create a free account, you can configure your notification preferences (preferred stack, minimum monthly salary, and work mode such as Remote or Hybrid). Every morning, our system compiles a digest of only newly published positions matching your criteria and delivers it to your inbox.",
    },
    {
      id: "6",
      title: "Is Jobfi completely free for developers?",
      answer:
        "Yes, Jobfi is 100% free for software engineers and candidates. We do not sell priority ranking, display intrusive third-party ads, or lock transparent salary data behind paywalls.",
    },
  ];

  return (
    <section className="flex flex-col gap-6 w-full my-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          Answers & Information
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-default-500 text-sm">
          Everything you need to know about our data sources, indexing, and
          alerts.
        </p>
      </div>

      <Accordion
        className="w-full px-0"
        itemClasses={{
          base: "bg-content1 border border-default-200 shadow-2xs rounded-2xl mb-3 px-2",
          title: "font-semibold text-sm sm:text-base text-foreground",
          content: "text-xs sm:text-sm text-default-500 pb-4 leading-relaxed",
        }}
        variant="splitted"
      >
        {FAQ_ITEMS.map((item) => (
          <AccordionItem
            key={item.id}
            aria-label={item.title}
            title={item.title}
          >
            {item.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
