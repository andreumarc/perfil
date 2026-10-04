/**
 * Dominios de correo personal más habituales. El formulario exige email
 * corporativo: filtra curiosos y mejora la calidad del lead.
 */
export const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.es",
  "hotmail.fr",
  "hotmail.co.uk",
  "outlook.com",
  "outlook.es",
  "live.com",
  "live.es",
  "msn.com",
  "yahoo.com",
  "yahoo.es",
  "yahoo.co.uk",
  "yahoo.fr",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "pm.me",
  "gmx.com",
  "gmx.es",
  "gmx.de",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "yandex.ru",
  "telefonica.net",
  "movistar.es",
  "orange.es",
  "wanadoo.es",
  "terra.es",
  "ya.com",
  "ono.com",
  "mixmail.com",
  "latinmail.com",
  "hush.com",
  "tutanota.com",
  "fastmail.com",
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "temp-mail.org",
  "yopmail.com",
]);

export function emailDomain(email: string): string {
  return email.trim().toLowerCase().split("@")[1] ?? "";
}

export function isFreeEmail(email: string): boolean {
  return FREE_EMAIL_DOMAINS.has(emailDomain(email));
}
