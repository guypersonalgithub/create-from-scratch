import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { typeofFlow } from "./typeofFlow";
import { typeValueFlow } from "./typeValueFlow";

type KeyofFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const keyofFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: KeyofFlowArgs) => {
  if (newTokenValue !== "keyof") {
    return;
  }

  tokens.push({ type: TokenTypes.KEYOF, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  if (!space) {
    return {
      updatedIndex: currentIndex,
      stop: true,
    };
  }

  const followup = typeofFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  if (followup) {
    return followup;
  }

  const type = typeValueFlow({
    tokens,
    input,
    previousTokensSummary,
    isKeyof: true,
    ...breakpoint,
  });

  if (!type.addedNewToken || type.stop) {
    return {
      updatedIndex: type.updatedIndex,
      stop: true,
    };
  }

  return {
    updatedIndex: type.updatedIndex,
    stop: false,
  };
};
