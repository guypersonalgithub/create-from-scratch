import type { DynaticConfiguration } from "@packages/dynatic-css";
import { updateClasses } from "./updateClasses";
import { updateConfigClasses } from "./updateConfigClasses";
// import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { addImportIfNotExists, removeImportIfExists } from "@packages/typescript-file-manipulation";

type BuildDynaticArgs = {
  projectRoot: string;
  inserted: Map<string, string>;
  pseudoClasses: Map<string, string>;
  mediaQueries: Map<string, Map<string, string>>;
  configCSS?: string;
  fileText?: string;
  updatedConfig?: DynaticConfiguration;
  configObjectStartIndex?: number;
  mainFile?: string;
};

export const buildDynatic = ({
  projectRoot,
  inserted,
  pseudoClasses,
  mediaQueries,
  configCSS,
  fileText,
  updatedConfig,
  configObjectStartIndex,
  mainFile,
}: BuildDynaticArgs) => {
  const insertedValues = inserted.entries();
  const insertedMediaQueries = mediaQueries.entries();
  const length = [...insertedValues, ...insertedMediaQueries].length;

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

  if (configCSS) {
    updatedCSSFile += `\n${configCSS}`;
  }

  let updatedConfigFile: string | undefined;

  if (fileText && updatedConfig && configObjectStartIndex !== undefined) {
    const updated = updateClasses({ fileText, staticClasses });
    updatedConfigFile = updateConfigClasses({
      fileText: updated,
      config: updatedConfig,
      configObjectStartIndex,
    });
  }
  // writeFileSync(filePath, updatedConfigFile);

  const file = "virtual:generated.css";
  // const cssPath = `${projectRoot}/src/${file}`;

  // const mainFile = `${projectRoot}/src/main.tsx`;
  // const content = readFileSync(mainFile, "utf-8");

  // const importPath = `./${file}`;
  const importPath = file;
  // let updatedFile: string;

  if (!mainFile) {
    return {
      mainFile,
      cssPath: file,
      updatedCSSFile,
      updatedConfigFile,
    };
  }

  if (updatedCSSFile.length > 0) {
    // writeFileSync(cssPath, updatedCSSFile);

    mainFile = addImportIfNotExists({
      file: mainFile,
      importPath,
      importStatement: `\nimport "${importPath}";`,
    });
  } else {
    // unlinkSync(cssPath);

    mainFile = removeImportIfExists({
      file: mainFile,
      importPath,
    });
  }

  // writeFileSync(mainFile, updatedFile);

  return {
    mainFile,
    cssPath: file,
    updatedCSSFile,
    updatedConfigFile,
  };
};
