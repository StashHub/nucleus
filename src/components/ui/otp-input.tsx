/* eslint-disable react-hooks/rules-of-hooks */
import { cx } from "class-variance-authority";
import React, {
  useRef,
  useState,
  useEffect,
  type FocusEvent,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";

type EnterCodeProps = {
  callback: (code: string) => void;
  isLoading: boolean;
  value: string;
};

const NUMERIC_REGEX = new RegExp(/^[0-9]$/);

const EnterCode: React.FC<EnterCodeProps> = ({
  callback,
  isLoading,
  value,
}) => {
  const [code, setCode] = useState<string>("");
  const inputRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement | null>(null),
  );

  useEffect(() => {
    if (code.length === 6 && code !== value) callback(code);
  }, [code, callback, value]);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    const { target } = e;
    const previousInput =
      target.previousElementSibling as HTMLInputElement | null;
    if (previousInput?.value === "") previousInput.focus();
    target.setSelectionRange(0, target.value.length);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const input = e.target as HTMLInputElement;
    const previousInput = inputRefs[index - 1]?.current;
    const nextInput = inputRefs[index + 1]?.current;
    const newCode = [...code];
    const isNumeric = NUMERIC_REGEX.test(input.value);

    if (!isNumeric && input.value !== "") return;

    newCode[index] = input.value;
    inputRefs[index]!.current!.value = input.value;

    // only delete digit if next input has no value
    if (nextInput && nextInput.value !== "") return;

    setCode(newCode.join(""));
    input.select();

    if (input.value === "" && previousInput) {
      previousInput.focus();
    } else if (nextInput) nextInput.select();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    const input = e.target as HTMLInputElement;
    const previousInput = inputRefs[index - 1]?.current;
    const nextInput = inputRefs[index + 1]?.current;

    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();

      if (e.key === "ArrowLeft" && previousInput) {
        previousInput.focus();
      } else if (e.key === "ArrowRight" && nextInput) {
        nextInput.focus();
      }
      return;
    }

    if (["Backspace", "Delete"].includes(e.key) && input.value === "") {
      e.preventDefault();
      setCode(
        (prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1),
      );
      previousInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedCode = e.clipboardData.getData("text");
    if (pastedCode.length === 6 && /^\d+$/.test(pastedCode)) {
      setCode(pastedCode);
      inputRefs.forEach((inputRef, index) => {
        inputRef?.current &&
          (inputRef.current.value = pastedCode.charAt(index));
      });
      inputRefs[0]?.current?.blur();
    }
  };

  return (
    <div className="relative mb-6 flex gap-2">
      {inputRefs.map((inputRef, index) => (
        <input
          key={index}
          className={cx(
            "max-w-12 flex h-14 w-full grow rounded-lg border bg-white py-2 text-center text-[2.5rem] font-medium caret-purple-200 focus:border focus:border-purple-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus-visible:outline-offset-0 focus-visible:ring-4",
            inputRef?.current?.value === ""
              ? "border-neutral-200"
              : "border-purple-200 text-purple-400 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-purple-100",
          )}
          ref={inputRef}
          type="text"
          maxLength={1}
          autoFocus={index === 0}
          autoComplete="one-time-code"
          onPaste={handlePaste}
          value={inputRef?.current?.value ?? ""}
          onFocus={handleFocus}
          onChange={(e) => handleInput(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          disabled={isLoading}
        />
      ))}
    </div>
  );
};

export default EnterCode;
