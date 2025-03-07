import { classSpecificKeywords, TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken, OpenedContext } from "../types";
import { partialDefinitionFlow } from "./partialDefinitionFlow";

type PublicPrivateStaticFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
};

export const publicPrivateStaticFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
}: PublicPrivateStaticFlowArgs) => {
  if (!classSpecificKeywords.has(newTokenValue)) {
    return;
  }

  if (openedContexts[openedContexts.length - 1].type !== "class") {
    return {
      updatedIndex: currentIndex - newTokenValue.length,
      stop: true,
    };
  }

  const types = {
    public: TokenTypes.PUBLIC,
    private: TokenTypes.PRIVATE,
    static: TokenTypes.STATIC,
  };

  tokens.push({ type: types[newTokenValue as keyof typeof types], value: newTokenValue });

  return partialDefinitionFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
    openedContexts,
    isWithinClassContext: true,
  });
};
