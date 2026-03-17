export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Jobfi",
  description: "Personalized job alerts delivered straight to your phone.",
  navItems: [
    // {
    //   label: "Home",
    //   href: "/",
    // },
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    // },
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
      href: "/Login",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {},
};
