import type { ReactNode, Dispatch, SetStateAction } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fontSans } from "@/lib/fonts";
import type { VariantProps } from "class-variance-authority";

interface ModalProps {
  title: string;
  triggerText?: string | ReactNode;
  isButton?: boolean;
  children: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  buttonVariant?: VariantProps<typeof buttonVariants>;
  showCloseIcon?: boolean;
  className?: string;
}

const Modal = ({
  triggerText,
  isButton,
  title,
  children,
  open,
  setOpen,
  buttonVariant,
  showCloseIcon,
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerText && (
        <DialogTrigger
          className={
            isButton
              ? buttonVariants({
                  variant: buttonVariant ? buttonVariant?.variant : "secondary",
                })
              : "w-unset w-full"
          }
        >
          {triggerText}
        </DialogTrigger>
      )}
      <DialogContent
        showCloseIcon={showCloseIcon}
        className={`${fontSans.variable} w-full bg-white text-left font-sans`}
      >
        <DialogHeader>
          <DialogTitle className="pb-2 pr-6 text-lg font-bold leading-5 mbl:text-xl mbl:leading-6">
            {title}
          </DialogTitle>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
