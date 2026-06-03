"use server";
import { cookies } from "next/headers";
import wretch from "wretch";

export interface UserPreferences {
  notification_frequency?: string;
  min_preferred_salary?: number | null;
  preferred_currency?: string;
  preferred_location?: string;
  preferred_working_mode?: string;
  [key: string]: any;
}

export async function fetchPreferences() {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const result = await wretch(`${baseUrl}/preferences/`)
      .auth(`Bearer ${token}`)
      .get()
      .json<UserPreferences>();

    return { success: true, data: result };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to fetch preferences",
    };
  }
}

export async function updatePreferences(data: UserPreferences) {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const result = await wretch(`${baseUrl}/preferences/`)
      .auth(`Bearer ${token}`)
      .put(data)
      .json<UserPreferences>();

    return { success: true, data: result };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to update preferences",
    };
  }
}
