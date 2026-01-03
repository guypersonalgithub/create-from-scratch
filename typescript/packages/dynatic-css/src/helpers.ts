import { descendantSelectorHelper } from "./descendantSelectorHelper";
import { mediaQueryHelper } from "./mediaQueryHelper";
import { pseudoClassHelper } from "./pseudoClassHelper";

type ParseHelpersArgs = {
  line: string;
  mediaQuery?: string;
  pseudoClass?: string;
  descendantSelector?: string;
};

export const parseHelpers = ({
  line,
  mediaQuery,
  pseudoClass,
  descendantSelector,
}: ParseHelpersArgs) => {
  const lastChar = line[line.length - 1];

  if (lastChar === "}") {
    if (descendantSelector) {
      return { mediaQuery, pseudoClass, descendantSelector: undefined, continue: true };
    } else if (pseudoClass) {
      return { mediaQuery, pseudoClass: undefined, descendantSelector: undefined, continue: true };
    } else if (mediaQuery) {
      return {
        mediaQuery: undefined,
        pseudoClass: undefined,
        descendantSelector: undefined,
        continue: true,
      };
    }
  } else if (lastChar === "{") {
    if (!descendantSelector) {
      // TODO: Refactor.
      const newDescendantSelector = descendantSelectorHelper({ line, descendantSelector });
      if (!newDescendantSelector) {
        const newMediaQuery = mediaQueryHelper({ line, mediaQuery });
        if (!newMediaQuery) {
          const newPseudoClass = pseudoClassHelper({ line, pseudoClass });

          return {
            mediaQuery: undefined,
            pseudoClass: newPseudoClass,
            descendantSelector,
            continue: true,
          };
        }

        return {
          mediaQuery: newMediaQuery,
          pseudoClass: undefined,
          descendantSelector,
          continue: true,
        };
      }

      return {
        mediaQuey: undefined,
        pseudoClass: undefined,
        descendantSelector: newDescendantSelector,
        continue: true,
      };
    } else if (!mediaQuery) {
      const newMediaQuery = mediaQueryHelper({ line, mediaQuery });
      if (!newMediaQuery) {
        const newPseudoClass = pseudoClassHelper({ line, pseudoClass });

        return {
          mediaQuery: undefined,
          pseudoClass: newPseudoClass,
          descendantSelector: undefined,
          continue: true,
        };
      }

      return {
        mediaQuery: newMediaQuery,
        pseudoClass: undefined,
        descendantSelector,
        continue: true,
      };
    } else if (mediaQuery && !pseudoClass) {
      return {
        mediaQuery,
        pseudoClass: pseudoClassHelper({ line, pseudoClass }),
        descendantSelector,
        continue: true,
      };
    }
  }

  return { mediaQuery, pseudoClass, descendantSelector, continue: false };
};
