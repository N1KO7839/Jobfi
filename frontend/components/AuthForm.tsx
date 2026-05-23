"use client";
import Form from "next/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

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
    if (authType == "register") {
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
  };

  return (
    <>
      <Form
        action={handleSubmit}
        className="flex flex-col gap-4 w-full sm:w-3/4 p-2 sm:p-6"
      >
        <Input
          isRequired
          label="Email"
          name="email"
          placeholder="Enter your email"
          type="email"
        />

        <div className="flex flex-col w-full gap-1 items-end">
          <Input
            isRequired
            label="Password"
            minLength={passwordRequirements.minLength}
            name="password"
            pattern={passwordPattern.source}
            placeholder="********"
            type="password"
          />
          {authType === "login" && (
            <button
              className="bg-transparent cursor-pointer hover:underline text-xs text-purple-500 p-0"
              type="button"
              onClick={onOpen}
            >
              Forgot password?
            </button>
          )}
        </div>
        {authType == "register" ? (
          <Button color="secondary" isDisabled={isLoggedIn} type="submit">
            Register
          </Button>
        ) : (
          <Button color="secondary" isDisabled={isLoggedIn} type="submit">
            Login
          </Button>
        )}
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
                <p className="text-sm text-gray-500">
                  Enter your email address and we will send you a link to reset
                  your password.
                </p>
                <Input
                  isRequired
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="secondary" type="submit">
                  Send Reset Link
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
