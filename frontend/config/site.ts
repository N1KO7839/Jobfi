export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Jobfi",
  description: "Personalized job alerts delivered straight to your phone.",
  navItems: [
    {
      label: "Offers",
      href: "/offers",
    },
  ],
  navMenuItems: [
    {
      label: "Offers",
      href: "/offers",
    },
    {
      label: "Login",
      href: "/auth/login",
    },
    {
      label: "Logout",
      href: "/logout",
    },
    {
      label: "Profile",
      href: "/profile",
    },
  ],
  links: {},
};
