import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";
import { shouldBreak } from "../../utils";
import { spaceFollowUpFlow } from "../genericFlows";
import { genericTypeTemplateFlow } from "./genericTypeTemplateFlow";
// import { typeAndOrFlow } from "./typeAndOrFlow";

type TypeFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const typeFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: TypeFlowArgs) => {
  const firstChar = newTokenValue.charAt(0);
  const isIncorrectTypeName =
    shouldBreak({
      currentChar: firstChar,
    }) && firstChar !== "_";

  if (isIncorrectTypeName) {
    return;
  }

  tokens.push({ type: TokenTypes.TYPE, value: newTokenValue });
  previousTokensSummary.push(TokenTypes.TYPE);

  let { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const potentialGenericTemplate = genericTypeTemplateFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint,
  });
  if (potentialGenericTemplate) {
    currentIndex = potentialGenericTemplate.updatedIndex;

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: potentialGenericTemplate.updatedIndex,
      previousTokensSummary,
    });
    breakpoint = followup.breakpoint;
    space = followup.space;
  }

  while (breakpoint.newTokenValue === "[") {
    tokens.push({ type: TokenTypes.ARRAY_SQUARE_TYPE_BRACKET, value: breakpoint.newTokenValue });

    const followup = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: breakpoint.currentIndex,
      previousTokensSummary,
    });
    if (followup.breakpoint.newTokenValue !== "]") {
      return {
        updatedIndex:
          followup.space?.updatedIndex ?? space?.updatedIndex ?? breakpoint.currentIndex,
        stop: true,
      };
    }

    tokens.push({
      type: TokenTypes.ARRAY_SQUARE_TYPE_BRACKET,
      value: followup.breakpoint.newTokenValue,
    });
    currentIndex = followup.breakpoint.currentIndex;

    const following = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: followup.breakpoint.currentIndex,
      previousTokensSummary,
    });
    breakpoint = following.breakpoint;
    space = following.space;
  }

  // const typeAndOr = typeAndOrFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  // if (!typeAndOr) {
  //   return {
  //     updatedIndex: space?.updatedIndex ?? currentIndex,
  //     stop: false,
  //   };
  // }

  // if (typeAndOr) {
  //   return typeAndOr;
  // }

  return {
    updatedIndex: space?.updatedIndex ?? currentIndex,
    stop: false,
  };
};
