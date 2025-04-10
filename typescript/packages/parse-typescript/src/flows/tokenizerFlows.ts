import { BaseToken, FlowCallback, OpenedContext } from "../types";
import { functionFlow, arrowFlow } from "./functionFlows";
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
import { importFlow } from "./importFlow";
import { objectFlow } from "./objectFlows";
import { parenthesisFlow } from "./parenthesisFlows";
import { stringFlow, templateLiteralFlow } from "./stringFlows";
import { variableFlow } from "./variableFlow";
import { angleFlow } from "./angleFlow";
import { TokenTypeOptions } from "../constants";
import { arrayFlow } from "./arrayFlows";
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
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  openedContexts: OpenedContext[];
  // context: Context;
  // currentLayeredContexts: CurrentLayeredContexts;
};

export const tokenizerFlows = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  openedContexts,
  // context,
  // currentLayeredContexts,
}: TokenizerFlowsArgs): {
  updatedIndex: number;
  addedNewToken: boolean;
} => {
  const callbacks: FlowCallback[] = [
    () =>
      definitionFlow({
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
      parenthesisFlow({
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
      angleFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () =>
      spaceFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
      }),
    () =>
      stringFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
      }),
    () =>
      importFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
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
    () =>
      typeDefinitionFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
      }),
    () =>
      ifFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () =>
      templateLiteralFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
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
    () => endOfLineFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
    () => commentFlow({ tokens, newTokenValue, input, currentIndex }),
    () =>
      arrowFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
      }),
    () => equalFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
    () => operatorFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
    () => asFlow({ tokens, newTokenValue, input, currentIndex, previousTokensSummary }),
    () => booleanFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
    () => undefinedFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
    () => nullFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
    () => thisFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
    () =>
      abstractClassFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () =>
      classFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () =>
      initializeClassFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        openedContexts,
      }),
    () => returnFlow({ tokens, newTokenValue, currentIndex, previousTokensSummary }),
    () =>
      numericFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
      }),
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

  if (openedContexts.length > 0 && openedContexts[openedContexts.length - 1].type === "class") {
    // definitionFlow
    callbacks.splice(0, 1, () =>
      publicPrivateStaticFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
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
          currentIndex,
          previousTokensSummary,
          openedContexts,
        }),
      () =>
        partialDefinitionFlow({
          tokens,
          input,
          currentIndex: currentIndex - newTokenValue.length,
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

    return {
      updatedIndex: newIndex,
      addedNewToken: true,
    };
  }

  return {
    updatedIndex: currentIndex - newTokenValue.length,
    addedNewToken: false,
  };
};
