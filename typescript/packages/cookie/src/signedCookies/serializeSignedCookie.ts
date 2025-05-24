import { createCookie } from "../createCookie";
import { CookieOptions } from "../types";
import { sign } from "./utils";

type SerializeSignedCookieArgs = {
  name: string;
  value: string;
  secret: string;
  options?: CookieOptions;
};

export const serializeSignedCookie = ({
  name,
  value,
  secret,
  options = {},
}: SerializeSignedCookieArgs) => {
  const signedValue = sign({ value, secret });
  return createCookie({ name, value: signedValue, options });
};
