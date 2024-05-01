export function DashboardFooter() {
  return (
    <div className="mx-4 mt-auto border-t border-neutral-100 pt-6 text-sm text-neutral-600 tbl:mx-8">
      <p className="mb-4 block pr-6 text-sm md:mb-0 md:inline-block">
        © {new Date().getFullYear()} GetRefunds
      </p>
      <a
        className="mb-4 block pr-6 md:mb-0 md:inline-block"
        href="https://getrefunds.com/terms"
        target="_blank"
      >
        Terms and Conditions
      </a>
      <a
        className="mb-4 block pr-6 md:mb-0 md:inline-block"
        href="https://getrefunds.com/privacy"
        target="_blank"
      >
        Privacy Policy
      </a>
      <a
        className="mb-4 block pr-6 md:mb-0 md:inline-block"
        href="https://getrefunds.com/notice-at-collection"
        target="_blank"
      >
        Notice at Collections
      </a>
      <p className="mb-0 pb-2 pt-0 md:pt-4 tbl:pt-4">
        This dashboard is not comprehensive. It is limited to the information
        displayed, does not contain all available information, and may not
        include information you consider important or material.
      </p>
    </div>
  );
}
