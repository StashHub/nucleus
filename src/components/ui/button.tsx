import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium ring-offset-background transition-colors focus-visible:outline-none disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-30",
  {
    variants: {
      variant: {
        default:
          "bg-purple flex justify-center px-3 py-2.5 font-medium leading-6 text-white hover:bg-purple-600 outline-0 focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:bg-purple-600",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-backgroundMain border-neutral-300 font-medium border text-secondary-foreground hover:bg-neutral-100 px-4 py-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:bg-neutral-100",
        info: "bg-info-600 border-info-600 font-medium border text-white hover:bg-info-700 px-4 py-2.5 rounded-lg hover:border-info-700",
        navlink:
          "bg-backgroundMain font-medium text-gray-600 hover:bg-purple-100 text-sm pl-3 py-2 pr-2 justify-start font-normal",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 w-full px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 w-full px-8",
        icon: "h-10 w-10",
      },
      state: {
        default: "",
        active: "bg-purple fill-white text-white hover:bg-purple",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, state, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, state, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
