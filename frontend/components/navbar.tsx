"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { User } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logout } from "@/app/auth/actions";

export const Navbar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const handleLogout = async (onClose: () => void) => {
    try {
      const result = await Logout();

      if (result?.success) {
        onClose();
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
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">Jobfi</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-6 items-center">
          <Link
            color="foreground"
            href={siteConfig.navMenuItems[1].href}
            size="md"
          >
            {siteConfig.navMenuItems[1].label}
          </Link>
          <Link
            as="button"
            className="cursor-pointer"
            color="foreground"
            size="md"
            onPress={onOpen}
          >
            Logout
          </Link>
          <ThemeSwitch />
          <Link
            color="foreground"
            href={siteConfig.navMenuItems[3].href}
            size="md"
          >
            <User size={22} />
          </Link>
        </NavbarItem>
      </NavbarContent>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Logout
              </ModalHeader>
              <ModalBody>
                <p>Are you sure you want to log out?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={() => handleLogout(onClose)}>
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

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 1
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 2
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
