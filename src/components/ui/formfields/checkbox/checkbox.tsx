import type { FC, HTMLAttributes, ReactNode } from "react";
import { type FieldHookConfig, useField, ErrorMessage } from "formik";
import { cx } from "class-variance-authority";
import { Label } from "@/components/ui/label";

type AllowedValue = string | number | readonly string[] | undefined;

type CheckboxProps = FieldHookConfig<AllowedValue> &
  HTMLAttributes<HTMLInputElement> & {
    label?: ReactNode;
    hideError?: boolean;
  };

const Checkbox: FC<CheckboxProps> = ({
  label,
  hideError = false,
  onChange,
  className,
  ...props
}) => {
  const [field] = useField({ ...props, type: "checkbox" });

  const generic = props as HTMLAttributes<HTMLInputElement>;

  return (
    <div className={cx(className, "relative mb-8 flex flex-col")}>
      <div className="flex items-center">
        <input
          {...generic}
          {...field}
          onChange={(event) => {
            field.onChange(event);
            onChange?.(event);
          }}
          className="bg-[1rem auto] focus:ring-3 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-neutral-400 bg-center bg-no-repeat outline-0 checked:border-purple checked:bg-[url('/assets/checkmark.svg')] hover:border-neutral-600 focus-visible:border-purple-300 focus-visible:ring-[3px] focus-visible:ring-purple-100"
          id={props.name}
          type="checkbox"
        />
        {label && (
          <Label
            className="mb-0 pl-2 font-normal tracking-tight text-neutral-600 hover:cursor-pointer"
            htmlFor={props.id ?? props.name}
          >
            {label}
          </Label>
        )}
      </div>
      {!hideError && (
        <span className="text-alert-500 mt-1 text-sm">
          <ErrorMessage name={props.name} />
        </span>
      )}
    </div>
  );
};

export default Checkbox;
