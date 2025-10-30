import type { FullPathData } from "@packages/recursive-import-iteration";
import { parseDynatic } from "./parseDynatic";
import type { DynaticConfiguration } from "@packages/dynatic-css";

type ParseFullPathDataArgs = {
  path: string;
  value: FullPathData;
  fullParsedPaths: Map<string, FullPathData>;
  identifiers: string[];
  updatedConfig?: DynaticConfiguration;
  inserted: Map<string, string>;
  pseudoClasses: Map<string, string>;
  mediaQueries: Map<string, Map<string, string>>;
};

export const parseFullPathData = ({
  path,
  value,
  fullParsedPaths,
  identifiers,
  updatedConfig,
  inserted,
  pseudoClasses,
  mediaQueries,
}: ParseFullPathDataArgs) => {
  const { imports, exports, currentIndex, input } = value;

  let identifier: string | undefined;

  for (const imp in imports) {
    identifier = identifiers.find((identifier) => imp.endsWith(identifier));
    if (identifier) {
      break;
    }
  }

  if (!identifier) {
    return;
  }

  const updated = parseDynatic({
    input,
    from: currentIndex,
    identifier,
    updatedConfig,
    inserted,
    pseudoClasses,
    mediaQueries,
  });

  if (updated !== input) {
    fullParsedPaths.set(path, { imports, exports, currentIndex, input: updated });
  }
};
