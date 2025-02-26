import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { shouldBreak } from "../utils";
import { invocationFlow } from "./invocationFlow";
import { spaceFollowUpFlow } from "./spaceFlow";
import { variablePropertyFlow } from "./variablePropertyFlow";

type VariableFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const variableFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: VariableFlowArgs):
  | {
      updatedIndex: number;
      stop: boolean;
    }
  | undefined => {
  const firstChar = newTokenValue.charAt(0);
  const isIncorrectVariableName =
    shouldBreak({
      currentChar: firstChar,
    }) && firstChar !== "_";

  if (isIncorrectVariableName) {
    return;
  }

  tokens.push({ type: TokenTypes.VARIABLE, value: newTokenValue });
  previousTokensSummary.push(TokenTypes.VARIABLE);
  const variableIndex = tokens.length - 1;

  let { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  // TODO: Add optional generic type for function calls, with type extends ? a : b support.

  const invocation = invocationFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  if (invocation) {
    tokens[variableIndex].type = TokenTypes.FUNCTION_NAME;

    const following = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: invocation.updatedIndex,
      previousTokensSummary,
    });

    breakpoint = following.breakpoint;
    space = following.space;
  }

  const variableProperty = variablePropertyFlow({ tokens, previousTokensSummary, ...breakpoint });
  if (variableProperty) {
    const { breakpoint: following, space } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: variableProperty.updatedIndex,
      previousTokensSummary,
    });

    const property = variableFlow({ tokens, input, previousTokensSummary, ...following });

    if (!property) {
      return {
        updatedIndex: space?.updatedIndex ?? variableProperty.updatedIndex,
        stop: true,
      };
    }

    return property;
  }

  return (
    invocation ||
    space || {
      updatedIndex: currentIndex,
      stop: false,
    }
  );
};
