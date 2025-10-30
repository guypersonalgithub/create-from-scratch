import { isStringOnlyWithLetters } from "@packages/utils";
import type { Callback } from "../types";
import { getFullValue } from "../utils";
import { TokenTypes } from "../constants";
import { innerValueFlow } from "./innerValueFlow";

type PropertyFlowArgs = Callback & {
  stopAtValue?: string;
  withinAtRuleDeclaration?: boolean;
};

export const propertyFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  cssInJS,
  extensionParsing,
  stopAtValue = ";",
  withinAtRuleDeclaration,
}: PropertyFlowArgs) => {
  if (!isStringOnlyWithLetters({ str: newTokenValue })) {
    return;
  }

  const fullValue = getFullValue({ input, currentIndex, newTokenValue });
  const { value, currentIndex: endIndex, legitimateValue } = fullValue;
  let followup = fullValue.followup;

  const hasColon = followup.newTokenValue === ":";
  const isProperty = (hasColon || withinAtRuleDeclaration) && legitimateValue;

  tokens.push({
    type: isProperty ? TokenTypes.PROPERTY : TokenTypes.UNKNOWN,
    value: value,
    startIndex: currentIndex - newTokenValue.length,
    endIndex,
  });

  if (!isProperty) {
    return { updatedIndex: followup.updatedIndex - followup.newTokenValue.length };
  }

  const valueStartIndex = followup.skipped ? currentIndex + followup.skipped.length : currentIndex;

  if (!extensionParsing && followup.skipped) {
    tokens.push({
      type: TokenTypes.WHITESPACE,
      value: followup.skipped,
      startIndex: currentIndex,
      endIndex: valueStartIndex,
    });
  }

  if (!hasColon) {
    // if (!extensionParsing) {

    if (withinAtRuleDeclaration) {
      return { updatedIndex: currentIndex };
    }

    if (followup.newTokenValue) {
      tokens.push({
        type: TokenTypes.UNKNOWN,
        value: followup.newTokenValue,
        startIndex: valueStartIndex,
        endIndex: followup.updatedIndex,
      });
    }
    // }

    return { updatedIndex: followup.updatedIndex };
  }

  tokens.push({
    type: TokenTypes.COLON,
    value: followup.newTokenValue,
    startIndex: valueStartIndex,
    endIndex: followup.updatedIndex,
  });

  const response = innerValueFlow({
    tokens,
    input,
    currentIndex: followup.updatedIndex,
    cssInJS,
    extensionParsing,
    stopAtValue,
    stopAtTokenType: TokenTypes.END_OF_LINE,
    addEndOfPropertyToken: true,
  });

  if (!response.newTokenValue) {
    return response;
  }

  followup = response as typeof fullValue.followup;

  const startIndex = followup.updatedIndex - followup.newTokenValue.length;
  const isEndOfLine = followup.newTokenValue === ";";

  if (isEndOfLine) {
    tokens.push({
      type: TokenTypes.END_OF_LINE,
      value: followup.newTokenValue,
      startIndex,
      endIndex: followup.updatedIndex,
    });
  }

  return { updatedIndex: isEndOfLine ? followup.updatedIndex : startIndex };
};
