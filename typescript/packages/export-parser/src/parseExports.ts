import { runFlows } from "./runFlows";
import type { Exports } from "./types";
import { spaceCallback } from "./utils";

type ParseExportsArgs = {
  input: string;
  includeTypes?: boolean;
};

export const parseExports = ({ input, includeTypes }: ParseExportsArgs) => {
  let currentIndex = 0;
  const exports: Exports = {};

  while (input.length > currentIndex) {
    const { updatedIndex, newTokenValue } = spaceCallback({ input, currentIndex });
    const response = runFlows({
      input,
      currentIndex: updatedIndex,
      newTokenValue,
      exports,
      includeTypes,
    });

    currentIndex = response.updatedIndex;
  }

  return { exports };
};
