import { TokenTypeOptions } from "../constants";
import { BaseToken, FlowCallback } from "../types";
import { variableOnlyArrayFlow } from "./arrayFlows";
import { variableOnlyObjectFlow } from "./objectFlows";
import { simplifiedVariableFlow } from "./variableFlows";

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
      simplifiedVariableFlow({
        tokens,
        newTokenValue,
        currentIndex,
        previousTokensSummary,
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
    const isOnlyAVariable = i === callbacks.length - 1;
    if (stop) {
      return {
        updatedIndex: newIndex,
        stop: true,
        isOnlyAVariable,
      };
    }

    return {
      updatedIndex: newIndex,
      stop: false,
      addedNewToken: true,
      isOnlyAVariable,
    };
  }

  return {
    updatedIndex: currentIndex - newTokenValue.length,
    stop: false,
    addedNewToken: false,
  };
};
