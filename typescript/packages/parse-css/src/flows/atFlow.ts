import { isStringOnlyWithLetters } from "@packages/utils";
import { TokenTypes } from "../constants";
import type { Callback } from "../types";
import { getFullValue, spaceCallback } from "../utils";
import { dotFlow } from "./dotFlow";
import { numericValueFlow } from "./numericValueFlow";
import { templateLiteralExpressionFlow } from "./templateLiteralExpressionFlow";
import { atParenthesisFlow } from "./atParenthesisFlow";

const atWords = new Set<string>(["and", "not"]);

const callbacks: Record<string, (args: Callback) => { updatedIndex: number } | undefined> = {
  ".": dotFlow,
  "0": numericValueFlow,
  "1": numericValueFlow,
  "2": numericValueFlow,
  "3": numericValueFlow,
  "4": numericValueFlow,
  "5": numericValueFlow,
  "6": numericValueFlow,
  "7": numericValueFlow,
  "8": numericValueFlow,
  "9": numericValueFlow,
  $: templateLiteralExpressionFlow,
};

export const atFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  extensionParsing,
  cssInJS,
}: Callback) => {
  if (newTokenValue !== "@") {
    return;
  }

  const startIndex = currentIndex - newTokenValue.length;

  const response = getFullValue({
    newTokenValue,
    input,
    currentIndex,
  });

  const { value, legitimateValue } = response;
  const endIndex = startIndex + value.length;

  tokens.push({
    type: legitimateValue ? TokenTypes.AT_KEYWORD : TokenTypes.UNKNOWN,
    value,
    startIndex,
    endIndex,
  });

  if (!legitimateValue) {
    return { updatedIndex: currentIndex };
  }

  let { followup } = response;

  let parenthesisOpened = false;

  while (followup.updatedIndex < input.length) {
    if (followup.newTokenValue === "{") {
      tokens.push({
        type: TokenTypes.OPEN_CURLY_BRACKET,
        value: followup.newTokenValue,
        startIndex: followup.updatedIndex - 1,
        endIndex: followup.updatedIndex,
      });

      break;
    }

    const callback = callbacks[followup.newTokenValue];
    const response = callback?.({
      tokens,
      newTokenValue: followup.newTokenValue,
      input,
      currentIndex: followup.updatedIndex,
      extensionParsing,
      cssInJS,
    });

    if (response) {
      followup = spaceCallback({ input, currentIndex: response.updatedIndex });
      continue;
    }

    const parenthesis = atParenthesisFlow({
      tokens,
      newTokenValue: followup.newTokenValue,
      input,
      currentIndex: followup.updatedIndex,
      extensionParsing,
      cssInJS,
    });

    if (parenthesis) {
      followup = spaceCallback({ input, currentIndex: parenthesis.updatedIndex });
      parenthesisOpened = parenthesis.isOpen;
      continue;
    }

    if (isStringOnlyWithLetters({ str: followup.newTokenValue })) {
      const isAtWord = atWords.has(followup.newTokenValue);

      tokens.push({
        type: parenthesisOpened
          ? TokenTypes.PROPERTY
          : !isAtWord
            ? TokenTypes.STRING
            : TokenTypes.AT_WORD,
        value: followup.newTokenValue,
        startIndex: followup.updatedIndex - followup.newTokenValue.length,
        endIndex: followup.updatedIndex,
      });
    } else if (
      followup.newTokenValue === ">" ||
      followup.newTokenValue === "<" ||
      followup.newTokenValue === "="
    ) {
      tokens.push({
        type: TokenTypes.AT_OPERATOR,
        value: followup.newTokenValue,
        startIndex: followup.updatedIndex - followup.newTokenValue.length,
        endIndex: followup.updatedIndex,
      });
    }

    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
  }

  return { updatedIndex: followup.updatedIndex };
};
