import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { spaceFollowUpFlow } from "./spaceFlow";
import { stringFlow } from "./stringFlow";
import { valueFlow } from "./valueFlow";

type ExpressionInterpolationFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const expressionInterpolationFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: ExpressionInterpolationFlowArgs) => {
  if (newTokenValue !== "{") {
    return;
  }

  tokens.push({ type: TokenTypes.JSX_PROPERTY_EXPRESSION_INTERPOLATION, value: newTokenValue });

  const following = spaceFollowUpFlow({ tokens, input, currentIndex, previousTokensSummary });

  const value = valueFlow({ tokens, input, previousTokensSummary, ...following.breakpoint });
  if (value.stop) {
    return {
      updatedIndex: following.space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  const potentialCloseInterpolation = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: value.updatedIndex,
    previousTokensSummary,
  });

  if (potentialCloseInterpolation.breakpoint.newTokenValue !== "}") {
    return {
      updatedIndex: value.updatedIndex,
      stop: true,
    };
  }

  tokens.push({
    type: TokenTypes.JSX_PROPERTY_EXPRESSION_INTERPOLATION,
    value: potentialCloseInterpolation.breakpoint.newTokenValue,
  });

  return {
    updatedIndex: potentialCloseInterpolation.breakpoint.currentIndex,
    stop: false,
  };
};
