import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import Toaster from "@/components/ui/toaster";

type LayoutProps = {
  children: JSX.Element;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Toaster />
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
};

export default Layout;
