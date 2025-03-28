import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken } from "../types";
import { shouldBreak } from "../utils";
import { invocationFlow, typedInvocationFlow } from "./invocationFlows";
import { spaceFollowUpFlow } from "./genericFlows";
import { variablePropertyFlow } from "./variablePropertyFlow";

// TODO: Add support for optional chaining, currently it doesn't check whether something follows up or not.

type VariableFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  variableOnly?: boolean;
};

export const variableFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  variableOnly,
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

  if (currentIndex === input.length || variableOnly) {
    return {
      updatedIndex: currentIndex,
      stop: false,
    };
  }

  const variableIndex = tokens.length - 1;
  const previousVariableIndex = previousTokensSummary.length - 1;

  let { breakpoint, space } = spaceFollowUpFlow({
    tokens,
    input,
    currentIndex,
    previousTokensSummary,
  });

  const invocation =
    typedInvocationFlow({ tokens, input, previousTokensSummary, ...breakpoint }) ||
    invocationFlow({ tokens, input, previousTokensSummary, ...breakpoint });
  if (invocation) {
    tokens[variableIndex].type = TokenTypes.INVOKED_FUNCTION;
    previousTokensSummary[previousVariableIndex] = TokenTypes.INVOKED_FUNCTION;
    previousTokensSummary.push(TokenTypes.INVOKED_FUNCTION);

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
    space ||
    invocation || {
      updatedIndex: currentIndex,
      stop: false,
    }
  );
};
