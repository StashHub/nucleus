import Link from "next/link";
import { Icons } from "@/components/ui/icons";

export function SiteFooter() {
  return (
    <footer className="mt-auto flex flex-col items-center border-t p-8 sm:flex-row sm:justify-between">
      <p className="mb-1 text-center text-sm text-neutral-600 sm:mb-0">
        © {new Date().getFullYear()} GetRefunds
      </p>
      <Link
        href="mailto:support@getrefunds.com"
        className="flex content-center text-center text-sm text-neutral-600"
      >
        <Icons.envelope className="inline-flex fill-zinc-700" />
        support@getrefunds.com
      </Link>
    </footer>
  );
}
