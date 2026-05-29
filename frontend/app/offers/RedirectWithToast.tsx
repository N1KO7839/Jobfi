"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";

export default function RedirectWithToast() {
  const router = useRouter();

  useEffect(() => {
    addToast({
      title: "Can't return offers",
      description: "You need to be logged in to see offers.",
      color: "warning",
    });
    router.push("/auth/login");
  }, [router]);

  return null;
}
