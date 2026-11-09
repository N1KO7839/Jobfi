import Hero from "@/components/sections/mainPage/Hero";
import MarketInsights from "@/components/sections/mainPage/MarketInsights";
import FeaturedOffers from "@/components/sections/mainPage/FeaturedOffers";
import ExploreCategories from "@/components/sections/mainPage/ExploreCategories";
import PlatformComparison from "@/components/sections/mainPage/PlatformComparison";
import Benefits from "@/components/sections/mainPage/Benefits";
import GetStarted from "@/components/sections/mainPage/GetStarted";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 sm:gap-10 pb-10">
      <Hero />
      <MarketInsights />
      <FeaturedOffers />
      <ExploreCategories />
      <PlatformComparison />
      <Benefits />
      <GetStarted />
    </div>
  );
}
