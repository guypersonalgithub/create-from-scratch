import { isAlphaNumeric } from "@packages/utils";

type GetDynaticCSSTextToParseArgs = {
  text: string;
  identifiers: string[];
};

export const getDynaticCSSTextToParse = ({ text, identifiers }: GetDynaticCSSTextToParseArgs) => {
  let startIndex = 0;
  let endIndex = 0;
  const identifiersSet = new Set<string>(identifiers);
  const dynaticCSSSections: { start: number; end: number }[] = [];

  while (text.length > endIndex) {
    const current = text[endIndex];

    if (current === "`") {
      const currentWord = text.slice(startIndex, endIndex).trim();
      if (identifiersSet.has(currentWord)) {
        const start = endIndex + 1;
        let currentIndex = start;

        while (text.length > currentIndex) {
          const current = text[currentIndex];

          if (current === "`") {
            dynaticCSSSections.push({ start, end: currentIndex });
            break;
          } else if (current === "$") {
            const followup = text[currentIndex + 1];
            if (followup === "{") {
              const updated = iterateOverTemplateLiteralExpression({
                text,
                currentIndex: currentIndex + 2,
              });

              currentIndex = updated.currentIndex;
            }
          }

          currentIndex++;
        }

        startIndex = currentIndex + 1;
        endIndex = startIndex;
        continue;
      }

      startIndex = endIndex + 1;
      endIndex = startIndex;
    } else if (!isAlphaNumeric({ str: current })) {
      startIndex = endIndex + 1;
      endIndex = startIndex;
    }

    endIndex++;
  }

  return dynaticCSSSections;
};

type IterateOverTemplateLiteralExpressionArgs = {
  text: string;
  currentIndex: number;
};

const iterateOverTemplateLiteralExpression = ({
  text,
  currentIndex,
}: IterateOverTemplateLiteralExpressionArgs) => {
  let amountOfCurlyBrackets = 1;

  while (text.length > currentIndex) {
    const current = text[currentIndex];

    if (current === "{") {
      amountOfCurlyBrackets++;
    } else if (current === "}") {
      amountOfCurlyBrackets--;
    }

    if (amountOfCurlyBrackets === 0) {
      break;
    }

    currentIndex++;
  }

  return { currentIndex };
};
