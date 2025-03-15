import { TokenTypeOptions } from "../constants";
import { BaseToken, FlowCallback } from "../types";
import { arrayFlow } from "./arrayFlow";
import { initializeClassFlow } from "./classFlows";
import { nullFlow, numericFlow, undefinedFlow, booleanFlow } from "./genericFlows";
import { objectFlow } from "./objectFlow";
import { stringFlow, templateLiteralFlow } from "./stringFlows";
import { variableFlow } from "./variableFlow";

type ValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
};

export const valueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
}: ValueFlowArgs) => {
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

    const { updatedIndex: newIndex, stop } = response;
    if (stop) {
      return {
        updatedIndex: newIndex,
        stop: true,
      };
    }

    return {
      updatedIndex: newIndex,
      stop: false,
      addedNewToken: true,
    };
  }

  return {
    updatedIndex: currentIndex - newTokenValue.length,
    stop: false,
    addedNewToken: false,
  };
};
