import SidebarLayout from "@/components/sidebar-layout";
import HeaderDashboard from "@/components/composite/headerdashboard";
import SettingsContainer from "@/views/dashboard/settings";
import { PAGES } from "@/lib/types";

export default function Settings() {
  return (
    <SidebarLayout activePage={PAGES.SETTINGS}>
      <HeaderDashboard title="Your account" />
      <SettingsContainer />
    </SidebarLayout>
  );
}
