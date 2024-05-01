/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { type ValidationRule, validation } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";

type PasswordValidityProps = {
  show?: boolean;
  newPassword: string;
  confirmPassword: string;
  onPasswordValidateChange: (success: boolean) => void;
  validationRules: ValidationRule[];
};

const PasswordValidity: React.FC<PasswordValidityProps> = ({
  show,
  newPassword,
  confirmPassword,
  onPasswordValidateChange,
  validationRules,
}) => {
  const [rules, setRules] = useState<ValidationRule[]>([]);

  // Debounced function to handle validation checks
  const handleValidationCheck = useCallback(
    useDebounce((rulesList: ValidationRule[]) => {
      // Check if every validation rule is successful
      const success = rulesList.every(({ validation }) => validation !== false);
      onPasswordValidateChange(success);
    }),
    [onPasswordValidateChange],
  );

  useEffect(() => {
    const updatedRules = validationRules.map((rule) => ({
      ...rule,
      validation: validation({ rule, password: newPassword }),
      label: rule.label,
    }));

    setRules(updatedRules);
    handleValidationCheck(updatedRules);
  }, [newPassword, confirmPassword, validationRules, handleValidationCheck]);

  return (
    <>
      {show && (
        <div className="flex flex-col px-3">
          {rules.map(({ key, validation, label }) => (
            <div key={key} className="flex items-center space-x-2">
              <p className={`text-${validation ? "green" : "gray"}-500`}>
                {validation ? <Icons.checkcircle /> : <Icons.circle />}
              </p>
              <p
                className={`text-sm font-medium leading-5 ${
                  validation ? "text-green-600" : "text-gray-500"
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PasswordValidity;
