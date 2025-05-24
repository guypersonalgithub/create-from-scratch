import { parseCookies } from "../parseCookies";
import { verify } from "./utils";

type ParseSignedCookiesArgs = {
  cookieHeader?: string;
  secret: string;
  signaturePrefix?: string;
};

export const parseSignedCookies = ({
  cookieHeader,
  secret,
  signaturePrefix,
}: ParseSignedCookiesArgs) => {
  const all = parseCookies({ cookieHeader });
  const cookies: Record<string, string> = {};
  const signedCookies: Record<string, string> = {};

  for (const [key, value] of Object.entries(all)) {
    const unsigned = verify({ signedValue: value, secret, signaturePrefix });
    if (unsigned !== false) {
      signedCookies[key] = unsigned;
    } else {
      cookies[key] = value;
    }
  }

  return { cookies, signedCookies };
};
