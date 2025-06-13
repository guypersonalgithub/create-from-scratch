import { type TokenTypeOptions, TokenTypes } from "../../../constants";
import { type BaseToken } from "../../../types";
import { spaceFollowUpFlow } from "../../genericFlows";
import { asFlow } from "../asFlow";
import { typeValueFlow } from "../typeValueFlow";

type RegularTypeParenthesisFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const regularTypeParenthesisFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: RegularTypeParenthesisFlowArgs): {
  updatedIndex: number;
  stop: boolean;
} => {
  const startsWithParenthesis = newTokenValue === "(";

  if (startsWithParenthesis) {
    tokens.push({ type: TokenTypes.TYPE_PARENTHESIS, value: newTokenValue });

    const { breakpoint, space } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex,
      previousTokensSummary,
    });
    const followup = regularTypeParenthesisFlow({
      tokens,
      input,
      previousTokensSummary,
      ...breakpoint,
    });

    // if (!followup) {
    //   return {
    //     updatedIndex: space?.updatedIndex ?? currentIndex,
    //     stop: true,
    //   };
    // }

    if (followup.stop) {
      return followup;
    }

    const follow = spaceFollowUpFlow({
      tokens,
      input,
      previousTokensSummary,
      currentIndex: followup.updatedIndex,
    });

    newTokenValue = follow.breakpoint.newTokenValue;
    currentIndex = follow.breakpoint.currentIndex;
  }

  const type = typeValueFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary });

  if ((!startsWithParenthesis && !type.addedNewToken) || type.stop) {
    return {
      updatedIndex: type.updatedIndex,
      stop: true,
    };
  }

  let { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    previousTokensSummary,
    currentIndex: type.updatedIndex,
  });

  const potentialAs = asFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  if (potentialAs) {
    if (potentialAs.stop) {
      return potentialAs;
    }

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      previousTokensSummary,
      currentIndex: potentialAs.updatedIndex,
    });
    breakpoint = followup.breakpoint;
    space = followup.space;
  }

  // const attemptedAndOr = typeAndOrFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  // if (attemptedAndOr) {
  //   if (attemptedAndOr.stop) {
  //     return attemptedAndOr;
  //   }

  //   const followup = spaceFollowUpFlow({
  //     tokens,
  //     input,
  //     previousTokensSummary,
  //     currentIndex: attemptedAndOr.updatedIndex,
  //   });
  //   breakpoint = followup.breakpoint;
  //   space = followup.space;
  // }

  if (breakpoint.newTokenValue !== ")") {
    return {
      updatedIndex: space?.updatedIndex ?? type.updatedIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.TYPE_PARENTHESIS, value: breakpoint.newTokenValue });

  return {
    updatedIndex: breakpoint.currentIndex,
    stop: false,
  };
};
