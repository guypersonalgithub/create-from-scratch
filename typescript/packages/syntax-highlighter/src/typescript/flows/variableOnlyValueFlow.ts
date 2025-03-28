import { TokenTypeOptions } from "../constants";
import { BaseToken, FlowCallback } from "../types";
import { variableOnlyArrayFlow } from "./arrayFlows";
import { variableOnlyObjectFlow } from "./objectFlows";
import { variableFlow } from "./variableFlow";

type VariableOnlyValueFlowArgs = {
  tokens: BaseToken[];
  newTokenValue: string;
  input: string;
  currentIndex: number;
  previousTokensSummary: TokenTypeOptions[];
  isType?: boolean;
  fromObject?: boolean;
};

export const variableOnlyValueFlow = ({
  tokens,
  newTokenValue,
  input,
  currentIndex,
  previousTokensSummary,
  isType,
  fromObject,
}: VariableOnlyValueFlowArgs) => {
  const callbacks: FlowCallback[] = [
    () =>
      variableOnlyArrayFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        isType,
      }),
    () =>
      variableOnlyObjectFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        isType,
      }),
    () =>
      variableFlow({
        tokens,
        newTokenValue,
        input,
        currentIndex,
        previousTokensSummary,
        variableOnly: true,
      }),
  ];

  if (isType && fromObject) {
    callbacks.splice(-1);
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
