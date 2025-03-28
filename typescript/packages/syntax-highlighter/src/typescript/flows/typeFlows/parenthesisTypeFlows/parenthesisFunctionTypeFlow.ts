import { TokenTypeOptions, TokenTypes } from "../../../constants";
import { BaseToken } from "../../../types";
import { arrowFlow } from "../../functionFlows";
import { spaceFollowUpFlow } from "../../genericFlows";
import { typeValueFlow } from "../typeValueFlow";

type ParenthesisFunctionTypeFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  space?: {
    updatedIndex: number;
    stop: boolean;
  };
  previousUpdatedIndex: number;
};

export const parenthesisFunctionTypeFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  space,
  previousUpdatedIndex,
}: ParenthesisFunctionTypeFlowArgs) => {
  if (newTokenValue !== ")") {
    return {
      updatedIndex: space?.updatedIndex ?? previousUpdatedIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.TYPE_PARENTHESIS, value: newTokenValue });

  const nextInLine = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: currentIndex,
    previousTokensSummary,
  });
  const potentialArrow = arrowFlow({
    tokens,
    input,
    previousTokensSummary,
    ...nextInLine.breakpoint,
  });

  if (!potentialArrow) {
    return {
      updatedIndex: nextInLine.space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  if (potentialArrow.stop) {
    return potentialArrow;
  }

  const potentialReturn = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: potentialArrow.updatedIndex,
    previousTokensSummary,
  });
  const returnType = typeValueFlow({
    tokens,
    input,
    previousTokensSummary,
    ...potentialReturn.breakpoint,
  });

  if (!returnType.addedNewToken || returnType.stop) {
    return {
      updatedIndex: returnType.updatedIndex,
      stop: true,
    };
  }

  return {
    updatedIndex: returnType.updatedIndex,
    stop: false,
  };
};
