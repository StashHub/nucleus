import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icons } from "./icons";

const alertVariants = cva(
  "w-full relative flex flex-row items-center box-shadow-sm font-medium rounded-lg border p-2.5 [&>svg~*]:pl-8 [&>svg]:absolute [&>svg]:left-3 [&>svg]:top-2.5 [&>svg]:text-foreground mb-4",
  {
    variants: {
      variant: {
        default: "",
        destructive: "bg-[#FEEAE7] border-[#FCD4CF]/50 text-[#300803]",
        warning: "bg-notice-50 border-notice-100 text-[#331900]",
        info: "bg-info-100 border-info-500",
        success: "bg-success-50 border border-success-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & { open?: boolean }
>(({ children, className, open = true, variant, ...props }, ref) => {
  return (
    <>
      {open && (
        <div
          ref={ref}
          role="alert"
          className={cn(alertVariants({ variant }), className)}
          {...props}
        >
          {children}
        </div>
      )}
    </>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

const AlertAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { to?: string }
>(({ className, to, ...props }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) {
      props.onClick(event);
    }
  };

  // Common class names for both Link and button
  const commonClassNames = cn(
    "inline-flex items-center justify-end text-sm font-medium text-inherit transition-colors ml-auto px-1",
    className,
  );

  // If 'to' is provided, use Next.js Link for navigation
  if (to) {
    return (
      <Link href={to} className={commonClassNames}>
        <button ref={ref} {...props} />
      </Link>
    );
  }

  // If 'to' is not provided, render a regular button
  return (
    <button
      ref={ref}
      className={commonClassNames}
      onClick={handleClick}
      {...props}
    />
  );
});

AlertAction.displayName = "AlertAction";

const AlertClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) {
      props.onClick(event);
    }
  };

  const baseClassNames = "absolute right-3 top-2.5 !pl-0";

  return (
    <button
      ref={ref}
      className={cn(baseClassNames, className)}
      onClick={handleClick}
      {...props}
    >
      <Icons.close aria-label="Close" className="h-[18px] w-[18px]" />
    </button>
  );
});

AlertClose.displayName = "AlertClose";

export { Alert, AlertTitle, AlertDescription, AlertAction, AlertClose };
