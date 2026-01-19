import Hero from "@/components/sections/Hero";
import Benefits from "@/components/sections/Benefits";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <Hero/>
      <Benefits/> 
    </div>
  );
}
