"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import wretch from "wretch";

async function setTokenCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60,
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 14 * 24 * 60 * 60,
  });
}

export async function submitRegisterForm(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const result = await wretch(`${baseUrl}/auth/register`)
      .post({ email, password })
      .json();

    const { access_token, refresh_token } = result as {
      access_token: string;
      refresh_token: string;
    };

    await setTokenCookies(access_token, refresh_token);

    return { success: true, data: result };
  } catch (err: any) {
    return {
      error: "Failed to create user",
      message: err.message || "Unknown error",
      status: err.status,
    };
  }
}

export async function submitLoginForm(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const result = await wretch(`${baseUrl}/auth/login`)
      .post({ email, password })
      .json();

    const { access_token, refresh_token } = result as {
      access_token: string;
      refresh_token: string;
    };

    await setTokenCookies(access_token, refresh_token);

    return { success: true, data: result };
  } catch (err: any) {
    return {
      error: "Failed to login",
      message: err.message || "Unknown error",
      status: err.status,
    };
  }
}

export async function Logout() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
