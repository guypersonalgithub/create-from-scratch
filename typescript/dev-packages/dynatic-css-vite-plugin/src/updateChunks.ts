import type { OutputBundle } from "rollup";
import { updateClasses } from "./updateClasses";
import { updateConfigClasses } from "./updateConfigClasses";
import type { DynaticConfiguration } from "@packages/dynatic-css";

type UpdateChunksArgs = {
  bundle: OutputBundle;
  inserted: Map<string, string>;
  pseudoClasses: Map<string, string>;
  mediaQueries: Map<string, Map<string, string>>;
  configCSS: string;
  filePath: string;
  fileText: string;
  updatedConfig: DynaticConfiguration;
  configObjectStartIndex: number;
};

export const updateChunks = ({
  bundle,
  inserted,
  pseudoClasses,
  mediaQueries,
  configCSS,
  filePath,
  fileText,
  updatedConfig,
  configObjectStartIndex,
}: UpdateChunksArgs) => {
  const insertedValues = inserted.entries();
  const length = [...insertedValues].length;

  if (length === 0) {
    return;
  }

  let updatedCSSFile = "";
  const staticClasses: string[] = [];

  for (const [key, value] of inserted.entries()) {
    staticClasses.push(key);

    const pseudoClass = pseudoClasses.get(key);
    const updatedKey = !pseudoClass ? key : `${key}${pseudoClass}`;

    updatedCSSFile += `.${updatedKey} { ${value} }\n`;
  }

  for (const [key, value] of mediaQueries.entries()) {
    updatedCSSFile += `${key} {\n`;

    for (const [subKey, subValue] of value.entries()) {
      const pseudoClass = pseudoClasses.get(key);
      const updatedKey = !pseudoClass ? subKey : `${key}${pseudoClass}`;
      staticClasses.push(updatedKey);

      updatedCSSFile += `.${updatedKey} { ${subValue} }\n`;
    }

    updatedCSSFile += "}\n";
  }

  updatedCSSFile += `\n${configCSS}`;

  const updated = updateClasses({ fileText, staticClasses });
  const updatedFileText = updateConfigClasses({
    fileText: updated,
    config: updatedConfig,
    configObjectStartIndex,
  });

  for (const [, chunk] of Object.entries(bundle)) {
    if (chunk.type === "asset" && chunk.fileName.endsWith(".css")) {
      chunk.source = updatedCSSFile + "\n" + chunk.source;
    }
  }
};
