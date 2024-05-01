import React, { type PropsWithChildren, useState, useEffect } from "react";
import { Sidebar } from "./composite/sidebar";
import Toaster from "@/components/ui/toaster";

import type { MenuLink, PAGES } from "@/lib/types";
import { Icons } from "./ui/icons";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { fontSans } from "@/lib/fonts";
import { useScrollDirection } from "react-use-scroll-direction";
import { useLayoutContext } from "../context";
import { DashboardFooter } from "./dashboard-footer";

interface Props {
  links?: MenuLink[];
  activePage: PAGES;
}

const SidebarLayout: React.FC<PropsWithChildren & Props> = ({
  links,
  activePage,
  children,
}) => {
  const { expanded, setExpanded } = useLayoutContext();
  const { isScrollingUp, isScrollingDown } = useScrollDirection();
  const [scrolledUp, setScrolledUp] = useState<boolean>(false);

  useEffect(() => {
    if (isScrollingUp) setScrolledUp(true);
    if (isScrollingDown) setScrolledUp(false);
  }, [isScrollingUp, isScrollingDown]);

  return (
    <>
      <Toaster />
      {/* Mobile */}
      <div
        className={`min-h-3 bg-backgroundMain p-4 md:p-6 lg:hidden ${
          scrolledUp && window.scrollY > 1
            ? "sticky top-0 z-50 border-b-[1.5px] border-gray-200"
            : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <Icons.logo className="w-[100px]" />

          <Sheet>
            <SheetTrigger>
              <Icons.hamburger
                className="h-6 w-6 cursor-pointer text-gray-600"
                onClick={() => setExpanded(true)}
              />
            </SheetTrigger>
            <SheetContent
              className={`${fontSans.variable} flex h-full flex-col space-y-0 bg-backgroundMain px-4 py-6 font-sans md:rounded-l-2xl`}
              side={"right"}
            >
              <SheetHeader className="text-left">
                <SheetTitle className="pb-4 text-xl font-bold">Menu</SheetTitle>
              </SheetHeader>
              <Sidebar
                className={`min-h-0 grow`}
                links={links}
                activePage={activePage}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop */}
      <div className="h-full">
        <div
          className="grid h-full grid-cols-12 transition-[grid-template-columns]"
          style={{
            gridTemplateColumns: `${
              expanded
                ? "280px repeat(11, minmax(0, 1fr))"
                : "64px repeat(11, minmax(0, 1fr))"
            }`,
          }}
        >
          {/* Sidebar */}
          <div className={`col-span-1 hidden justify-center lg:flex`}>
            <Sidebar
              links={links}
              className={`fixed ${expanded ? "px-4" : "px-2"}`}
              activePage={activePage}
            />
          </div>

          {/* Content */}
          <div className="z-10 col-span-12 lg:col-span-11 lg:pt-4">
            <div
              className={`box-shadow-md mx-2 flex h-full flex-col rounded-t-3xl bg-white pb-4 md:mx-6 lg:mx-0 lg:mr-0 lg:rounded-tr-none ${
                expanded ? "lg:pb-8" : "lg:pb-6"
              }`}
            >
              {children}
              <DashboardFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarLayout;
