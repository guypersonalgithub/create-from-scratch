import { arrayFlow } from "./arrayFlow";
import { arrowFunctionFlow } from "./arrowFunctionFlow";
import { stringFlow } from "./stringFlow";
import { templateLiteralFlow } from "./templateLiteralFlow";
import type { Callback, DynaticStyleChunksVariable } from "./types";
import { variableFlow } from "./variableFlow";

type ValueFlowArgs = Pick<Callback, "input" | "currentIndex" | "newTokenValue">;

const flows: Record<
  string,
  (args: ValueFlowArgs) => {
    updatedIndex: number;
    value?: string;
    variables?: DynaticStyleChunksVariable[];
  }
> = {
  '"': stringFlow,
  "'": stringFlow,
  "`": templateLiteralFlow,
  "[": arrayFlow,
  "(": arrowFunctionFlow,
};

export const valueFlow = ({ input, currentIndex, newTokenValue }: ValueFlowArgs) => {
  const callback = flows[newTokenValue];

  if (callback) {
    const { updatedIndex, value, variables } = callback({
      input,
      currentIndex,
      newTokenValue,
    });

    return { updatedIndex, value, variables };
  }

  const { updatedIndex, value, name, type, variables } = variableFlow({
    input,
    currentIndex,
    newTokenValue,
  });

  return { updatedIndex, value, name, type, variables };
};
