import { type TokenTypeOptions } from "../../constants";
import { type BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { extendsTernaryOperatorTypeFlow } from "./extendsTernaryOperatorTypeFlow";
import { typeValueFlow } from "./typeValueFlow";

type FunctionReturnTypeFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const functionReturnTypeFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: FunctionReturnTypeFlowArgs) => {
  const potentialType = typeValueFlow({
    tokens,
    newTokenValue,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (!potentialType.addedNewToken || potentialType.stop) {
    return {
      updatedIndex: potentialType.updatedIndex,
      stop: true,
    };
  }

  const followup = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: potentialType.updatedIndex,
    previousTokensSummary,
  });

  const ternary = extendsTernaryOperatorTypeFlow({
    tokens,
    input,
    previousTokensSummary,
    ...followup.breakpoint,
  });
  if (!ternary) {
    return {
      updatedIndex: followup.space?.updatedIndex ?? potentialType.updatedIndex,
      stop: false,
    };
  }

  return ternary;
};
