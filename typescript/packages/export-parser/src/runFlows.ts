import { exportFlow } from "./exportFlow";
import type { Callback } from "./types";

const callbacks: Record<string, (args: Callback) => { updatedIndex: number } | undefined> = {
  export: exportFlow,
};

export const runFlows = ({
  input,
  currentIndex,
  newTokenValue,
  exports,
  includeTypes,
}: Callback) => {
  if (!Object.hasOwn(callbacks, newTokenValue)) {
    return { updatedIndex: currentIndex };
  }

  const callback = callbacks[newTokenValue];
  if (!callback) {
    return { updatedIndex: currentIndex };
  }

  const response = callback({ input, currentIndex, newTokenValue, exports, includeTypes });

  if (!response) {
    return { updatedIndex: currentIndex };
  }

  return response;
};
