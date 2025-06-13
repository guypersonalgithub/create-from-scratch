import { type TokenTypeOptions } from "../../constants";
import { type BaseToken, type FlowCallback, type OpenedContext } from "../../types";
import { angleFlow } from "../angleFlow";
import { arrayFlow } from "../arrayFlows";
import { initializeClassFlow } from "../classFlows";
import { functionFlow } from "../functionFlows";
import { nullFlow, numericFlow, undefinedFlow, booleanFlow } from "../genericFlows";
import { objectFlow } from "../objectFlows";
import { parenthesisFlow } from "../parenthesisFlows";
import { stringFlow, templateLiteralFlow } from "../stringFlows";
import { variableFlow } from "../variableFlow";
import { valueAdditionsFlow } from "./valueAdditionsFlow";

type ValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  isFromDefinitionFlow?: boolean;
  isType?: boolean;
  isFromAndOrValueFlow?: boolean;
};

// TODO: isType should remove functions as they don't exist in an expression interpolation inside a type.

type Return = {
  addedNewToken: boolean;
  updatedIndex: number;
  stop: boolean;
  addedAs?: boolean;
  addedAndOr?: boolean;
  addedTernary?: boolean;
  addedLowerHigherThan?: boolean;
  addedArithmetic?: boolean;
  addedEqualUnequal?: boolean;
  hasArrow?: boolean;
  hasFunction?: boolean;
};

export const valueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  isFromDefinitionFlow,
  isType,
  isFromAndOrValueFlow,
}: ValueFlowArgs): Return => {
  const callbacks: FlowCallback[] = [
    () =>
      objectFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
        // context,
        // currentLayeredContexts,
      }),
    () =>
      arrayFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () =>
      angleFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
        isFromDefinitionFlow,
        expectingArrow: true,
      }),
    () =>
      parenthesisFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
        isFromDefinitionFlow,
        // expectedToBeAFunction: true,
        expectingArrow: true,
      }),
    () =>
      functionFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () => stringFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () =>
      templateLiteralFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () => booleanFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
    () => undefinedFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
    () => nullFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
    () =>
      initializeClassFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () => numericFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () =>
      variableFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
      }),
  ];

  for (let i = 0; i < callbacks.length; i++) {
    const current = callbacks[i];
    const response = current();
    if (!response) {
      continue;
    }

    const { updatedIndex: newIndex, stop, hasArrow, hasFunction } = response;

    if (stop) {
      return {
        updatedIndex: newIndex,
        stop: true,
        addedNewToken: false,
      };
    }

    const additions = valueAdditionsFlow({
      tokens,
      input,
      currentIndex: newIndex,
      previousTokensSummary,
      openedContexts,
      isFromAndOrValueFlow,
    });

    if (additions) {
      const { updatedIndex, stop, hasArrow: innerArrow, hasFunction: innerFunction } = additions;

      const arrow = hasArrow || innerArrow;
      const func = hasFunction || innerFunction;

      if (stop) {
        return {
          updatedIndex,
          stop: true,
          addedNewToken: false,
          hasArrow: arrow,
          hasFunction: func,
        };
      }

      return {
        ...additions,
        addedNewToken: true,
        hasArrow: arrow,
        hasFunction: func,
      };
    }

    return {
      updatedIndex: newIndex,
      stop: false,
      addedNewToken: true,
      hasArrow,
      hasFunction,
    };
  }

  return {
    updatedIndex: currentIndex - (newTokenValue?.length ?? 0),
    stop: false,
    addedNewToken: false,
  };
};
