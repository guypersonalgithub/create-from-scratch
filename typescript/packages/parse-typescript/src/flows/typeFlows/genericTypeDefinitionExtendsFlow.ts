import { TokenTypeOptions, TokenTypes } from "../../constants";
import { BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { typeValueFlow } from "./typeValueFlow";

type GenericTypeDefinitionExtendsFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const genericTypeDefinitionExtendsFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: GenericTypeDefinitionExtendsFlowArgs) => {
  if (newTokenValue !== "extends") {
    return;
  }

  tokens.push({ type: TokenTypes.EXTENDS, value: newTokenValue });

  const { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const type = typeValueFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  if (!type) {
    return {
      updatedIndex: space?.updatedIndex ?? currentIndex,
      stop: true,
    };
  }

  if (type.stop) {
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
