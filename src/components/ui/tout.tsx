import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toutVariants = cva(
  "relative w-full pb-10 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:top-0 [&>svg]:text-foreground [&>svg~*]:pl-14",
);

const Tout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof toutVariants>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(toutVariants(), className)} {...props} />
));
Tout.displayName = "Tout";

const Title = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-2 text-lg font-semibold leading-7 tracking-[-0.4px] tbl:mb-0 tbl:text-xl",
      className,
    )}
    {...props}
  />
));
Title.displayName = "ToutTitle";

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-normal [&_p]:leading-relaxed", className)}
    {...props}
  />
));
Description.displayName = "ToutDescription";

export { Tout, Title, Description };
