import { createHmac, timingSafeEqual } from "crypto";

type SignArgs = {
  value: string;
  secret: string;
  signaturePrefix?: string;
};

export const sign = ({ value, secret, signaturePrefix = ".s:" }: SignArgs) => {
  const hmac = createHmac("sha256", secret).update(value).digest("base64");
  return `${value}${signaturePrefix}${hmac}`;
};

type VerifyArgs = {
  signedValue: string;
  secret: string;
  signaturePrefix?: string;
};

export const verify = ({ signedValue, secret, signaturePrefix = ".s:" }: VerifyArgs) => {
  const idx = signedValue.lastIndexOf(signaturePrefix);
  if (idx === -1) {
    return false;
  }

  const value = signedValue.slice(0, idx);
  const signature = signedValue.slice(idx + signaturePrefix.length);

  const expectedSignature = createHmac("sha256", secret).update(value).digest("base64");

  const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  return valid ? value : false;
};
