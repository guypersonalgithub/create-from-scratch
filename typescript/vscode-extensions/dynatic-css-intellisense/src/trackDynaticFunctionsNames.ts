import { parseImports } from "@packages/import-parser";

const packageName = "@packages/dynatic-css";
const configName = "dynatic-css.config";

type TrackDynaticFunctionsNamesArgs = {
  document: string;
};

export const trackDynaticFunctionsNames = ({ document }: TrackDynaticFunctionsNamesArgs) => {
  const { imports, currentIndex } = parseImports({ input: document });
  const relevantImports: string[] = [];

  const packageImport = imports[packageName];
  if (packageImport) {
    const { exports, exportDefault, as } = packageImport;

    if (exports) {
      const exportNames = exports.map((exp) => exp.rename ?? exp.name);
      relevantImports.push(...exportNames);
    }

    if (exportDefault) {
      relevantImports.push(...exportDefault);
    }

    if (as) {
      relevantImports.push(...as);
    }
  }

  for (const property in imports) {
    if (property.includes(configName)) {
      const value = imports[property];
      const { exports, exportDefault, as } = value;

      if (exports) {
        const exportNames = exports.map((exp) => exp.rename ?? exp.name);
        relevantImports.push(...exportNames);
      }

      if (exportDefault) {
        relevantImports.push(...exportDefault);
      }

      if (as) {
        relevantImports.push(...as);
      }
    }
  }

  return { relevantImports, currentIndex };
};
