import { arrayFlow } from "./arrayFlow";
import { arrowFunctionFlow } from "./arrowFunctionFlow";
import { stringFlow } from "./stringFlow";
import { templateLiteralFlow } from "./templateLiteralFlow";
import type { Callback, DynaticStyleChunksVariable } from "./types";
import { uniqueImportFlow } from "./uniqueImportFlow";
import { variableFlow } from "./variableFlow";

type ValueFlowArgs = Pick<
  Callback,
  | "input"
  | "currentIndex"
  | "newTokenValue"
  | "identifier"
  | "dynaticStyleChunks"
  | "dynaticStyleOrderedChunks"
  | "nameslessStyleOrderedChunks"
  | "uniqueImports"
  | "openContexts"
> & {
  calledFromTemplateLiteral?: boolean;
};

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

export const valueFlow = ({
  input,
  currentIndex,
  newTokenValue,
  calledFromTemplateLiteral,
  identifier,
  dynaticStyleChunks,
  dynaticStyleOrderedChunks,
  nameslessStyleOrderedChunks,
  uniqueImports,
  openContexts,
}: ValueFlowArgs) => {
  const callback = flows[newTokenValue];

  if (callback) {
    const { updatedIndex, value, variables } = callback({
      input,
      currentIndex,
      newTokenValue,
      calledFromTemplateLiteral,
      identifier,
      dynaticStyleChunks,
      dynaticStyleOrderedChunks,
      nameslessStyleOrderedChunks,
      uniqueImports,
      openContexts,
    });

    return { updatedIndex, value, variables };
  }

  const uniqueImport = uniqueImportFlow({
    input,
    currentIndex,
    newTokenValue,
    identifier,
    dynaticStyleChunks,
    dynaticStyleOrderedChunks,
    nameslessStyleOrderedChunks,
    uniqueImports,
    openContexts,
  });

  if (uniqueImport.exit) {
    return { updatedIndex: uniqueImport.updatedIndex };
  }

  const { updatedIndex, value, name, type, variables } = variableFlow({
    input,
    currentIndex,
    newTokenValue,
    identifier,
    dynaticStyleChunks,
    dynaticStyleOrderedChunks,
    nameslessStyleOrderedChunks,
    uniqueImports,
    openContexts,
  });

  return { updatedIndex, value, name, type, variables };
};
