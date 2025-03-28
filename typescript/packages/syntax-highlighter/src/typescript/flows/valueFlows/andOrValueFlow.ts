import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { valueFlow } from "../valueFlows";

type AndOrValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const andOrValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: AndOrValueFlowArgs):
  | {
      updatedIndex: number;
      stop: boolean;
    }
  | undefined => {
  const followingChar = input[currentIndex + 1];
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

  const followingValue = valueFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  if (!followingValue.addedNewToken || followingValue.stop) {
    return {
      updatedIndex: breakpoint.currentIndex,
      stop: true,
    };
  }

  return {
    updatedIndex: breakpoint.currentIndex,
    stop: false,
  };

  // const followup = spaceFollowUpFlow({
  //   tokens,
  //   input,
  //   currentIndex: breakpoint.currentIndex,
  //   previousTokensSummary,
  // });

  // const potentialAndOr = andOrValueFlow({
  //   tokens,
  //   input,
  //   previousTokensSummary,
  //   ...followup.breakpoint,
  // });
  // if (!potentialAndOr) {
  //   return {
  //     updatedIndex: followup.space?.updatedIndex ?? breakpoint.currentIndex,
  //     stop: false,
  //   };
  // }

  // return potentialAndOr;
};
