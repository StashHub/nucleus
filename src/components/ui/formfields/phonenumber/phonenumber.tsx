import type { FC, HTMLAttributes } from "react";
import { cx } from "class-variance-authority";
import { ErrorMessage, type FieldHookConfig, useField } from "formik";
import { AsYouType, type E164Number } from "libphonenumber-js";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

type AllowedValue = string;

type PhoneNumberProps = FieldHookConfig<AllowedValue> &
  HTMLAttributes<HTMLInputElement> & {
    name: string;
    label?: string;
  };

const PhoneNumber: FC<PhoneNumberProps> = ({ label, onBlur, ...props }) => {
  const [field, { error, touched }, { setValue }] = useField({ ...props });

  const generic = props as HTMLAttributes<HTMLInputElement>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    const value = e.currentTarget.value;
    const shouldFormat = /(.?\d){4,}/.test(value);
    if (shouldFormat) {
      const newValue = new AsYouType("US").input(value as E164Number);
      return setValue(newValue);
    }
    return value;
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    field.onBlur(event);
    if (onBlur) {
      onBlur(event);
    }
  };

  return (
    <div className="mb-5 flex flex-col">
      {label && <Label htmlFor={props.id ?? props.name}>{label}</Label>}
      <div className="relative">
        <Icons.cellPhone
          fill={error && touched ? "#c2200a" : "#343C46"}
          className="absolute left-3 top-[14px]"
        />
        <input
          {...generic}
          {...field}
          className={cx(
            "h-12 w-full rounded-lg border bg-backgroundMain p-3 pl-10 text-primaryText caret-purple-200 outline-0 transition hover:border-neutral-500 focus:border-purple-200 focus:ring-[3px] focus:ring-purple-100",
            error && touched
              ? "!border-negative-200 !text-negative-600 ring-[3px] !ring-negative-100 focus:border-negative-200"
              : "border-neutral-200",
          )}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      {error && (
        <span className="mt-1 text-sm text-negative-600">
          <ErrorMessage name={props.name} />
        </span>
      )}
    </div>
  );
};

export default PhoneNumber;
