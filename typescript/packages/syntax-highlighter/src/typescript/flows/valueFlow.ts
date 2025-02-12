import { TokenTypeOptions } from "../constants";
import { BaseToken, FlowCallback } from "../types";
import { objectFlow } from "./objectFlow";
import { stringFlow } from "./stringFlow";
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
    () => stringFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () => variableFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
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

    // if ((response as Exclude<ReturnType<typeof functionFlow>, undefined>).isFunction) {
    //   definitionValueFunction = true;
    // }

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
