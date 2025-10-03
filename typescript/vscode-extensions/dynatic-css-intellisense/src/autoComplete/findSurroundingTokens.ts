import * as vscode from "vscode";
import { findCurrentSection } from "./findCurrentSection";
import type { BaseToken } from "@packages/parse-css";

export let currentTokens = new Map<string, BaseToken>();

type FindSurroundingTokensArgs = {
  document: vscode.TextDocument;
  position: vscode.Position;
  value: string;
};

export const findSurroundingTokens = ({ document, position, value }: FindSurroundingTokensArgs) => {
  currentTokens = new Map();
  const currentSection = findCurrentSection({ document, position });
  if (!currentSection) {
    return;
  }

  const offset = document.offsetAt(position);
  const { tokens } = currentSection;

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

  if (!currentTokenIndex) {
    return;
  }

  const currentToken = tokens[currentTokenIndex];
  // console.log(currentToken, offset);
  if (
    value.length > 1 &&
    currentToken.type === "property" &&
    value.startsWith(currentToken.value)
  ) {
    const actualToken = tokens[currentTokenIndex + 1];
    if (actualToken.type === "colon") {
      currentTokens.set("currentToken", actualToken);
      currentTokens.set("propertyToken", currentToken);

      return { propertyToken: currentToken, currentToken: actualToken };
    }
  }

  if (!currentToken) {
    return;
  }

  if (currentToken.type === "property") {
    const nextToken = tokens[currentTokenIndex + 1];
    if (nextToken?.type === "colon") {
      return;
    }

    currentTokens.set("currentToken", currentToken);

    const previousToken = tokens[currentTokenIndex - 1];
    if (previousToken) {
      if (previousToken.type === "at-open-parenthesis") {
        currentTokens.set("previousToken", previousToken);
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
            currentTokens.set("previousToken", previousToken);
            break;
          }
        }
      }
    }
  } else if (currentToken.type === "unknown" || currentToken.type === "string") {
    let current = currentTokenIndex - 1;
    let broke = false;
    while (current > 0) {
      const prevToken = tokens[current];
      if (prevToken.type === "end-of-line") {
        currentTokens.set("currentToken", currentToken);
        broke = true;
        break;
      }

      const previousToken = tokens[current - 1];

      if (prevToken.type === "colon") {
        if (previousToken?.type !== "property") {
          return;
        }

        currentTokens.set("currentToken", currentToken);
        currentTokens.set("propertyToken", previousToken);
        broke = true;
        break;
      } else if (
        !previousToken ||
        previousToken.value === ";" ||
        previousToken.value === "{" ||
        previousToken.value === "}"
      ) {
        currentTokens.set("currentToken", currentToken);
        broke = true;
        break;
      }

      current--;
    }

    if (!broke) {
      currentTokens.set("currentToken", currentToken);
    }
  } else if (currentToken.type === "colon") {
    const previousToken = tokens[currentTokenIndex - 1];
    if (previousToken?.type !== "property") {
      return;
    }

    currentTokens.set("currentToken", currentToken);
    currentTokens.set("propertyToken", previousToken);
  }

  return { currentToken };
};
