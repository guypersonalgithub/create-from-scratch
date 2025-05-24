type ParseCookiesArgs = {
  cookieHeader?: string;
};

export const parseCookies = ({ cookieHeader }: ParseCookiesArgs) => {
  const cookies: Record<string, string> = {};

  if (!cookieHeader) {
    return cookies;
  }

  const pairs = cookieHeader.split(";");

  for (const pair of pairs) {
    const [rawKey, ...rest] = pair.trim().split("=");
    if (!rawKey || rest.length === 0) {
      continue;
    }

    const key = decodeURIComponent(rawKey.trim());
    const value = decodeURIComponent(rest.join("=").trim());

    cookies[key] = value;
  }

  return cookies;
};
