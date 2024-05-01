import { type FC } from "react";
import { Icons } from "@/components/ui/icons";

type Props = {
  toggle: boolean;
  onClick: () => void;
};

export const PasswordToggle: FC<Props> = ({ toggle, onClick }) => (
  <button
    className="absolute right-3 top-[50%] flex -translate-y-1/2 justify-center rounded-md border border-transparent p-1 outline-0 focus-visible:border focus-visible:border-purple-200 focus-visible:ring-2 focus-visible:ring-purple-100"
    type="button"
    tabIndex={-1}
    onClick={onClick}
  >
    {toggle ? <Icons.eyeoff /> : <Icons.eye />}
  </button>
);
