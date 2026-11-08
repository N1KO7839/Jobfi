"use client";
import { Input } from "@heroui/input";
import { useState } from "react";
import { addToast } from "@heroui/toast";

import { passwordPattern, passwordRequirements } from "@/config/constants";
import { submitChangePasswordForm } from "@/app/auth/actions";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const result = await submitChangePasswordForm(formData);

      if (result.success) {
        addToast({
          title: "Password changed successfully",
          description: "Your password has been updated.",
          color: "success",
        });
        setCurrentPassword("");
        setNewPassword("");
        setRepeatedPassword("");
      } else {
        addToast({
          title: "Failed to change password",
          description: result.message || "Something went wrong.",
          color: "danger",
        });
      }
    } catch (err: any) {
      addToast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-content1 border border-default-200/80 dark:border-default-800/80 shadow-xs rounded-2xl p-6 sm:p-8 gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-foreground">Change password</h2>
        <p className="text-sm text-default-500">
          Use at least 8 characters. Mix letters, numbers, and symbols.
        </p>
      </div>
      <form action={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-medium ml-1">Current password</h3>
          <Input
            isRequired
            className="opacity-75"
            label="Password"
            minLength={passwordRequirements.minLength}
            name="currentPassword"
            pattern={passwordPattern.source}
            placeholder="********"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-row gap-5">
          <div className="flex flex-col gap-1 w-1/2">
            <h3 className="text-lg font-medium ml-1">New password</h3>
            <Input
              isRequired
              className="opacity-75"
              label="Password"
              minLength={passwordRequirements.minLength}
              name="newPassword"
              pattern={passwordPattern.source}
              placeholder="********"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <h3 className="text-lg font-medium ml-1">Repeat password</h3>
            <Input
              isRequired
              className="opacity-75"
              label="Password"
              minLength={passwordRequirements.minLength}
              name="repeatedPassword"
              pattern={passwordPattern.source}
              placeholder="********"
              type="password"
              value={repeatedPassword}
              onChange={(e) => setRepeatedPassword(e.target.value)}
            />
          </div>
        </div>
        <button
          className="w-fit self-start px-6 py-2.5 bg-foreground text-background hover:opacity-90 text-sm font-semibold rounded-xl transition-opacity disabled:opacity-50 cursor-pointer shadow-xs"
          disabled={loading}
          type="submit"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
