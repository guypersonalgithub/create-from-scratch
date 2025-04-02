import { TokenTypeOptions, TokenTypes } from "../constants";
import { BaseToken, OpenedContext } from "../types";
import { invocationFlow, typedInvocationFlow } from "./invocationFlows";
import { spaceFollowUpFlow } from "./genericFlows";
import { variablePropertyFlow } from "./variablePropertyFlow";
import { simplifiedVariableFlow } from "./variableFlows";

// TODO: Add support for optional chaining, currently it doesn't check whether something follows up or not.

type VariableFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
} & InvocationLessFlow;

type InvocationLessFlow =
  | {
      invocationLess?: boolean;
      openedContexts?: never;
    }
  | {
      invocationLess?: never;
      openedContexts?: OpenedContext[];
    };

export const variableFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  invocationLess,
}: VariableFlowArgs):
  | {
      updatedIndex: number;
      stop: boolean;
    }
  | undefined => {
  const baseVariable = simplifiedVariableFlow({
    tokens,
    newTokenValue,
    currentIndex,
    previousTokensSummary,
  });

  if (!baseVariable) {
    return;
  }

  if (currentIndex === input.length) {
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

  let invocation:
    | {
        updatedIndex: number;
        stop: boolean;
      }
    | undefined;

  if (!invocationLess) {
    invocation =
      typedInvocationFlow({
        tokens,
        input,
        previousTokensSummary,
        openedContexts: openedContexts ?? [],
        ...breakpoint,
      }) ||
      invocationFlow({
        tokens,
        input,
        previousTokensSummary,
        openedContexts: openedContexts ?? [],
        ...breakpoint,
      });
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
  }

  const variableProperty = variablePropertyFlow({ tokens, previousTokensSummary, ...breakpoint });
  if (variableProperty) {
    const { breakpoint: following, space } = spaceFollowUpFlow({
      tokens,
      input,
      currentIndex: variableProperty.updatedIndex,
      previousTokensSummary,
    });

    const property = variableFlow({
      tokens,
      input,
      previousTokensSummary,
      openedContexts,
      ...following,
    });

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
