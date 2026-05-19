"use client";
import Form from "next/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";

import { submitRegisterForm, submitLoginForm } from "@/app/auth/actions";

type AuthFormProps = {
  authType: "login" | "register";
};

const AuthForm = ({ authType }: AuthFormProps) => {
  const handleSubmit = async (formData: FormData) => {
    if (authType == "register") {
      const result = await submitRegisterForm(formData);

      if (result.success) {
        addToast({
          title: "Registration successful!",
          description: "You have successfully created an account.",
          color: "success",
        });
      } else {
        addToast({
          title: "Registration failed",
          description: result.message || "Something went wrong.",
          color: "danger",
        });
      }
    } else {
      const result = await submitLoginForm(formData);

      if (result.success) {
        addToast({
          title: "Login successful!",
          description: "You have successfully logged in.",
          color: "success",
        });
      } else {
        addToast({
          title: "Login failed",
          description: result.message || "Something went wrong.",
          color: "danger",
        });
      }
    }
  };

  return (
    <Form action={handleSubmit} className="flex flex-col gap-4 w-full sm:w-3/4 p-2 sm:p-6">
      <Input
        isRequired
        label="Email"
        name="email"
        placeholder="Enter your email"
        type="email"
      />

      <Input
        isRequired
        label="Password"
        minLength={8}
        name="password"
        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,16}$"
        placeholder="********"
        type="password"
      />
      {authType == "register" ? (
        <Button color="secondary" type="submit">
          Register
        </Button>
      ) : (
        <Button color="secondary" type="submit">
          Login
        </Button>
      )}
    </Form>
  );
};

export default AuthForm;
