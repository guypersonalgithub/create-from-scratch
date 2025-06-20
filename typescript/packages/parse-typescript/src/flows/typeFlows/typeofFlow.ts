import { type TokenTypeOptions, TokenTypes } from "../../constants";
import { type BaseToken } from "../../types";
import { spaceFollowUpFlow } from "../genericFlows";
import { stringFlow, templateLiteralFlow } from "../stringFlows";
import { variableFlow } from "../variableFlow";

type TypeofFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const typeofFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: TypeofFlowArgs) => {
  if (newTokenValue !== "typeof") {
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

  const variable = variableFlow({
    tokens,
    input,
    previousTokensSummary,
    invocationLess: true,
    ...breakpoint,
  });
  if (variable) {
    return variable;
  }

  const string = stringFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  if (string) {
    return string;
  }

  const templateLiteral = templateLiteralFlow({
    tokens,
    input,
    previousTokensSummary,
    ...breakpoint,
  });
  if (templateLiteral) {
    return templateLiteral;
  }

  return {
    updatedIndex: space.updatedIndex,
    stop: true,
  };
};
