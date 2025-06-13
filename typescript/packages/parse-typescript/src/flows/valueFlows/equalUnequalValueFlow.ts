import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken, type OpenedContext } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { valueFlow } from "./valueFlow";

type EqualUnequalValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const equalUnequalValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: EqualUnequalValueFlowArgs) => {
  if (newTokenValue !== "=" && newTokenValue !== "!") {
    return;
  }

  const nextChar = input[currentIndex];

  if (nextChar !== "=") {
    return;
  }

  currentIndex++;

  const nextChar2 = input[currentIndex];

  const isEqual = newTokenValue === "=";

  let value = `${newTokenValue}${nextChar}`;

  if (nextChar2 === "=") {
    currentIndex++;

    value += nextChar2;

    const type = isEqual ? TokenTypes.IS_DEEP_EQUAL : TokenTypes.IS_DEEP_UNEQUAL;
    previousTokensSummary.push(type);

    tokens.push({ type, value });
  } else {
    const type = isEqual ? TokenTypes.IS_EQUAL : TokenTypes.IS_UNEQUAL;

    tokens.push({ type, value });
    previousTokensSummary.push(type);
  }

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
