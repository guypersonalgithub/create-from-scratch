import type { DynaticConfiguration } from "@packages/dynatic-css";
import { updateClasses } from "./updateClasses";
import { updateConfigClasses } from "./updateConfigClasses";
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { addImportIfNotExists, removeImportIfExists } from "@packages/typescript-file-manipulation";

type BuildDynaticArgs = {
  projectRoot: string;
  inserted: Map<string, string>;
  pseudoClasses: Map<string, string>;
  mediaQueries: Map<string, Map<string, string>>;
  configCSS: string;
  filePath: string;
  fileText: string;
  updatedConfig: DynaticConfiguration;
  configObjectStartIndex: number;
};

export const buildDynatic = ({
  projectRoot,
  inserted,
  pseudoClasses,
  mediaQueries,
  configCSS,
  filePath,
  fileText,
  updatedConfig,
  configObjectStartIndex,
}: BuildDynaticArgs) => {
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
  writeFileSync(filePath, updatedFileText);

  const file = "generated.css";

  const path = `${projectRoot}/src/${file}`;

  const mainFile = `${projectRoot}/src/main.tsx`;
  const content = readFileSync(mainFile, "utf-8");

  const importPath = `./${file}`;
  let updatedFile: string;

  if (updatedCSSFile.length > 0) {
    writeFileSync(path, updatedCSSFile);

    updatedFile = addImportIfNotExists({
      file: content,
      importPath,
      importStatement: `\nimport "${importPath}";`,
    });
  } else {
    unlinkSync(path);

    updatedFile = removeImportIfExists({
      file: content,
      importPath,
    });
  }

  writeFileSync(mainFile, updatedFile);
};
