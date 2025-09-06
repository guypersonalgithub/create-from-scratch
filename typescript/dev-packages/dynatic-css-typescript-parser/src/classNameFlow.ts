import { expressionInterpolationFlow } from "./expressionInterpolationFlow";
import type { Callback } from "./types";
import { spaceCallback } from "./utils";

export const classNameFlow = ({
  input,
  currentIndex,
  newTokenValue,
  openContexts,
  classNames,
  identifier,
  dynaticStyleChunks,
  dynaticStyleOrderedChunks,
  nameslessStyleOrderedChunks,
  uniqueImports,
}: Callback) => {
  let next = spaceCallback({ input, currentIndex });
  if (next.newTokenValue !== "=") {
    return { updatedIndex: currentIndex };
  }

  const start = next.updatedIndex;

  next = spaceCallback({ input, currentIndex: next.updatedIndex });

  const expressionInterpolation = expressionInterpolationFlow({
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

  if (!expressionInterpolation.value) {
    return { updatedIndex: currentIndex };
  }

  classNames.push({
    startIndex: start,
    endIndex: expressionInterpolation.updatedIndex,
    value: expressionInterpolation.value,
    variables: expressionInterpolation.variables ?? [],
    context: openContexts.join("-"),
  });

  return { updatedIndex: expressionInterpolation.updatedIndex };
};
