"use client";
import Form from "next/form";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import Image from "next/image";
import { Suspense } from "react";
import { passwordPattern, passwordRequirements } from "@/config/constants";

import { submitResetPasswordForm } from "@/app/auth/actions";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const handleSubmit = async (formData: FormData) => {
    if (!token) {
      addToast({
        title: "Error",
        description: "Invalid reset link.",
        color: "danger",
      });

      return;
    }

    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (password !== confirm) {
      addToast({
        title: "Error",
        description: "Passwords do not match.",
        color: "danger",
      });

      return;
    }

    const result = await submitResetPasswordForm(formData, token);

    if (result.success) {
      addToast({
        title: "Success",
        description: "Your password has been reset successfully.",
        color: "success",
      });
      router.push("/auth/login");
    } else {
      addToast({
        title: "Failed",
        description: result.message || "Could not reset password.",
        color: "danger",
      });
    }
  };

  if (!token) {
    return (
      <div className="text-danger font-semibold p-4">
        Invalid or missing reset token.
      </div>
    );
  }

  return (
    <Form
      action={handleSubmit}
      className="flex flex-col gap-4 w-full sm:w-3/4 p-2 sm:p-6"
    >
       <Input
         isRequired
         label="New Password"
         minLength={passwordRequirements.minLength}
         name="password"
         pattern={passwordPattern.source}
         placeholder="********"
         type="password"
       />
       <Input
         isRequired
         label="Confirm Password"
         minLength={passwordRequirements.minLength}
         name="confirmPassword"
         pattern={passwordPattern.source}
         placeholder="********"
         type="password"
       />
      <Button color="secondary" type="submit">
        Reset Password
      </Button>
    </Form>
  );
};

const ResetPasswordPage = () => {
  const LOGO_SIZE = 36;

  return (
    <div className="flex flex-col justify-center items-center gap-6 mt-20">
      <div className="flex flex-row justify-center items-center gap-2">
        <Image
          alt="logo"
          height={LOGO_SIZE}
          src="/logo_purple.svg"
          width={LOGO_SIZE}
        />
        <h1 className="text-2xl font-semibold">Jobfi</h1>
      </div>
      <div className="flex flex-col justify-center items-center bg-purple-400/15 dark:bg-slate-800/20 w-11/12 sm:w-[500px] py-16 px-4 sm:px-8 rounded-2xl gap-2 text-center">
        <h2 className="text-xl sm:text-2xl font-bold">Reset Password</h2>
        <h3 className="text-default-500 text-sm sm:text-md font-medium">
          Enter your new password below.
        </h3>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
