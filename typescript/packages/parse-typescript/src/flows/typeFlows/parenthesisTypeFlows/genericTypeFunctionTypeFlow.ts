import { type TokenTypeOptions } from "../../../constants";
import { type BaseToken } from "../../../types";
import { spaceFollowUpFlow } from "../../genericFlows";
import { genericTypeTemplateFlow } from "../genericTypeTemplateFlow";
import { parenthesisTypeFlow } from "./parenthesisTypeFlow";

type GenericTypeFunctionTypeFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const genericTypeFunctionTypeFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: GenericTypeFunctionTypeFlowArgs) => {
  const potentialGenericTemplate = genericTypeTemplateFlow({
    tokens,
    newTokenValue,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (!potentialGenericTemplate) {
    return;
  }

  if (potentialGenericTemplate.stop) {
    return potentialGenericTemplate;
  }

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: potentialGenericTemplate.updatedIndex,
    previousTokensSummary,
  });

  const followupFunction = parenthesisTypeFlow({
    tokens,
    input,
    previousTokensSummary,
    expectedToBeAFunction: true,
    ...breakpoint,
  });

  if (!followupFunction) {
    return {
      updatedIndex: space?.updatedIndex ?? potentialGenericTemplate.updatedIndex,
      stop: true,
    };
  }

  return followupFunction;
};
