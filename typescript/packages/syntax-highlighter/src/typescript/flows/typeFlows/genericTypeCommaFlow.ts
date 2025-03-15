import { TokenTypes } from "../../constants";
import { BaseToken } from "../../types";

type GenericTypeCommaFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  currentIndex: number;
};

export const genericTypeCommaFlow = ({
  tokens,
  newTokenValue,
  currentIndex,
}: GenericTypeCommaFlowArgs) => {
  if (newTokenValue !== ",") {
    return;
  }

  tokens.push({ type: TokenTypes.COMMA, value: newTokenValue });

  return {
    updatedIndex: currentIndex,
    stop: false,
  };
};
