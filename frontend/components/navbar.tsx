"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useState, useEffect } from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logout, checkAuthStatus } from "@/app/auth/actions";

export const Navbar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const hasClientFlag =
      typeof document !== "undefined" &&
      document.cookie.includes("is_logged_in=true");

    if (hasClientFlag) {
      setIsLoggedIn(true);
    }

    checkAuthStatus()
      .then((hasAuth) => {
        if (isMounted) {
          setIsLoggedIn(hasAuth);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const handleLogout = async (onClose: () => void) => {
    try {
      const result = await Logout();

      if (result?.success) {
        onClose();
        setIsLoggedIn(false);
        addToast({
          title: "Logged out successfully",
          color: "success",
        });
        router.push("/auth/login");
        router.refresh();
      } else {
        throw new Error(result?.error || "Logout failed");
      }
    } catch {
      addToast({
        title: "Failed to log out",
        color: "danger",
      });
      onClose();
    }
  };

  return (
    <HeroUINavbar
      className="border-b border-default-200/80 bg-background/90 backdrop-blur-md sticky top-0 z-50 h-14"
      classNames={{
        wrapper: "max-w-6xl px-4 sm:px-6",
      }}
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-2.5 max-w-fit">
          <NextLink className="flex items-center gap-2.5" href="/">
            <div className="w-8 h-8 rounded-xl bg-content2 border border-default-200/80 flex items-center justify-center p-1.5 shadow-2xs">
              <Image
                alt="Jobfi Logo"
                className="dark:hidden object-contain"
                height={20}
                src="/logo_black.svg"
                width={20}
              />
              <Image
                alt="Jobfi Logo"
                className="hidden dark:block object-contain"
                height={20}
                src="/logo.svg"
                width={20}
              />
            </div>
            <span className="font-bold text-foreground text-base tracking-tight">
              Jobfi
            </span>
          </NextLink>
        </NavbarBrand>

        <ul className="hidden md:flex gap-5 justify-start ml-6">
          <NavbarItem>
            <NextLink
              className={`text-xs transition-colors hover:text-foreground ${
                pathname === "/offers"
                  ? "text-foreground font-semibold"
                  : "text-default-500 font-medium"
              }`}
              href="/offers"
            >
              Browse Offers
            </NextLink>
          </NavbarItem>
          <NavbarItem>
            <NextLink
              className={`text-xs transition-colors hover:text-foreground ${
                pathname === "/about"
                  ? "text-foreground font-semibold"
                  : "text-default-500 font-medium"
              }`}
              href="/about"
            >
              How It Works
            </NextLink>
          </NavbarItem>
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2.5 items-center">
          <ThemeSwitch />

          {isLoggedIn ? (
            <>
              <Button
                as={NextLink}
                className="text-xs font-medium h-8 px-3 rounded-lg"
                href="/profile"
                size="sm"
                variant="flat"
              >
                Profile & Alerts
              </Button>
              <button
                className="flex items-center gap-1.5 text-xs font-medium text-default-400 hover:text-foreground transition-colors h-8 px-1"
                onClick={onOpen}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Button
                as={NextLink}
                className="text-xs font-medium text-default-600 hover:text-foreground h-8 px-3 rounded-lg"
                href="/auth/login"
                size="sm"
                variant="light"
              >
                Sign In
              </Button>
              <Button
                as={NextLink}
                className="text-xs font-semibold bg-foreground text-background hover:opacity-90 h-8 px-3.5 shadow-2xs rounded-lg"
                href="/auth/register"
                size="sm"
                variant="solid"
              >
                Sign Up
              </Button>
            </>
          )}
        </NavbarItem>
      </NavbarContent>

      <Modal
        classNames={{
          base: "border border-default-200/80 shadow-lg",
          header: "border-b border-default-200/50",
          footer: "border-t border-default-200/50",
        }}
        isOpen={isOpen}
        size="sm"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-sm font-semibold">
                Log out
              </ModalHeader>
              <ModalBody className="py-4">
                <p className="text-default-500 text-sm">
                  You&apos;ll need to sign in again to access your alerts and
                  saved filters.
                </p>
              </ModalBody>
              <ModalFooter className="gap-2">
                <Button
                  className="text-xs font-medium"
                  size="sm"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="text-xs font-semibold bg-foreground text-background"
                  size="sm"
                  onPress={() => handleLogout(onClose)}
                >
                  Log out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu className="bg-background/95 backdrop-blur-xl border-b border-default-200/50 pt-6">
        <div className="mx-4 flex flex-col gap-4">
          <NextLink
            className="text-sm font-medium text-default-800"
            href="/offers"
          >
            Browse Offers
          </NextLink>
          <NextLink
            className="text-sm font-medium text-default-800"
            href="/about"
          >
            How It Works
          </NextLink>
          {isLoggedIn ? (
            <>
              <NextLink
                className="text-sm font-medium text-default-800"
                href="/profile"
              >
                Profile & Alerts
              </NextLink>
              <button
                className="flex items-center gap-2 text-sm font-medium text-default-500 hover:text-foreground transition-colors pt-3 border-t border-default-200/50"
                onClick={onOpen}
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-4 border-t border-default-200/50">
              <Button
                as={NextLink}
                className="w-full font-medium"
                href="/auth/login"
                variant="bordered"
              >
                Sign In
              </Button>
              <Button
                as={NextLink}
                className="w-full font-semibold bg-foreground text-background"
                href="/auth/register"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
