import { TokenTypeOptions } from "../../constants";
import { BaseToken } from "../../types";
import { typeAndOrFlow } from "./typeAndOrFlow";

type TypeAndOrFollowupFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const typeAndOrFollowupFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: TypeAndOrFollowupFlowArgs) => {
  const potentialAndOr = typeAndOrFlow({
    tokens,
    input,
    newTokenValue,
    currentIndex,
    previousTokensSummary,
  });

  if (!potentialAndOr) {
    return;
  }

  return potentialAndOr;
};
