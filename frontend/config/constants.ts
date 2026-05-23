export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$/;
export const passwordRequirements = {
  minLength: 8,
  maxLength: 20,
  requiresLowercase: true,
  requiresUppercase: true,
  requiresNumber: true,
  requiresSpecialChar: true,
};
