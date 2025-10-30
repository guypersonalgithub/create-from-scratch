import type { BaseToken } from "@packages/parse-css";

type GetCurrentOffsetTokensArgs = {
  offset: number;
  tokens: BaseToken[];
  value: string;
};

export const getCurrentOffsetTokens = ({ offset, tokens, value }: GetCurrentOffsetTokensArgs) => {
  let currentTokenIndex: number | undefined;

  if (tokens.length > 0) {
    for (let i = tokens.length - 1; tokens.length >= 0; i--) {
      const current = tokens[i];

      if (current.startIndex <= offset) {
        currentTokenIndex = i;
        break;
      }
    }
  }

  if (currentTokenIndex === undefined) {
    return;
  }

  const currentToken = tokens[currentTokenIndex];
  if (!currentToken) {
    return;
  }

  // Auto complete after the property was already auto completed.
  if (
    value.length > 1 &&
    currentToken.type === "property" &&
    value.startsWith(currentToken.value)
  ) {
    const actualToken = tokens[currentTokenIndex + 1];
    if (actualToken.type === "colon") {
      return { propertyToken: currentToken, currentToken: actualToken };
    }
  }

  if (currentToken.type === "property") {
    const nextToken = tokens[currentTokenIndex + 1];
    if (nextToken?.type === "colon") {
      return;
    }

    const previousToken = tokens[currentTokenIndex - 1];
    if (previousToken) {
      if (previousToken.type === "at-open-parenthesis") {
        return { currentToken, previousToken };
      } else {
        let current = currentTokenIndex - 2;
        while (current > 0) {
          const previousToken = tokens[current];

          if (
            !previousToken ||
            previousToken.value === ";" ||
            previousToken.value === "{" ||
            previousToken.value === "}"
          ) {
            break;
          }

          if (previousToken.type === "at-open-parenthesis") {
            return { currentToken, previousToken };
          }

          current--;
        }
      }
    }
  } else if (currentToken.type === "unknown" || currentToken.type === "string") {
    let current = currentTokenIndex - 1;
    while (current > 0) {
      const prevToken = tokens[current];
      if (prevToken.type === "end-of-line") {
        return { currentToken };
      }

      const previousToken = tokens[current - 1];

      if (prevToken.type === "colon") {
        if (previousToken?.type !== "property") {
          return;
        }

        return { currentToken, propertyToken: previousToken };
      } else if (
        !previousToken ||
        previousToken.value === ";" ||
        previousToken.value === "{" ||
        previousToken.value === "}"
      ) {
        return { currentToken };
      }

      current--;
    }
  } else if (currentToken.type === "colon") {
    const previousToken = tokens[currentTokenIndex - 1];
    if (previousToken?.type !== "property") {
      return;
    }

    return { currentToken, propertyToken: previousToken };
  }

  return { currentToken };
};
