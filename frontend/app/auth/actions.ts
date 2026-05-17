"use server";
import wretch from "wretch";

export async function submitRegisterForm(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const result = await wretch(`${baseUrl}/auth/register`)
      .post({ email, password })
      .json();

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

    return { success: true, data: result };
  } catch (err: any) {
    return {
      error: "Failed to login",
      message: err.message || "Unknown error",
      status: err.status,
    };
  }
}
