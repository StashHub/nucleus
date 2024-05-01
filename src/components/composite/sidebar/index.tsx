import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PAGES, MenuLink } from "@/lib/types";

import { UserNav } from "@/components/ui/user-nav";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/formfields/select/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { fontSans } from "@/lib/fonts";
import { type Company } from "@prisma/client";
import { useLayoutContext } from "@/context";
import React, { useState } from "react";
import { navLinks } from "@/lib/constants";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  links?: MenuLink[];
  activePage: PAGES;
}

const calculatePosition = (e: React.MouseEvent<HTMLElement, MouseEvent>) =>
  e.currentTarget.getBoundingClientRect().top -
  e.currentTarget.clientHeight / 2;

export function Sidebar({
  className,
  links = navLinks,
  activePage,
}: SidebarProps) {
  // Set active page
  links.map((l) => {
    l.label === activePage ? (l.active = true) : (l.active = false);
  });
  const { expanded, setExpanded, companies, setCompany, company } =
    useLayoutContext();

  return (
    <div
      className={cn("flex min-h-screen flex-col justify-between", className)}
    >
      <div
        className={`grid-cols grid ${
          expanded ? "gap-4 md:gap-6" : "gap-4 md:gap-2"
        }`}
      >
        <div
          className={`mt-4 hidden items-center lg:flex ${
            expanded ? "items-center justify-between" : "flex-col"
          }`}
        >
          {expanded ? (
            <Icons.logo className="my-2" />
          ) : (
            <Icons.minilogo className="mb-6 mt-2 h-6 w-6" />
          )}

          <Icons.doublechevron
            onClick={() => setExpanded(!expanded)}
            className={`h-6 w-6 cursor-pointer text-gray-600 ${
              expanded ? "mr-4 mt-2" : "mb-3 block rotate-180"
            }`}
          />
        </div>

        {!expanded && (
          <Separator decorative={true} className={`mx-auto w-8 bg-slate-200`} />
        )}

        <div>
          <div>
            <Select
              value={company?.id ? company.id : "default"}
              onValueChange={(e: string) => {
                const comp = companies.filter((i: Company) => i.id === e)[0];
                if (comp) setCompany(comp);
              }}
            >
              {expanded ? (
                <SelectTrigger className="h-12 min-w-full rounded-lg bg-white p-4 shadow-none hover:border hover:border-neutral-200 focus:border focus:border-purple-500 focus:outline-none focus:ring-0 active:border active:border-purple-500 data-[state='open']:border-purple-500 lg:w-[248px] lg:bg-white">
                  <SelectValue />
                </SelectTrigger>
              ) : (
                <SelectTrigger asButton className="p-0">
                  <Icons.briefcase stroke="#343C46" />
                </SelectTrigger>
              )}
              <SelectContent
                className={`${fontSans.variable} relative top-1 max-w-full rounded-lg border border-purple-300 bg-white shadow-md`}
              >
                {companies.length > 0 ? (
                  companies.map((company: Company, idx: number) => (
                    <SelectItem
                      key={`${company.id}-${idx}`}
                      className="hover::bg-neutral-100 cursor-pointer rounded-lg px-2 py-2 font-sans text-sm hover:bg-gray-100 hover:text-purple data-[state='checked']:text-purple [&>span:first-of-type]:hidden"
                      value={company.id}
                      defaultChecked={true}
                    >
                      {company.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem key="default" value="default">
                    <span className="text-neutral-300">Select company</span>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 lg:hidden">
            <p className="mb-0 mt-2.5 text-xs leading-[18px]">
              Company ID: {company?.ein}
            </p>
          </div>
        </div>

        <Separator
          decorative={true}
          className={`bg-slate-200 ${expanded ? "w-100" : "mx-auto w-8"}`}
        />

        <div>
          {links.map((link: MenuLink, i: number) => (
            <div
              key={`${link.label}-${i}`}
              className={`mb-2 space-y-1 ${!expanded ? "text-center" : null}`}
            >
              {link.url &&
                (!React.isValidElement(link.url) ? (
                  <Link href={String(link.url)}>
                    <Button
                      variant="navlink"
                      state={link.active ? "active" : "default"}
                      className="max-w-100"
                    >
                      {!link.active && link.iconInactive
                        ? Icons[link.iconInactive]({
                            className: `h-5 w-5 inactive inline-flex${
                              !expanded ? " m-auto" : ""
                            }`,
                            fill: "",
                            fillOpacity: "0",
                            stroke: "#343C46",
                          })
                        : Icons[link.icon]({
                            className: `h-5 w-5 inline-flex${
                              !expanded ? " m-auto" : ""
                            }`,
                            fill: "",
                            fillOpacity: "",
                            stroke: "",
                          })}
                      {expanded && <div className="ml-2">{link.label}</div>}
                    </Button>
                  </Link>
                ) : (
                  link.url
                ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Dialog>
          <DialogTrigger className="w-full">
            <div className="flex w-full justify-start fill-primaryText px-2 text-sm font-normal transition-colors hover:!fill-purple-400 hover:text-purple-400">
              <Icons.lifesaver
                className={`inline-flex fill-inherit ${
                  !expanded ? "m-auto" : ""
                }`}
              />
              {expanded && <div className="ml-2">Support</div>}
            </div>
          </DialogTrigger>
          <DialogContent
            className={`${fontSans.variable} w-full rounded-2xl bg-white font-sans [&>button]:top-[1rem] sm:[&>button]:top-[22px]`}
          >
            <DialogHeader>
              <DialogTitle>Contact Support</DialogTitle>
              <div className="grid-cols grid gap-6 text-left text-[var(--neutral-600)]">
                <p className="mb-0 text-sm">
                  If you have questions or need help, please email our support
                  team.
                </p>
                <div className="mb-1 flex items-center gap-2.5">
                  <div className="rounded-full border-none bg-purple-50 stroke-purple-400 p-2">
                    <Icons.mail className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col justify-center text-purple">
                    <h3 className="text-sm font-semibold leading-[21px] text-primaryText">
                      Email
                    </h3>
                    <Link
                      className="text-xs font-normal leading-[18px]"
                      href="mailto:support@getrefunds.com"
                    >
                      support@getrefunds.com
                    </Link>{" "}
                  </div>{" "}
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <div className="mb-0 mt-6 tbl:mb-4">
          <UserNav isAvatarOnly={!expanded} />
        </div>
      </div>
    </div>
  );
}
