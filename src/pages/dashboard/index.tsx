import SidebarLayout from "@/components/sidebar-layout";
import DashboardContainer from "@/views/dashboard";
import { signOut, useSession } from "next-auth/react";
import HeaderDashboard from "@/components/composite/headerdashboard";
import { navLinks } from "@/lib/constants";

import Lottie from "lottie-react";
import handwave from "@/components/ui/lottie/handwave.json";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import { PAGES } from "@/lib/types";
import Skeleton from "@/components/ui/skeleton";
import Head from "@/components/ui/head";

export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const params = useSearchParams();
  const email = session.data?.user.email;

  useEffect(() => {
    {
      email &&
        params.has("loggedin") &&
        toast({
          description: (
            <p className="mb-0">
              Signed in as
              <br />
              <span className="font-bold">{email}</span>
            </p>
          ),
          action: (
            <ToastAction
              onClick={async () => {
                const data = await signOut({
                  callbackUrl: "/signin",
                  redirect: false,
                });
                router.push(data.url).catch((error) => {
                  console.log("router err:", error);
                });
              }}
              altText="Sign out"
            >
              Sign out
            </ToastAction>
          ),
          variant: "success",
          hideClose: true,
        });
    }
  }, [email, params, router, toast]);

  return (
    <>
      <Head title="Dashboard" />
      <SidebarLayout links={navLinks} activePage={PAGES.DASHBOARD}>
        <HeaderDashboard
          title={
            <>
              Welcome back,{" "}
              {session.data?.user.name ? (
                <>
                  {session.data.user.name.split(" ")[0]}
                  <Lottie
                    animationData={handwave}
                    loop={false}
                    className="inline-block h-[2.125rem] w-[2.125rem] pl-1 align-bottom"
                  />
                </>
              ) : (
                <Skeleton className="relative top-[1px] inline-block h-6 w-20 rounded-sm" />
              )}
            </>
          }
        />
        <DashboardContainer />
      </SidebarLayout>
    </>
  );
}
