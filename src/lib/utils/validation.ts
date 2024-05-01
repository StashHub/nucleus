export enum VALIDATION_RULES_KEYS {
  MIN_LENGTH = "MINIMUM LENGTH",
  NUMERIC = "NUMBER",
  SPECIAL_CHARS = "SPECIAL CHARACTER",
  LOWERCASE_LETTER = "LOWERCASE LETTER",
  UPPERCASE_LETTER = "UPPERCASE LETTER",
}

export const passwordRegex = RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]).{8,50}$/,
);

// Define password rules with keys and corresponding labels
export const passwordRules = [
  VALIDATION_RULES_KEYS.MIN_LENGTH,
  VALIDATION_RULES_KEYS.NUMERIC,
  VALIDATION_RULES_KEYS.SPECIAL_CHARS,
  VALIDATION_RULES_KEYS.LOWERCASE_LETTER,
  VALIDATION_RULES_KEYS.UPPERCASE_LETTER,
].map((key) => ({
  key,
  // Set label based on rule key, with a specific label for MIN_LENGTH
  label:
    key === VALIDATION_RULES_KEYS.MIN_LENGTH
      ? "At least 8 characters"
      : `1 ${key.toLowerCase()}`,
}));

// Password rules
export type ValidationRule = {
  key: string;
  label?: string;
  validation?: boolean;
};

type ValidationProps = {
  rule: ValidationRule;
  password: string;
};

// Validation function for password rules
export const validation: ({ rule, password }: ValidationProps) => boolean = ({
  rule,
  password,
}) => {
  // Define rule-to-regexp mappings for validation
  const ruleMappings: Record<string, RegExp> = {
    [VALIDATION_RULES_KEYS.MIN_LENGTH]: /^.{8,50}$/,
    [VALIDATION_RULES_KEYS.LOWERCASE_LETTER]: /[a-z]/,
    [VALIDATION_RULES_KEYS.UPPERCASE_LETTER]: /[A-Z]/,
    [VALIDATION_RULES_KEYS.NUMERIC]: /\d/,
    [VALIDATION_RULES_KEYS.SPECIAL_CHARS]: /[-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]/,
  };

  // Test the password against the specified rule's regular expression
  return ruleMappings[rule.key]?.test(password) ?? false;
};
