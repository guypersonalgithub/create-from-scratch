import { type TokenTypeOptions } from "../../constants";
import { type BaseToken } from "../../types";
import { typeAndOrFlow } from "./typeAndOrFlow";

type TypeAndOrFollowupFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  isAsFlow?: boolean;
};

export const typeAndOrFollowupFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  isAsFlow,
}: TypeAndOrFollowupFlowArgs) => {
  if (isAsFlow) {
    const followup = input[currentIndex];
    if ((newTokenValue === "|" || newTokenValue === "&") && newTokenValue === followup) {
      return;
    }
  }

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
