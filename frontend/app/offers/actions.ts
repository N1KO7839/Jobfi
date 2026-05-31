"use server";

import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";

import { JobResponse } from "@/types/offers";

export async function fetchLocations(): Promise<string[]> {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const api = wretch(baseUrl);

  try {
    const result = await api.url("/offers/locations").get().json<string[]>();

    return result;
  } catch (err: any) {
    return [];
  }
}

export async function fetchOffers(
  page = 1,
  size = 8,
  sort_type: string = "date_desc",
  min_salary?: string,
  max_salary?: string,
  working_mode?: string,
  location?: string,
): Promise<
  | { success: true; data: JobResponse }
  | { success: false; error: string; message: string; status?: number }
> {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const api = wretch(baseUrl).addon(QueryStringAddon);

  try {
    const queryParams: Record<string, string> = {
      page: String(page),
      size: String(size),
      sort_type,
    };

    if (min_salary) queryParams.min_salary = min_salary;
    if (max_salary) queryParams.max_salary = max_salary;
    if (working_mode) queryParams.working_mode = working_mode;
    if (location) queryParams.location = location;

    const result = await api
      .url("/offers")
      .query(queryParams)
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
