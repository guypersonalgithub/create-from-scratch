import { type BaseToken, type OpenedContextsIdentation } from "../types";
import { rowValueFlow } from "./rowValueFlow";
import { spaceFlow } from "./spaceFlow";

type TokenizerFlowsArgs = {
  tokens: BaseToken[];
  input: string;
  currentIndex: number;
  identations: {
    lowestIdentation: number;
    currentIdentation: number;
  };
  openedContextsIdentations: OpenedContextsIdentation[];
};

export const tokenizerFlows = ({
  tokens,
  input,
  currentIndex,
  identations,
  openedContextsIdentations,
}: TokenizerFlowsArgs): {
  updatedIndex: number;
  addedNewToken: boolean;
} => {
  const tokensCount = tokens.length;
  const startOfLineSpace = spaceFlow({ tokens, input, currentIndex });
  if (startOfLineSpace) {
    identations.currentIdentation = startOfLineSpace.identation;
    currentIndex = startOfLineSpace.updatedIndex;
  } else {
    identations.currentIdentation = 0;
  }

  if (identations.currentIdentation < identations.lowestIdentation) {
    return {
      updatedIndex: currentIndex,
      addedNewToken: false,
    };
  }

  const { updatedIndex, stop } = rowValueFlow({
    tokens,
    input,
    currentIndex,
    identations,
    openedContextsIdentations,
  });

  if (stop) {
    return {
      updatedIndex,
      addedNewToken: false,
    };
  }

  return {
    updatedIndex,
    addedNewToken: tokens.length > tokensCount,
  };
};
