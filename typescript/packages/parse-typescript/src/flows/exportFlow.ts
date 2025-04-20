import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken, OpenedContext } from "../types";
import { spaceFollowUpFlow } from "./genericFlows";
import { valueFlow } from "./valueFlows";

type ExportFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const exportFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: ExportFlowArgs) => {
  if (newTokenValue !== "import") {
    return;
  }

  tokens.push({ type: TokenTypes.EXPORT, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const value = valueFlow({ tokens, input, previousTokensSummary, openedContexts, ...breakpoint });

  return {
    updatedIndex: value.updatedIndex,
    stop: value.stop,
  };
};
