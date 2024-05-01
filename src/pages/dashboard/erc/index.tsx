import SidebarLayout from "@/components/sidebar-layout";
import HeaderDashboard from "@/components/composite/headerdashboard";
import ERCContainer from "@/views/dashboard/erc";

import { PAGES } from "@/lib/types";
import RefundCreditEstimate from "@/components/ui/refund-credit-estimate";
import Head from "@/components/ui/head";

export default function ERC() {
  return (
    <>
      <Head title="Employee Retention Credit" />
      <SidebarLayout activePage={PAGES.ERC}>
        <HeaderDashboard
          title={<RefundCreditEstimate />}
          className="bg-backgroundMain"
        />
        <ERCContainer />
      </SidebarLayout>
    </>
  );
}
