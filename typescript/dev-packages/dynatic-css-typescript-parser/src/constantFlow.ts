import { stringDefinitions } from "./constants";
import { stringFlow } from "./stringFlow";
import { tokenizerFlows } from "./tokenizerFlows";
import type { Callback } from "./types";
import { uniqueImportFlow } from "./uniqueImportFlow";
import { spaceCallback } from "./utils";

export const constantFlow = ({
  input,
  currentIndex,
  uniqueImports,
  identifier,
  dynaticStyleChunks,
  dynaticStyleOrderedChunks,
  nameslessStyleOrderedChunks,
  mappedImports,
  importVariables,
  contexts,
  counters,
  openContexts,
  classNames,
}: Callback) => {
  const space1 = spaceCallback({ input, currentIndex });

  if (space1.newTokenValue === "{") {
    // TODO: spreadConstants
    return { updatedIndex: space1.updatedIndex };
  }

  const name = space1.newTokenValue;

  let next = spaceCallback({ input, currentIndex: space1.updatedIndex });
  while (next.newTokenValue !== "=" && next.updatedIndex < input.length) {
    next = spaceCallback({ input, currentIndex: next.updatedIndex });
  }

  next = spaceCallback({ input, currentIndex: next.updatedIndex });

  const unique = uniqueImportFlow({
    input,
    currentIndex: next.updatedIndex,
    newTokenValue: next.newTokenValue,
    identifier,
    uniqueImports,
    dynaticStyleChunks,
    dynaticStyleOrderedChunks,
    nameslessStyleOrderedChunks,
    openContexts,
    name,
  });

  if (unique.exit) {
    return { updatedIndex: unique.updatedIndex };
  }

  if (next.newTokenValue === "(") {
    const { updatedIndex } = parenthesisConstant({
      input,
      currentIndex: next.updatedIndex,
      newTokenValue: next.newTokenValue,
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
      name,
    });

    return { updatedIndex };
  } else if (stringDefinitions.has(next.newTokenValue)) {
    const { updatedIndex, value } = stringFlow({
      newTokenValue: next.newTokenValue,
      input,
      currentIndex: next.updatedIndex,
    });

    const context = openContexts.join("-");

    if (value) {
      contexts[context][name] = { type: "string", value };
    } else {
      contexts[context][name] = { type: "variable" };
    }

    return { updatedIndex };
  }

  return { updatedIndex: space1.updatedIndex };
};

const spreadConstants = () => {};

const typedFunctionConstant = () => {};

const parenthesisConstant = ({
  input,
  currentIndex,
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
  name,
}: Callback & { name: string }) => {
  let parenthesisCount = 1;

  let next = spaceCallback({ input, currentIndex });

  if (next.newTokenValue === ")") {
    parenthesisCount--;
  }

  while (parenthesisCount > 0 && next.updatedIndex < input.length) {
    next = spaceCallback({ input, currentIndex: next.updatedIndex });

    if (next.newTokenValue === "(") {
      parenthesisCount++;
    } else if (next.newTokenValue === ")") {
      parenthesisCount--;
    }
  }

  // TODO: make this more accurate. There is no reason to look for an arrow beyond ")" unless the function has a return type.
  // The current implementation might iterate unneedlessly over a large amount of code for no reason.

  while (
    next.updatedIndex < input.length && next.newTokenValue === "="
      ? input[next.updatedIndex] !== ">"
      : true && next.newTokenValue !== ";"
  ) {
    next = spaceCallback({ input, currentIndex: next.updatedIndex });
  }

  if (next.newTokenValue === "=" && input[next.updatedIndex] === ">") {
    next = spaceCallback({ input, currentIndex: next.updatedIndex + 1 });
    if (next.newTokenValue === "{") {
      next = spaceCallback({ input, currentIndex: next.updatedIndex });
      contexts[openContexts.join("-")][name] = { type: "function" };
      openContexts.push(name);
      const openContextsKey = openContexts.join("-");
      if (!contexts[openContextsKey]) {
        contexts[openContextsKey] = {};
      }

      while (next.updatedIndex < input.length && next.newTokenValue !== "}") {
        const updatedIndex = tokenizerFlows({
          input,
          currentIndex: next.updatedIndex,
          newTokenValue: next.newTokenValue,
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
        }).updatedIndex;

        next = spaceCallback({ input, currentIndex: updatedIndex });
      }
    }

    openContexts.pop();

    return { updatedIndex: next.updatedIndex };
  }

  return { updatedIndex: next.updatedIndex };
};
