import { cn } from "@/lib/utils";
import * as React from "react";

interface MaskedPasswordProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  value?: string;
}

const Mask: React.FC<MaskedPasswordProps> = ({
  value,
  className,
  ...props
}) => {
  const mask = (length: number) => "•".repeat(length);
  const masked = mask(value?.length ?? 10);
  return (
    <p className={cn("mb-0 text-sm font-normal", className)} {...props}>
      {masked}
    </p>
  );
};

export { Mask };
