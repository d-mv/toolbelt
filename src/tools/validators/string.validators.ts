const EMAIL_REGEXP = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;

export function isEmail(s?: string): boolean {
  return !!s && EMAIL_REGEXP.test(s);
}
