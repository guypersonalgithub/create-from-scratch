type ParseHelpersArgs = {
  line: string;
  mediaQuery?: string;
  pseudoClass?: string;
};

export const parseHelpers = ({ line, mediaQuery, pseudoClass }: ParseHelpersArgs) => {
  const lastChar = line[line.length - 1];

  if (lastChar === "}") {
    if (pseudoClass) {
      return { mediaQuery, pseudoClass: undefined, continue: true };
    } else if (mediaQuery) {
      return { mediaQuery: undefined, pseudoClass: undefined, continue: true };
    }
  } else if (lastChar === "{") {
    if (!mediaQuery) {
      const newMediaQuery = mediaQueryHelper({ line, mediaQuery });
      if (!newMediaQuery) {
        const newPseudoClass = pseudoClassHelper({ line, pseudoClass });

        return { mediaQuery: undefined, pseudoClass: newPseudoClass, continue: true };
      }

      return { mediaQuery: newMediaQuery, pseudoClass: undefined, continue: true };
    } else if (mediaQuery && !pseudoClass) {
      return { mediaQuery, pseudoClass: pseudoClassHelper({ line, pseudoClass }), continue: true };
    }
  }

  return { mediaQuery, pseudoClass, continue: false };
};

type MediaQueryHelperArgs = {
  line: string;
  mediaQuery?: string;
};

const mediaQueryHelper = ({ line, mediaQuery }: MediaQueryHelperArgs) => {
  if (!line.startsWith("@media")) {
    return mediaQuery;
  }

  return line.slice(0, line.length - 1).trim();
};

type PseudoClassHelperArgs = {
  line: string;
  pseudoClass?: string;
};

const pseudoClassHelper = ({ line, pseudoClass }: PseudoClassHelperArgs) => {
  const pseudoClassIndex = line.indexOf(":");
  const originalClass = line.slice(0, pseudoClassIndex);
  if (originalClass !== "&") {
    return pseudoClass;
  }

  return line.slice(pseudoClassIndex, line.length - 1).trim();
};
