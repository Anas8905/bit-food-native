export const MAX_E164 = 15;

export const formatPhoneNumber = (input: string | undefined, countryCode: string): {
    national: string | undefined;
    phoneNumber: string;
    maxNationalDigits: number;
} => {
  const digits = input?.replace(/[^\d]/g, "");
  const maxNationalDigits = Math.max(0, MAX_E164 - countryCode.length);
  const national = digits?.slice(0, maxNationalDigits);
  const phoneNumber = `${countryCode}${national}`;

  return { national, phoneNumber, maxNationalDigits };
}
