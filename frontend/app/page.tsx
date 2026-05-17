import Hero from "@/components/sections/mainPage/Hero";
import Benefits from "@/components/sections/mainPage/Benefits";
import GetStarted from "@/components/sections/mainPage/GetStarted";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <Hero />
      <Benefits />
      <GetStarted />
    </div>
  );
}
