import { isNumeric, isStringOnlyWithLetters } from "@packages/string-utils";
import type { Callback } from "../types";
import { getFullValue, spaceCallback } from "../utils";
import { numericValueFlow } from "./numericValueFlow";
import { TokenTypes } from "../constants";
import { hashtagValueFlow } from "./hashtagValueFlow";
import { functionFlow } from "./functionFlow";
import { templateLiteralExpressionFlow } from "./templateLiteralExpressionFlow";
import { cssColorsSet } from "../cssColorsSet";

type InnerValueFlowArgs = Omit<Callback, "newTokenValue"> & {
  stopAtValue: string;
  stopAtTokenType: (typeof TokenTypes)[keyof typeof TokenTypes];
  addEndOfPropertyToken?: boolean;
};

type Return = ReturnType<typeof spaceCallback> | { updatedIndex: number; newTokenValue?: never };

export const innerValueFlow = ({
  tokens,
  input,
  currentIndex,
  extensionParsing,
  stopAtValue,
  cssInJS,
  stopAtTokenType,
  addEndOfPropertyToken,
}: InnerValueFlowArgs): Return => {
  let followup = spaceCallback({ input, currentIndex });

  while (followup.updatedIndex < input.length && followup.newTokenValue !== stopAtValue) {
    if (isNumeric({ str: followup.newTokenValue })) {
      const { updatedIndex } = numericValueFlow({
        tokens,
        newTokenValue: followup.newTokenValue,
        input,
        startIndex: followup.updatedIndex - followup.newTokenValue.length,
        currentIndex: followup.updatedIndex,
        extensionParsing,
      }) ?? { updatedIndex: followup.updatedIndex };

      followup.updatedIndex = updatedIndex;
    } else if (isStringOnlyWithLetters({ str: followup.newTokenValue })) {
      if (cssColorsSet.has(followup.newTokenValue)) {
        tokens.push({
          type: TokenTypes.COLOR,
          value: followup.newTokenValue,
          startIndex: followup.updatedIndex - followup.newTokenValue.length,
          endIndex: followup.updatedIndex,
        });

        followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
        continue;
      }

      const {
        value,
        legitimateValue,
        followup: furtherFollowup,
      } = getFullValue({
        newTokenValue: followup.newTokenValue,
        input,
        currentIndex: followup.updatedIndex,
      });

      if (legitimateValue && furtherFollowup.newTokenValue === "(") {
        const response = functionFlow({
          tokens,
          value,
          newTokenValue: furtherFollowup.newTokenValue,
          input,
          startIndex: followup.updatedIndex - followup.newTokenValue.length,
          currentIndex: furtherFollowup.updatedIndex,
          extensionParsing,
        });

        if (response) {
          followup = spaceCallback({ input, currentIndex: furtherFollowup.updatedIndex });
          continue;
        }
      }

      tokens.push({
        type: legitimateValue ? TokenTypes.STRING : TokenTypes.UNKNOWN,
        value,
        startIndex: followup.updatedIndex - followup.newTokenValue.length,
        endIndex: followup.updatedIndex,
      });

      if (!legitimateValue) {
        return {
          updatedIndex: furtherFollowup.updatedIndex - furtherFollowup.newTokenValue.length,
        };
      }

      followup = furtherFollowup;
      continue;
    } else if (followup.newTokenValue === "#") {
      const { updatedIndex, isEndOfProperty } = hashtagValueFlow({
        tokens,
        newTokenValue: followup.newTokenValue,
        input,
        startIndex: followup.updatedIndex - followup.newTokenValue.length,
        currentIndex: followup.updatedIndex,
        extensionParsing,
        stopAtValue,
        stopAtTokenType,
        addEndOfPropertyToken,
      }) ?? { updatedIndex: followup.updatedIndex };

      followup.updatedIndex = updatedIndex;

      if (isEndOfProperty) {
        break;
      }
    } else if (followup.newTokenValue === "$") {
      const { updatedIndex } = templateLiteralExpressionFlow({
        tokens,
        newTokenValue: followup.newTokenValue,
        input,
        currentIndex: followup.updatedIndex,
        cssInJS,
        extensionParsing,
      }) ?? { updatedIndex: followup.updatedIndex };

      followup.updatedIndex = updatedIndex;
    } else if (followup.newTokenValue === ",") {
      tokens.push({
        type: TokenTypes.COMMA,
        value: followup.newTokenValue,
        startIndex: followup.updatedIndex - followup.newTokenValue.length,
        endIndex: followup.updatedIndex,
      });
    }

    followup = spaceCallback({ input, currentIndex: followup.updatedIndex });
  }

  return followup;
};
