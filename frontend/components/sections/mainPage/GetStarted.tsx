"use client";
import { Button } from "@heroui/button";
import { ArrowRight, CircleDollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

const GetStarted = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start md:items-center bg-purple-400/15 dark:bg-purple-500/15 rounded-xl px-6 sm:px-10 py-10 sm:py-14 mb-20 gap-8 sm:gap-0 text-center sm:text-left">
      <div className="flex flex-col items-center sm:items-start">
        <div className="flex flex-row items-center gap-2">
          <CircleDollarSign
            className=" text-purple-600 dark:text-purple-400"
            size={18}
          />
          <h4 className="text-purple-600 dark:text-purple-400 text-sm font-bold">
            FREE FOREVER
          </h4>
        </div>
        <div className="flex flex-col gap-2 mt-5 ">
          <h2 className="text-3xl font-bold">Stop refreshing job boards</h2>
          <h3 className="text-white/50">
            Set your preferences once. We&apos;ll handle the rest — every
            morning in your inbox.
          </h3>
        </div>
      </div>
      <Button
        color="secondary"
        size="lg"
        onClick={() => router.push("/register")}
      >
        Get started <ArrowRight />
      </Button>
    </div>
  );
};

export default GetStarted;
