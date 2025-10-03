import { runFlows } from "./runFlows";
import type { Imports } from "./types";
import { spaceCallback } from "./utils";

type ParseImportsArgs = {
  input: string;
  includeTypes?: boolean;
};

export const parseImports = ({ input, includeTypes }: ParseImportsArgs) => {
  let currentIndex = 0;
  const imports: Imports = {};

  while (input.length > currentIndex) {
    const { updatedIndex, newTokenValue } = spaceCallback({ input, currentIndex });
    const response = runFlows({
      input,
      currentIndex: updatedIndex,
      newTokenValue,
      imports,
      includeTypes,
    });
    if (!response) {
      break;
    }

    currentIndex = response.updatedIndex;
  }

  return { imports, currentIndex };
};
