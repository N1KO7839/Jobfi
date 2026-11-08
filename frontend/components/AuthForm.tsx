"use client";

import Form from "next/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Eye, EyeOff } from "lucide-react";

import {
  submitRegisterForm,
  submitLoginForm,
  submitForgotPasswordForm,
} from "@/app/auth/actions";
import { passwordPattern, passwordRequirements } from "@/config/constants";

type AuthFormProps = {
  authType: "login" | "register";
  isLoggedIn?: boolean;
};

const AuthForm = ({ authType, isLoggedIn = false }: AuthFormProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const toastShown = useRef(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoggedIn && !toastShown.current) {
      toastShown.current = true;
      if (authType === "login") {
        addToast({
          title: "Already logged in",
          description: "You need to log out to log in again.",
          color: "warning",
        });
      } else if (authType === "register") {
        addToast({
          title: "Already logged in",
          description: "You need to log out to register new account.",
          color: "warning",
        });
      }
    }
  }, [isLoggedIn, authType]);

  const handleForgotPassword = async (formData: FormData) => {
    const result = await submitForgotPasswordForm(formData);

    if (result.success) {
      addToast({
        title: "Link Sent",
        description: "If an account exists, a reset link was sent.",
        color: "success",
      });
    } else {
      addToast({
        title: "Failed",
        description: result.message || "Something went wrong.",
        color: "danger",
      });
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      if (authType === "register") {
        const result = await submitRegisterForm(formData);

        if (result.success) {
          addToast({
            title: "Registration successful!",
            description: "Please check your email to verify your account.",
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form action={handleSubmit} className="flex flex-col gap-4 w-full">
        <Input
          isRequired
          label="Email"
          name="email"
          placeholder="you@example.com"
          size="sm"
          type="email"
          variant="bordered"
        />

        <div className="flex flex-col w-full gap-1 items-end">
          <Input
            isRequired
            endContent={
              <button
                className="focus:outline-hidden text-default-400 hover:text-default-600 cursor-pointer"
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            label="Password"
            minLength={passwordRequirements.minLength}
            name="password"
            pattern={passwordPattern.source}
            placeholder="••••••••"
            size="sm"
            type={isPasswordVisible ? "text" : "password"}
            variant="bordered"
          />
          {authType === "login" && (
            <button
              className="bg-transparent cursor-pointer hover:underline text-xs text-default-500 font-medium p-0"
              type="button"
              onClick={onOpen}
            >
              Forgot password?
            </button>
          )}
        </div>

        <Button
          className="w-full font-semibold h-10 text-sm mt-2 bg-foreground text-background hover:opacity-90 shadow-xs"
          isDisabled={isLoggedIn}
          isLoading={isSubmitting}
          type="submit"
          variant="solid"
        >
          {authType === "register" ? "Create Account" : "Sign In"}
        </Button>
      </Form>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <Form
              action={async (fd) => {
                await handleForgotPassword(fd);
                onClose();
              }}
            >
              <ModalHeader className="flex flex-col gap-1">
                Reset Password
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-default-500">
                  Enter your email address and we will send you a reset link.
                </p>
                <Input
                  isRequired
                  label="Email"
                  name="email"
                  placeholder="you@example.com"
                  size="sm"
                  type="email"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Send Link
                </Button>
              </ModalFooter>
            </Form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthForm;
