import { Accordion, AccordionItem } from "@heroui/accordion";
import React from "react";

const FAQ = () => {
  return (
    <section className="flex flex-col gap-8 w-full mt-10 mb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
      </div>
      <Accordion
        className="w-full"
        itemClasses={{
          base: "bg-purple-50/50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-800/30 shadow-sm",
          title: "font-semibold",
        }}
        variant="splitted"
      >
        <AccordionItem
          key="1"
          aria-label="What is Jobfi?"
          title="What exactly is Jobfi?"
        >
          <p className="text-default-500 pb-2">
            Jobfi is a smart job aggregator designed to streamline your career
            search. It continuously gathers listings from multiple popular job
            portals and centralizes them in one clean dashboard.
          </p>
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="How to set preferences?"
          title="How can I customize the jobs I see?"
        >
          <p className="text-default-500 pb-2">
            You can easily set your preferences to define what you&apos;re
            looking for (e.g., &quot;Python Developer,&quot; minimum salary,
            remote only).
          </p>
        </AccordionItem>
        <AccordionItem
          key="3"
          aria-label="How scraping works?"
          title="How often do you find new jobs?"
        >
          <p className="text-default-500 pb-2">
            Our background engine utilizes automated scraping to hunt for new
            job offers across the web every single day.
          </p>
        </AccordionItem>
        <AccordionItem
          key="4"
          aria-label="Alerts?"
          title="How will I know when there are new matches?"
        >
          <p className="text-default-500 pb-2">
            You&apos;ll receive perfectly matched job opportunities via our
            Daily Alerts directly through email or mobile notifications.
          </p>
        </AccordionItem>
        <AccordionItem
          key="5"
          aria-label="Browsing matches?"
          title="Is it easy to review my job matches?"
        >
          <p className="text-default-500 pb-2">
            Yes! You can browse with ease and review your recent matches in our
            modern, easy-to-use interface without any of the usual clutter.
          </p>
        </AccordionItem>
      </Accordion>
    </section>
  );
};

export default FAQ;
