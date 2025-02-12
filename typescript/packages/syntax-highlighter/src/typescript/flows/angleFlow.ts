import { isCharacterUpperCase, isStringOnlyWithLetters } from "@packages/utils";
import { htmlTags, TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { findLastNonPreviousSpaceToken, findNextBreakpoint, shouldBreak } from "../utils";
import { spaceFollowUpFlow } from "./spaceFlow";
import { genericTypeFlow } from "./genericTypeFlow";
import { tagFlow } from "./tagFlow";
import { parenthesisFlow } from "./parenthesisFlow";

type AngleFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const angleFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: AngleFlowArgs) => {
  if (newTokenValue !== "<") {
    return;
  }

  const followingChar = input[currentIndex + 1];
  if (followingChar === "=") {
    tokens.push({ type: TokenTypes.OPERATOR, value: `${newTokenValue}${followingChar}` });
    previousTokensSummary.push(TokenTypes.OPERATOR);

    return {
      updatedIndex: currentIndex + 1,
      stop: false,
    };
  }

  tokens.push({ type: TokenTypes.ANGLE, value: newTokenValue });

  const lastNonPreviousSpaceToken = findLastNonPreviousSpaceToken({ previousTokensSummary });
  const isMathRelated =
    lastNonPreviousSpaceToken === TokenTypes.VARIABLE ||
    lastNonPreviousSpaceToken === TokenTypes.FUNCTION ||
    lastNonPreviousSpaceToken === TokenTypes.NUMBER;
  if (isMathRelated) {
    return {
      updatedIndex: currentIndex,
      stop: false,
    };
  }

  let isAngleType = false;
  let propertyIndex: number | undefined = undefined;

  const { breakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (
    isStringOnlyWithLetters({ str: breakpoint.newTokenValue }) ||
    breakpoint.newTokenValue[0] === "_"
  ) {
    tokens.push({ type: TokenTypes.JSX, value: breakpoint.newTokenValue });
    propertyIndex = tokens.length - 1;

    const {
      updatedIndex,
      stop,
      isType = false,
    } = genericTypeFlow({
      tokens,
      input,
      currentIndex: breakpoint.currentIndex,
      previousTokensSummary,
      propertyIndex,
    });

    if (stop) {
      return {
        updatedIndex,
        stop,
      };
    }

    currentIndex = updatedIndex;
    isAngleType = isType;
  } else if (breakpoint.newTokenValue === ">") {
    // tagFlow
  } else {
    return {
      updatedIndex: currentIndex - 1,
      stop: true,
    };
  }

  const { breakpoint: nextBreakpoint } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (nextBreakpoint.newTokenValue !== ">") {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.ANGLE, value: nextBreakpoint.newTokenValue });

  if (!isAngleType) {
    const {
      updatedIndex,
      stop,
      isType = false,
    } = tagFlow({
      tokens,
      input,
      currentIndex: nextBreakpoint.currentIndex,
      previousTokensSummary,
    });

    if (!isType) {
      return {
        updatedIndex,
        stop,
      };
    }

    isAngleType = isType;
  }

  const { breakpoint: followUp } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: nextBreakpoint.currentIndex,
    previousTokensSummary,
  });

  const parenthesis = parenthesisFlow({ tokens, input, previousTokensSummary, ...followUp });

  if (!parenthesis) {
    return {
      updatedIndex: nextBreakpoint.currentIndex,
      stop: false,
    };
  }

  if (propertyIndex !== undefined) {
    tokens[propertyIndex].type = TokenTypes.TYPE;
  }

  return { ...parenthesis, isFunction: true };
};

type IdentifyFirstTagValueArgs = {
  input: string;
  currentIndex: number;
  tokens: BaseToken[];
};

const identifyFirstTagValue = ({ input, currentIndex, tokens }: IdentifyFirstTagValueArgs) => {
  const firstBreakpoint = findNextBreakpoint({ input, currentIndex });
  const firstChar = firstBreakpoint.newTokenValue[0];
  const isFirstCharacterAcceptable =
    !shouldBreak({ currentChar: firstChar }) &&
    (isStringOnlyWithLetters({ str: firstChar }) || firstChar === "_");

  if (!isFirstCharacterAcceptable && firstChar !== ">") {
    return {
      input,
      currentIndex,
      isType: false,
      isTag: false,
      stop: true,
    };
  }

  const isFirstCharUpperCase = isCharacterUpperCase({ currentChar: firstChar });
  if (!isFirstCharUpperCase) {
    const isKnownHTMLTag = htmlTags.has(firstBreakpoint.newTokenValue);
    if (!isKnownHTMLTag) {
      tokens.push({ type: TokenTypes.TYPE, value: firstBreakpoint.newTokenValue });

      return {
        ...firstBreakpoint,
        isType: true,
        isTag: false,
        stop: false,
      };
    }
  }

  return {
    input,
    currentIndex,
    isType: false,
    isTag: false,
    stop: false,
  };
};
