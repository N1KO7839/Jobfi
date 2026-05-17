"use client";
import { Settings, Search, Mail, LayoutDashboard } from "lucide-react";

import FAQ from "@/components/sections/about/FAQ";

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 max-w-7xl mx-auto px-6">
      <section className="flex flex-col gap-8 pb-10">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-bold text-center">How it works</h2>
          <h4 className="text-lg text-center dark:text-white/40 max-w-2xl mx-auto">
            Our background engine does the heavy lifting so you don&apos;t have
            to.
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
          <div className="flex flex-col gap-4 border border-default-200 bg-background p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-secondary/10 w-max rounded-lg">
              <Settings className="text-secondary" size={24} />
            </div>
            <h4 className="font-bold text-xl">1. Set Your Preferences</h4>
            <p className="text-default-500 text-sm">
              Define what you&apos;re looking for (e.g., &quot;Python
              Developer,&quot; minimum salary, remote only).
            </p>
          </div>
          <div className="flex flex-col gap-4 border border-default-200 bg-background p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-secondary/10 w-max rounded-lg">
              <Search className="text-secondary" size={24} />
            </div>
            <h4 className="font-bold text-xl">2. Automated Scraping</h4>
            <p className="text-default-500 text-sm">
              Our background engine hunts for new job offers across the web
              every single day.
            </p>
          </div>
          <div className="flex flex-col gap-4 border border-default-200 bg-background p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-secondary/10 w-max rounded-lg">
              <Mail className="text-secondary" size={24} />
            </div>
            <h4 className="font-bold text-xl">3. Daily Alerts</h4>
            <p className="text-default-500 text-sm">
              Receive perfectly matched job opportunities directly via email or
              mobile notifications.
            </p>
          </div>
          <div className="flex flex-col gap-4 border border-default-200 bg-background p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-secondary/10 w-max rounded-lg">
              <LayoutDashboard className="text-secondary" size={24} />
            </div>
            <h4 className="font-bold text-xl">4. Browse with Ease</h4>
            <p className="text-default-500 text-sm">
              Review your recent matches in a modern, easy-to-use interface
              without the clutter.
            </p>
          </div>
        </div>
      </section>
      <FAQ />
    </div>
  );
}
