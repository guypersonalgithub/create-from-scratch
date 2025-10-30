import { templateLiteralFlow } from "./templateLiteralFlow";
import type { Callback } from "./types";
import { spaceCallback } from "./utils";

type UniqueImportFlowArgs = Omit<
  Callback,
  "mappedImports" | "importVariables" | "contexts" | "counters" | "classNames"
> & {
  name?: string;
};

export const uniqueImportFlow = ({
  input,
  currentIndex,
  newTokenValue,
  identifier,
  uniqueImports,
  dynaticStyleChunks,
  dynaticStyleOrderedChunks,
  nameslessStyleOrderedChunks,
  openContexts,
  name,
}: UniqueImportFlowArgs) => {
  if (!uniqueImports[identifier].includes(newTokenValue)) {
    return { updatedIndex: currentIndex };
  }

  let value = newTokenValue;
  const startIndex = currentIndex - newTokenValue.length;

  const next = spaceCallback({ input, currentIndex });

  const templateLiteral = templateLiteralFlow({
    input,
    currentIndex: next.updatedIndex,
    newTokenValue: next.newTokenValue,
    identifier,
    dynaticStyleChunks,
    dynaticStyleOrderedChunks,
    nameslessStyleOrderedChunks,
    uniqueImports,
    openContexts,
  });

  if (templateLiteral.value) {
    value += templateLiteral.value;

    const context = openContexts.join("-");

    const chunkData = {
      startIndex,
      endIndex: templateLiteral.updatedIndex,
      value,
      variables: templateLiteral.variables ?? [],
    };

    if (name) {
      if (!dynaticStyleChunks[context]) {
        dynaticStyleChunks[context] = {};
      }

      dynaticStyleChunks[context][name] = chunkData;
      dynaticStyleOrderedChunks.push({ ...chunkData, name, context });
    } else {
      nameslessStyleOrderedChunks.push({ ...chunkData, context });
    }

    return { updatedIndex: templateLiteral.updatedIndex, exit: true };
  }

  return { updatedIndex: currentIndex };
};
