import { isNumeric } from "@packages/string-utils";
import { type BaseToken } from "../../types";
import {
  acceptableCharactersAfterANumber,
  type TokenTypeOptions,
  TokenTypes,
} from "../../constants";
import { findNextBreakpoint } from "../../utils";

type NumericFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const numericFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: NumericFlowArgs) => {
  if (!isNumeric({ str: newTokenValue })) {
    return;
  }

  let value = newTokenValue;

  const potentialDot = findNextBreakpoint({ input, currentIndex });
  let potentialProblematicFollowingChar: ReturnType<typeof findNextBreakpoint> | undefined;

  if (potentialDot.newTokenValue === ".") {
    value += potentialDot.newTokenValue;

    const following = findNextBreakpoint({ input, currentIndex: potentialDot.currentIndex });
    const isAnAcceptableCharacterAfterANumber = acceptableCharactersAfterANumber.has(
      following.newTokenValue,
    );

    if (!isNumeric({ str: following.newTokenValue }) && !isAnAcceptableCharacterAfterANumber) {
      tokens.push({ type: TokenTypes.NUMBER, value });
      previousTokensSummary.push(TokenTypes.NUMBER);

      return {
        updatedIndex: potentialDot.currentIndex,
        stop: true,
      };
    }

    if (!isAnAcceptableCharacterAfterANumber) {
      value += following.newTokenValue;
      currentIndex = following.currentIndex;
    } else {
      currentIndex = potentialDot.currentIndex;
      potentialProblematicFollowingChar = following;
    }
  }

  tokens.push({ type: TokenTypes.NUMBER, value });
  previousTokensSummary.push(TokenTypes.NUMBER);

  if (!potentialProblematicFollowingChar) {
    potentialProblematicFollowingChar = findNextBreakpoint({ input, currentIndex });
  }

  if (
    !acceptableCharactersAfterANumber.has(potentialProblematicFollowingChar.newTokenValue) &&
    potentialProblematicFollowingChar.newTokenValue !== ")" // TODO: Add check if already inside a parenthesis.
  ) {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
