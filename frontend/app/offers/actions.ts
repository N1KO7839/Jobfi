"use server";

import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";

import { JobResponse } from "@/types/offers";

export async function fetchOffers(
  page = 1,
  size = 8,
  sort_type: string = "date_desc",
): Promise<
  | { success: true; data: JobResponse }
  | { success: false; error: string; message: string; status?: number }
> {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const api = wretch(baseUrl).addon(QueryStringAddon);

  try {
    const result = await api
      .url("/offers")
      .query({
        page: String(page),
        size: String(size),
        sort_type,
      })
      .get()
      .json<JobResponse>();

    return { success: true, data: result };
  } catch (err: any) {
    return {
      success: false,
      error: "Failed to fetch offers",
      message: err?.message || "Unknown error",
      status: err?.status,
    };
  }
}
