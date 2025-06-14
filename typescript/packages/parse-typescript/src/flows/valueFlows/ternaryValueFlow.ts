import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken, type OpenedContext } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { valueFlow } from "../valueFlows";

type TernaryValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const ternaryValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: TernaryValueFlowArgs) => {
  if (newTokenValue !== "?") {
    return;
  }

  tokens.push({ type: TokenTypes.TERINARY_QUESTION_MARK, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const firstValue = valueFlow({
    tokens,
    input,
    previousTokensSummary,
    openedContexts,
    ...breakpoint,
  });

  if (!firstValue.addedNewToken || firstValue.stop) {
    return {
      updatedIndex: firstValue.updatedIndex,
      stop: true,
    };
  }

  const potentialColon = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: firstValue.updatedIndex,
    previousTokensSummary,
  });

  if (potentialColon.breakpoint.newTokenValue !== ":") {
    return {
      updatedIndex: potentialColon.space?.updatedIndex ?? firstValue.updatedIndex,
      stop: true,
    };
  }

  tokens.push({ type: TokenTypes.TERINARY_COLON, value: potentialColon.breakpoint.newTokenValue });

  const potentialNextValue = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex: potentialColon.breakpoint.currentIndex,
    previousTokensSummary,
  });

  const secondValue = valueFlow({
    tokens,
    input,
    previousTokensSummary,
    openedContexts,
    ...potentialNextValue.breakpoint,
  });

  if (!secondValue.addedNewToken || secondValue.stop) {
    return {
      updatedIndex: secondValue.updatedIndex,
      stop: true,
    };
  }

  return {
    updatedIndex: secondValue.updatedIndex,
    stop: false,
  };
};
