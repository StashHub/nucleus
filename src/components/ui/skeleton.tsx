import { cn } from "@/lib/utils";
import styles from "@/styles/ui/skeleton.module.css";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full animate-pulse bg-neutral-200",
        className,
        styles.skeleton,
      )}
      {...props}
    />
  );
}

export default Skeleton;
