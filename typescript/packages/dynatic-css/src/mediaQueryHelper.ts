type MediaQueryHelperArgs = {
  line: string;
  mediaQuery?: string;
};

export const mediaQueryHelper = ({ line, mediaQuery }: MediaQueryHelperArgs) => {
  if (!line.startsWith("@media")) {
    return mediaQuery;
  }

  return line.slice(0, line.length - 1).trim();
};