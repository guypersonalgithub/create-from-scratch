import { classNameFlow } from "./classNameFlow";
import { commentLineFlow } from "./commentLineFlow";
import { constantFlow } from "./constantFlow";
import { importFlow } from "./importFlow";
import type { Callback } from "./types";
import { uniqueImportFlow } from "./uniqueImportFlow";

type TokenizerFlowsArgs = Callback;

const flows: Record<string, (args: Callback) => { updatedIndex: number }> = {
  import: importFlow,
  const: constantFlow,
  className: classNameFlow,
  "/": commentLineFlow,
};

export const tokenizerFlows = ({
  input,
  currentIndex,
  newTokenValue,
  identifier,
  dynaticStyleChunks,
  dynaticStyleOrderedChunks,
  nameslessStyleOrderedChunks,
  uniqueImports,
  mappedImports,
  importVariables,
  contexts,
  counters,
  openContexts,
  classNames,
}: TokenizerFlowsArgs) => {
  if (Object.hasOwn(flows, newTokenValue)) {
    const callback = flows[newTokenValue];
    const { updatedIndex } = callback({
      input,
      currentIndex,
      newTokenValue,
      identifier,
      dynaticStyleChunks,
      dynaticStyleOrderedChunks,
      nameslessStyleOrderedChunks,
      uniqueImports,
      mappedImports,
      importVariables,
      contexts,
      counters,
      openContexts,
      classNames,
    });

    return { updatedIndex };
  }

  const uniqueImport = uniqueImportFlow({
    input,
    currentIndex,
    newTokenValue,
    identifier,
    uniqueImports,
    dynaticStyleChunks,
    dynaticStyleOrderedChunks,
    nameslessStyleOrderedChunks,
    openContexts,
  });

  if (uniqueImport.exit) {
    return { updatedIndex: uniqueImport.updatedIndex };
  }

  return { updatedIndex: currentIndex };
};
