import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken, OpenedContext } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { valueFlow } from "../valueFlows";

type AndOrValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

// TODO: Split and or for the sake of highlightnig function values incase of an or value flow that has atleast one function values in it.

export const andOrValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: AndOrValueFlowArgs):
  | {
      updatedIndex: number;
      stop: boolean;
    }
  | undefined => {
  if (newTokenValue !== "|" && newTokenValue !== "&") {
    return;
  }

  const last = previousTokensSummary[previousTokensSummary.length - 1];
  if (last === TokenTypes.OR || last === TokenTypes.AND) {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  const followingChar = input[currentIndex];

  const isOr = newTokenValue === "|";
  if ((isOr && followingChar !== "|") || (!isOr && followingChar !== "&")) {
    return {
      updatedIndex: currentIndex - newTokenValue.length,
      stop: true,
    };
  }

  const type = isOr ? TokenTypes.OR : TokenTypes.AND;
  tokens.push({ type, value: `${newTokenValue}${followingChar}` });
  previousTokensSummary.push(type);
  currentIndex++;

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const followingValue = valueFlow({
    tokens,
    input,
    previousTokensSummary,
    openedContexts,
    isFromAndOrValueFlow: true,
    ...breakpoint,
  });

  if (!followingValue.addedNewToken || followingValue.stop) {
    return {
      updatedIndex: followingValue.updatedIndex,
      stop: true,
    };
  }

  return {
    updatedIndex: followingValue.updatedIndex,
    stop: false,
  };
};
