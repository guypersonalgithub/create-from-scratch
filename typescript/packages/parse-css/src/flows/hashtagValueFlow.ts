import { isAlphaNumeric } from "@packages/utils";
import { TokenTypes } from "../constants";
import type { Callback } from "../types";
import { spaceCallback } from "../utils";

type HashtagValueFlowArgs = Callback & {
  stopAtValue: string;
  stopAtTokenType: (typeof TokenTypes)[keyof typeof TokenTypes];
  startIndex: number;
  addEndOfPropertyToken?: boolean;
};

export const hashtagValueFlow = ({
  tokens,
  newTokenValue,
  input,
  startIndex,
  currentIndex,
  extensionParsing,
  stopAtValue,
  stopAtTokenType,
  addEndOfPropertyToken,
}: HashtagValueFlowArgs) => {
  if (newTokenValue !== "#") {
    return;
  }

  let value = "";
  let endIndex = startIndex;

  let followup = spaceCallback({ input, currentIndex });

  if (followup.skipped) {
    if (!extensionParsing) {
      tokens.push({
        type: TokenTypes.UNKNOWN,
        value,
        startIndex: currentIndex - newTokenValue.length,
        endIndex: currentIndex,
      });

      tokens.push({
        type: TokenTypes.WHITESPACE,
        value: followup.skipped,
        startIndex: currentIndex,
        endIndex: currentIndex + followup.skipped.length,
      });
    }

    tokens.push({
      type: TokenTypes.UNKNOWN,
      value,
      startIndex: currentIndex,
      endIndex: followup.updatedIndex,
    });
  }

  while (
    followup.updatedIndex < input.length &&
    !followup.skipped &&
    isAlphaNumeric({ str: followup.newTokenValue })
  ) {
    value += followup.newTokenValue;
    endIndex = followup.updatedIndex;
    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
  }

  const TokenType = isColor({ value });
  const fullValue = `${newTokenValue}${value}`;

  tokens.push({
    type: TokenType,
    value: fullValue,
    startIndex,
    endIndex,
  });

  const isEndOfProperty = followup.newTokenValue === stopAtValue;

  if (!extensionParsing || addEndOfPropertyToken) {
    const newEndIndex = followup.skipped ? endIndex + followup.skipped.length : endIndex;

    if (!extensionParsing && followup.skipped) {
      tokens.push({
        type: TokenTypes.WHITESPACE,
        value: followup.skipped,
        startIndex: endIndex,
        endIndex: newEndIndex,
      });
    }

    if (isEndOfProperty) {
      tokens.push({
        type: stopAtTokenType,
        value: followup.newTokenValue,
        startIndex: newEndIndex,
        endIndex: followup.updatedIndex,
      });
    }
  }

  return { updatedIndex: followup.updatedIndex, isEndOfProperty };
};

type IsColorArgs = {
  value: string;
};

const isColor = ({ value }: IsColorArgs) => {
  const length = value.length;
  const acceptableColorLengths = new Set([3, 4, 6, 8]);

  if (!acceptableColorLengths.has(length)) {
    return TokenTypes.UNKNOWN;
  }

  return TokenTypes.COLOR;
};
