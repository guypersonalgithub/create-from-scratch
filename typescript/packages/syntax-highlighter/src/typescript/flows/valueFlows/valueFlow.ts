import { TokenTypeOptions } from "../../constants";
import { BaseToken, FlowCallback, OpenedContext } from "../../types";
import { arrayFlow } from "../arrayFlows";
import { initializeClassFlow } from "../classFlows";
import { nullFlow, numericFlow, undefinedFlow, booleanFlow } from "../genericFlows";
import { objectFlow } from "../objectFlows";
import { stringFlow, templateLiteralFlow } from "../stringFlows";
import { variableFlow } from "../variableFlow";
import { valueAdditionsFlow } from "./valueAdditionsFlow";

type ValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  // openedContexts: OpenedContext[];
  // isFromDefinitionFlow?: boolean;
  // expectedToBeAFunction?: boolean;
  // expectingArrow?: boolean;
};

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
};

export const valueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  // openedContexts,
  // isFromDefinitionFlow,
  // expectedToBeAFunction,
  // expectingArrow,
}: ValueFlowArgs): Return => {
  const callbacks: FlowCallback[] = [
    () =>
      objectFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
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
      }),
    () => stringFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () =>
      templateLiteralFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
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
      }),
    () => numericFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () => variableFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
  ];

  for (let i = 0; i < callbacks.length; i++) {
    const current = callbacks[i];
    const response = current();
    if (!response) {
      continue;
    }

    const { updatedIndex: newIndex, stop, hasArrow } = response;
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
    });

    if (additions) {
      const { updatedIndex, stop } = additions;

      if (stop) {
        return {
          updatedIndex,
          stop: true,
          addedNewToken: false,
        };
      }

      return {
        ...additions,
        addedNewToken: true,
      };
    }

    return {
      updatedIndex: newIndex,
      stop: false,
      addedNewToken: true,
      hasArrow,
    };
  }

  return {
    updatedIndex: currentIndex - newTokenValue.length,
    stop: false,
    addedNewToken: false,
  };
};
