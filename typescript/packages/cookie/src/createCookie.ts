import { CookieOptions } from "./types";

type CreateCookieArgs = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export const createCookie = ({ name, value, options = {} }: CreateCookieArgs) => {
  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);
  let cookie = `${encodedName}=${encodedValue}`;

  if (options.maxAge != null) {
    cookie += `; Max-Age=${options.maxAge}`;
  }

  if (options.expires) {
    cookie += `; Expires=${options.expires.toUTCString()}`;
  }

  if (options.domain) {
    cookie += `; Domain=${options.domain}`;
  }

  if (options.path) {
    cookie += `; Path=${options.path}`;
  }

  if (options.httpOnly) {
    cookie += `; HttpOnly`;
  }

  if (options.secure) {
    cookie += `; Secure`;
  }

  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite}`;
  }

  return cookie;
};
