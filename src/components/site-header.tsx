import Link from "next/link";
import { Icons } from "@/components/ui/icons";

export function SiteHeader() {
  return (
    <header className="px-4 py-5">
      <nav>
        <div>
          <Link className="inline-block" href="/">
            <Icons.logo />
          </Link>
        </div>
      </nav>
    </header>
  );
}
