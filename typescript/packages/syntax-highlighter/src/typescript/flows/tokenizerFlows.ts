import { BaseToken, FlowCallback } from "../types";
import { arrowFlow } from "./arrowFlow";
import { asFlow } from "./asFlow";
import { commentFlow } from "./commentFlow";
import { definitionFlow } from "./definitionFlow";
import { endOfLineFlow } from "./endOfLineFlow";
import { findNextBreakpoint } from "../utils";
import { functionFlow } from "./functionFlow";
import { importFlow } from "./importFlow";
import { objectFlow } from "./objectFlow";
import { operatorFlow } from "./operatorFlow";
import { parenthesisFlow } from "./parenthesisFlow";
import { spaceFlow } from "./spaceFlow";
import { stringFlow } from "./stringFlow";
import { variableFlow } from "./variableFlow";
import { angleFlow } from "./angleFlow";
import { TokenTypeOptions } from "../constants";
import { numericFlow } from "./numericFlow";
import { returnFlow } from "./returnFlow";
import { closeFunctionFlow } from "./closeFunctionFlow";
import { booleanFlow } from "./booleanFlow";
import { undefinedFlow } from "./undefinedFlow";
import { nullFlow } from "./nullFlow";
import { arrayFlow } from "./arrayFlow";
import { initializeClassFlow } from "./initializeClassFlow";

type TokenizerFlowsArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  // isDefinitionValue?: boolean;
  previousTokensSummary: TokenTypeOptions[];
  openedFunctions: string[];
  // context: Context;
  // currentLayeredContexts: CurrentLayeredContexts;
};

export const tokenizerFlows = ({
  tokens,
  input,
  currentIndex,
  // isDefinitionValue,
  previousTokensSummary,
  openedFunctions,
  // context,
  // currentLayeredContexts,
}: TokenizerFlowsArgs): {
  updatedIndex: number;
  addedNewToken: boolean;
  // definitionValueFunction?: boolean;
} => {
  let { currentIndex: updatedIndex, newTokenValue } = findNextBreakpoint({ input, currentIndex });

  // let definitionValueFunction = isDefinitionValue ? false : undefined;

  const callbacks: FlowCallback[] = [
    () =>
      definitionFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
        openedFunctions,
        // context,
        // currentLayeredContexts,
      }),
    () =>
      objectFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
        // context,
        // currentLayeredContexts,
      }),
    () =>
      parenthesisFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
        openedFunctions,
        expectingFunction: false,
        // context,
        // currentLayeredContexts,
      }),
    () =>
      angleFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
        openedFunctions,
      }),
    () =>
      spaceFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
    () =>
      stringFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
    () =>
      importFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
    () =>
      functionFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
        openedFunctions,
      }),
    () =>
      arrayFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
    () =>
      endOfLineFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () => commentFlow({ tokens, newTokenValue, input, currentIndex: updatedIndex }),
    () =>
      arrowFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
    () =>
      closeFunctionFlow({
        tokens,
        newTokenValue,
        currentIndex: updatedIndex,
        previousTokensSummary,
        openedFunctions,
      }),
    () =>
      operatorFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () =>
      asFlow({ tokens, newTokenValue, input, currentIndex: updatedIndex, previousTokensSummary }),
    () => booleanFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () =>
      undefinedFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () => nullFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () =>
      initializeClassFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
    () =>
      numericFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
    () => returnFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () =>
      variableFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
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
        addedNewToken: false,
      };
    }

    // if ((response as Exclude<ReturnType<typeof functionFlow>, undefined>).isFunction) {
    //   definitionValueFunction = true;
    // }

    return {
      updatedIndex: newIndex,
      addedNewToken: true,
      // definitionValueFunction,
    };
  }

  return {
    updatedIndex: updatedIndex - newTokenValue.length,
    addedNewToken: false,
  };
};
