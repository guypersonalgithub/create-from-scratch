import { importFlow } from "./importFlow";
import type { Callback } from "./types";

const callbacks: Record<string, (args: Callback) => { updatedIndex: number } | undefined> = {
  import: importFlow,
};

export const runFlows = ({
  input,
  currentIndex,
  newTokenValue,
  imports,
  includeTypes,
}: Callback) => {
  if (!Object.hasOwn(callbacks, newTokenValue)) {
    return;
  }

  const callback = callbacks[newTokenValue];
  const response = callback({ input, currentIndex, newTokenValue, imports, includeTypes });

  if (!response) {
    return;
  }

  return response;
};
