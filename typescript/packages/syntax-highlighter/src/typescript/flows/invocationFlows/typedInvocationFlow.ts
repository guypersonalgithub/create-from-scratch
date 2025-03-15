import { TokenTypeOptions } from "../../constants";
import { BaseToken } from "../../types";
import { genericTypeValueFlow } from "../typeFlows";
import { invocationFlow } from "./invocationFlow";
import { spaceFollowUpFlow } from "../genericFlows";

type TypedInvocationFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const typedInvocationFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: TypedInvocationFlowArgs) => {
  const lastToken = previousTokensSummary[previousTokensSummary.length - 1];
  const genericType = genericTypeValueFlow({
    tokens,
    newTokenValue,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (!genericType) {
    return;
  }

  if (genericType.stop) {
    return {
      updatedIndex: genericType.updatedIndex,
      stop: true,
    };
  }

  previousTokensSummary.push(lastToken);

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: genericType.updatedIndex,
    previousTokensSummary,
  });

  const invocation = invocationFlow({ tokens, input, previousTokensSummary, ...breakpoint });

  if (!invocation) {
    return {
      updatedIndex: space?.updatedIndex ?? genericType.updatedIndex,
      stop: true,
    };
  }

  return invocation;
};
