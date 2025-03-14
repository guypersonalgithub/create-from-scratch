import { BaseToken, FlowCallback, OpenedContext } from "../types";
import { functionFlow, arrowFlow, closeFunctionFlow } from "./functionFlows";
import { typeDefinitionFlow, asFlow } from "./typeFlows";
import {
  spaceFlow,
  commentFlow,
  thisFlow,
  endOfLineFlow,
  equalFlow,
  nullFlow,
  numericFlow,
  returnFlow,
  operatorFlow,
  undefinedFlow,
  booleanFlow,
} from "./genericFlows";
import { definitionFlow } from "./definitionFlow";
import { findNextBreakpoint } from "../utils";
import { importFlow } from "./importFlow";
import { objectFlow } from "./objectFlow";
import { parenthesisFlow } from "./parenthesisFlow";
import { stringFlow, templateLiteralFlow } from "./stringFlows";
import { variableFlow } from "./variableFlow";
import { angleFlow } from "./angleFlow";
import { TokenTypeOptions } from "../constants";
import { arrayFlow } from "./arrayFlow";
import {
  classFlow,
  abstractClassFlow,
  publicPrivateStaticFlow,
  classConstructorFlow,
  initializeClassFlow,
} from "./classFlows";
import { partialDefinitionFlow } from "./partialDefinitionFlow";
import { ifFlow } from "./ifFlow";

type TokenizerFlowsArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  // isDefinitionValue?: boolean;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  // context: Context;
  // currentLayeredContexts: CurrentLayeredContexts;
};

export const tokenizerFlows = ({
  tokens,
  input,
  currentIndex,
  // isDefinitionValue,
  previousTokensSummary,
  openedContexts,
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
        openedContexts,
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
        openedContexts,
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
        openedContexts,
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
        openedContexts,
      }),
    () =>
      typeDefinitionFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
    () =>
      ifFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () =>
      templateLiteralFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
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
        openedContexts,
      }),
    () => equalFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () =>
      operatorFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () =>
      asFlow({ tokens, newTokenValue, input, currentIndex: updatedIndex, previousTokensSummary }),
    () => booleanFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () =>
      undefinedFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () => nullFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () => thisFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () =>
      abstractClassFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () =>
      classFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () =>
      initializeClassFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
    () => returnFlow({ tokens, newTokenValue, currentIndex: updatedIndex, previousTokensSummary }),
    () =>
      numericFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
    () =>
      variableFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
      }),
  ];

  if (openedContexts.length > 0 && openedContexts[openedContexts.length - 1].type === "class") {
    // definitionFlow
    callbacks.splice(0, 1, () =>
      publicPrivateStaticFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex: updatedIndex,
        previousTokensSummary,
        openedContexts,
      }),
    );

    callbacks.splice(7, 1); // functionFlow

    callbacks.splice(
      callbacks.length - 2,
      2,
      () =>
        classConstructorFlow({
          tokens,
          newTokenValue,
          input,
          currentIndex: updatedIndex,
          previousTokensSummary,
          openedContexts,
        }),
      () =>
        partialDefinitionFlow({
          tokens,
          input,
          currentIndex: updatedIndex - newTokenValue.length,
          previousTokensSummary,
          openedContexts,
          isWithinClassContext: true,
          withoutPreviousKeyword: true,
        }),
    );
  }

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
