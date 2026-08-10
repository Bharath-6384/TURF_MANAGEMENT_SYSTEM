export interface ValidationResult {
  isValid          : boolean;
  error            : string;
}

export interface PasswordRequirement {
  id               : string;
  label            : string;
  test             : (value: string) => boolean;
}

export interface PasswordRuleStatus {
  [key: string]    : boolean;
  allOk            : boolean;
}