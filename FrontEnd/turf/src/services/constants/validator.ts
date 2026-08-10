import {ValidationResult ,PasswordRequirement ,PasswordRuleStatus} from "../../model/constants/validatormodel";

// export const validatePincode = (value: string): ValidationResult => {
//   if (!/^\d+$/.test(value)) {
//     return { isValid: false, error: "Pincode must contain only numbers" };
//   }
//   if (value.length !== 6) {
//     return { isValid: false, error: "Pincode must be exactly 6 digits" };
//   }
//   return { isValid: true, error: "" };
// };

export const passwordRequirements: PasswordRequirement[] = [
  { id: "length",  label: "At least 8 characters",                  test: (v) => (v || "").length >= 8 },
  { id: "upper",   label: "Include an uppercase letter (A–Z)",      test: (v) => /[A-Z]/.test(v || "") },
  { id: "lower",   label: "Include a lowercase letter (a–z)",       test: (v) => /[a-z]/.test(v || "") },
  { id: "number",  label: "Include a number (0–9)",                 test: (v) => /\d/.test(v || "") },
  { id: "special", label: "Include a special char (@ $ ! % * ? &)", test: (v) => /[@$!%*?&]/.test(v || "") },
];


export const getPasswordRuleStatus = (value: string = ""): PasswordRuleStatus => {
  const statuses: Record<string, boolean> = {};
  let allOk = true;

  for (const rule of passwordRequirements) {
    const ok = rule.test(value);
    statuses[rule.id] = ok;
    if (!ok) allOk = false;
  }

  return { ...statuses, allOk };
};

export const validatePassword = (value: string): ValidationResult => {
  if (!value) {
    return { isValid: false, error: "Password is required" };
  }

  const { allOk } = getPasswordRuleStatus(value);

  if (!allOk) {
    return {
      isValid: false,
      error:
        "Password must be 8+ chars and include uppercase, lowercase, number, and special char",
    };
  }

  return { isValid: true, error: "" };
};


export const validateEmail = (email: string): ValidationResult => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, error: "Email is required" };
  }
  if (!regex.test(email)) {
    return { isValid: false, error: "Enter a valid email address" };
  }

  return { isValid: true, error: "" };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: "Phone number is required" };
  }

  if (!/^\d+$/.test(phone)) {
    return { isValid: false, error: "Phone number must contain only numbers" };
  }

  if (phone.length !== 10) {
    return { isValid: false, error: "Phone number must be exactly 10 digits" };
  }

  return { isValid: true, error: "" };
};