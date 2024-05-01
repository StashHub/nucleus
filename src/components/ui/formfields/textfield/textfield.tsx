import { useState, type FC, type HTMLAttributes } from "react";
import { type FieldHookConfig, useField, ErrorMessage } from "formik";
import { cx } from "class-variance-authority";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { PasswordToggle } from "@/components/ui/formfields/toggle";

type AllowedValue = string | number | string[] | undefined;

type Types = "text" | "email" | "number" | "password";

type TextFieldProps = FieldHookConfig<AllowedValue> &
  HTMLAttributes<HTMLInputElement> & {
    type: Types;
    label?: string;
    showError?: boolean;
    showIcon?: boolean;
  };

const iconVariants: Record<Types, keyof typeof Icons> = {
  email: "envelope",
  password: "lock",
  text: "lock",
  number: "lock",
};

const TextField: FC<TextFieldProps> = ({
  showError = true,
  showIcon = true,
  label,
  onChange,
  onBlur,
  type,
  ...props
}) => {
  const [field, { error, touched }] = useField({ ...props });

  const [isPassword] = useState<boolean>(type === "password");
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(event);
    if (onChange) {
      onChange(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(event);
    if (onBlur) {
      onBlur(event);
    }
  };

  return (
    <div className="relative mb-4 flex flex-col">
      {label && <Label htmlFor={props.id ?? props.name}>{label}</Label>}
      <div className="relative w-full">
        {showIcon &&
          Icons[iconVariants[type]]({
            className: "absolute left-3 top-[14px]",
            fill: error && touched ? "#c2200a" : "#343C46",
          })}
        <input
          {...(props as HTMLAttributes<HTMLInputElement>)}
          {...field}
          className={cx(
            `h-12 w-full rounded-lg border bg-backgroundMain p-3 ${
              showIcon ? "pl-10" : ""
            } text-primaryText caret-purple-200 outline-0 transition hover:border-neutral-500 focus:border-purple-200 focus:ring-[3px] focus:ring-purple-100`,
            error && touched
              ? "!border-negative-200 !text-negative-600 ring-[3px] !ring-negative-100 focus:border-negative-200"
              : "border-neutral-200",
          )}
          onChange={handleChange}
          onBlur={handleBlur}
          type={isPassword ? (hidePassword ? "password" : "text") : type}
        />
        {isPassword && (
          <PasswordToggle
            toggle={hidePassword}
            onClick={() => setHidePassword(!hidePassword)}
          />
        )}
      </div>
      {showError && (
        <span className="mt-1 text-sm text-negative-600">
          <ErrorMessage name={props.name} />
        </span>
      )}
    </div>
  );
};

export default TextField;
