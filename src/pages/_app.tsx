import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { fontSans } from "@/lib/fonts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "@/styles/globals.css";
import { LayoutProvider } from "@/context";
import { cn } from "@/lib/utils";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  session: Session | null;
};

const queryClient = new QueryClient();

const App = ({ Component, session, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <LayoutProvider>
          <main
            className={cn(
              "flex grow flex-col bg-backgroundMain font-sans",
              fontSans.variable,
            )}
          >
            {getLayout(<Component {...pageProps} />)}
          </main>
        </LayoutProvider>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
