import { type TokenTypeOptions, TokenTypes } from "../constants";
import { type BaseToken, type OpenedContext } from "../types";
import { spaceFollowUpFlow } from "./genericFlows";
import { typeValueFlow } from "./typeFlows/typeValueFlow";
import { valueFlow } from "./valueFlows/valueFlow";

export type ExpressionInterpolationFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  withinTemplateLiteral?: boolean;
} & TypedFlow;

type TypedFlow =
  | {
      isType?: boolean;
      openedContexts?: never;
    }
  | {
      isType?: never;
      openedContexts: OpenedContext[];
    };

export const expressionInterpolationFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  withinTemplateLiteral,
  isType,
}: ExpressionInterpolationFlowArgs) => {
  if (newTokenValue !== "{") {
    return;
  }

  const type = !withinTemplateLiteral
    ? TokenTypes.JSX_PROPERTY_EXPRESSION_INTERPOLATION
    : TokenTypes.TEMPLATE_LITERAL_EXPRESSION_INTERPOLATION;

  tokens.push({ type, value: newTokenValue });

  const following = spaceFollowUpFlow({ tokens, input, currentIndex, previousTokensSummary });

  const valueCallack = !isType ? valueFlow : typeValueFlow;
  const value = valueCallack({
    tokens,
    input,
    previousTokensSummary,
    openedContexts: openedContexts ?? [],
    ...following.breakpoint,
  });
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
      updatedIndex: potentialCloseInterpolation.space?.updatedIndex ?? value.updatedIndex,
      stop: true,
    };
  }

  tokens.push({ type, value: potentialCloseInterpolation.breakpoint.newTokenValue });

  return {
    updatedIndex: potentialCloseInterpolation.breakpoint.currentIndex,
    stop: false,
  };
};
