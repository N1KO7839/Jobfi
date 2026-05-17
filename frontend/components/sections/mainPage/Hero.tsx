"use client";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import { subtitle, title } from "@/components/primitives";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-8 md:py-10">
      <div className="inline-block max-w-2xl text-center justify-center">
        <span className={title()}>Discover your next job without &nbsp;</span>
        <span className={title({ color: "violet" })}>spending hours&nbsp;</span>
        <span className={title()}>on</span>
        <br />
        <span className={title()}>searching.</span>
        <div className={subtitle({ class: "mt-4" })}>
          Find opportunities that match your skills
        </div>
      </div>
      <div className="flex flex-row gap-5">
        <Button
          color="secondary"
          size="lg"
          variant="shadow"
          onClick={() => router.push("/register")}
        >
          Create free account
        </Button>
        <Button
          color="default"
          size="lg"
          variant="bordered"
          onClick={() => router.push("/about")}
        >
          Learn more
        </Button>
      </div>
    </section>
  );
}
