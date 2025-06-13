import { definitionKeywords, type TokenTypeOptions, TokenTypes } from "../constants";
import { type BaseToken, type OpenedContext } from "../types";
import { partialDefinitionFlow } from "./partialDefinitionFlow";

type DefinitionFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];

  // context: Context;
  // currentLayeredContexts: CurrentLayeredContexts;
};

export const definitionFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  // context,
  // currentLayeredContexts,
}: DefinitionFlowArgs) => {
  if (!definitionKeywords.has(newTokenValue)) {
    return;
  }

  tokens.push({
    type: TokenTypes.DEFINITION,
    value: newTokenValue,
  });

  previousTokensSummary.push(TokenTypes.DEFINITION);

  // TODO: Add to context based off the definition type.

  return partialDefinitionFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
    openedContexts,
  });
};
