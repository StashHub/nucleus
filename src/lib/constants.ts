import { PAGES, type MenuLink } from "@/lib/types";

export const navLinks: MenuLink[] = [
  {
    label: PAGES.DASHBOARD,
    icon: "database",
    iconInactive: "databaseInactive",
    url: "/dashboard",
    active: false,
  },
  {
    label: PAGES.ERC,
    icon: "lightning",
    iconInactive: "lightning",
    url: "/dashboard/erc",
    fillOpacity: "0",
    active: false,
  },
];

export type NavLinks = typeof navLinks;
