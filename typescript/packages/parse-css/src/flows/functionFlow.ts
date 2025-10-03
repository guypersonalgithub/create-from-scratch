import { TokenTypes } from "../constants";
import type { Callback } from "../types";
import { innerValueFlow } from "./innerValueFlow";

type FunctionFlowArgs = Callback & {
  value: string;
  startIndex: number;
};

export const functionFlow = ({
  tokens,
  value,
  newTokenValue,
  input,
  startIndex,
  currentIndex,
  extensionParsing,
}: FunctionFlowArgs) => {
  if (newTokenValue !== "(") {
    return;
  }

  const parenthesisStart = currentIndex - newTokenValue.length;

  tokens.push({
    type: TokenTypes.FUNCTION,
    value,
    startIndex,
    endIndex: parenthesisStart,
  });

  tokens.push({
    type: TokenTypes.OPEN_PARENTHESIS,
    value: newTokenValue,
    startIndex: currentIndex,
    endIndex: parenthesisStart,
  });

  const response = innerValueFlow({
    tokens,
    input,
    currentIndex,
    extensionParsing,
    stopAtValue: ")",
    stopAtTokenType: TokenTypes.CLOSE_PARENTHESIS,
  });

  if (!response.newTokenValue) {
    return response;
  }

  let followup = response;

  if (followup.newTokenValue === ")") {
    tokens.push({
      type: TokenTypes.CLOSE_PARENTHESIS,
      value: followup.newTokenValue,
      startIndex: followup.updatedIndex - followup.newTokenValue.length,
      endIndex: followup.updatedIndex,
    });
  }

  return { updatedIndex: followup.updatedIndex };
};
