import { Avatar, AvatarFallback } from "./avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "./button";
import { fontSans } from "@/lib/fonts";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Icons } from "./icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function UserNav({ isAvatarOnly = false }: { isAvatarOnly?: boolean }) {
  const session = useSession();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (session.data?.user.name) {
      setName(session.data.user.name);
    }
    if (session.data?.user.email) {
      setEmail(session.data.user.email);
    }
  }, [session, setName, setEmail]);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="group rounded-[10px] border border-neutral-100 bg-white p-2 hover:border-neutral-200"
        >
          <div className="flex cursor-pointer items-center">
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full bg-gray-200"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback />
              </Avatar>
            </Button>
            {!isAvatarOnly && (
              <div className="flex h-full w-full items-center justify-between">
                <div className="pl-2.5">
                  <p className="mb-0 truncate text-sm font-semibold leading-[21px] lg:max-w-[150px]">
                    {session ? session.data?.user.name : null}
                  </p>
                  <p className="text-muted-foreground mb-0 truncate text-xs leading-[20px] text-gray-600 lg:max-w-[150px]">
                    {session ? session.data?.user.email : null}
                  </p>
                </div>
                <div className="flex h-full w-6 flex-col items-center justify-center">
                  <Icons.chevronupdown className="h-4 w-4 fill-primaryText group-hover:fill-purple" />
                </div>
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`${fontSans.variable} box-shadow-md mr-2 w-[calc(100vw-2rem)] rounded-[10px] bg-white p-2 font-sans sm:w-[350px] tbl:w-[248px]`}
          align="start"
          forceMount
        >
          <DropdownMenuGroup>
            <DropdownMenuItem className="p-0">
              <Link
                href="/dashboard/settings"
                className="w-full rounded-lg px-2 py-1.5 text-black hover:bg-gray-100 hover:text-purple"
              >
                Your account
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <DialogTrigger className="w-full" asChild>
              <div className="flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg px-2 py-1.5 text-black hover:bg-gray-100 hover:fill-purple hover:text-purple">
                Sign out
                <Icons.signout className="float-right h-5 w-5 hover:fill-inherit" />
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent
        showCloseIcon={false}
        className={`${fontSans.variable} w-full max-w-[calc(100vw-2rem)] rounded-xl bg-white font-sans sm:max-w-[360px] [&>button]:top-[1rem] sm:[&>button]:top-[22px]`}
      >
        <DialogHeader className="text-left">
          <DialogTitle>Sign out of your account?</DialogTitle>
          <div className="grid-cols grid gap-8 pt-6 text-neutral-600">
            <div className="flex justify-start">
              <div className="relative h-8 w-8 rounded-full bg-neutral-100">
                <Avatar className="h-8 w-8">
                  <AvatarFallback name={name ? name : "IR"} />
                </Avatar>
              </div>
              <div className="pl-4">
                <p className="mb-1 truncate text-sm font-medium leading-none text-primaryText">
                  {name}
                </p>
                <p className="text-muted-foreground mb-0 truncate text-xs leading-none text-neutral-600">
                  {email}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm lg:flex-row-reverse lg:justify-between">
              <Button
                variant={"default"}
                onClick={async () => {
                  const data = await signOut({
                    callbackUrl: "/signin",
                    redirect: false,
                  });
                  router.push(data.url);
                }}
              >
                Sign out
              </Button>
              <DialogClose className="w-full" asChild>
                <Button variant={"secondary"}>Cancel</Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
