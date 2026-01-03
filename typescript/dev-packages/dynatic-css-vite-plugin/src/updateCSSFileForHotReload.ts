type UpdateCSSFileForHotReloadArgs = {
  inserted: Map<string, string>;
  pseudoClasses: Map<string, string>;
  mediaQueries: Map<string, Map<string, string>>;
  descendantSelectors: Map<string, string>;
  configCSS?: string;
};

export const updateCSSFileForHotReload = ({
  inserted,
  pseudoClasses,
  mediaQueries,
  descendantSelectors,
  configCSS,
}: UpdateCSSFileForHotReloadArgs) => {
  let updatedCSSFile = "";

  for (const [key, value] of descendantSelectors.entries()) {
    updatedCSSFile += `${key} { ${value} }\n`;
  }

  for (const [key, value] of inserted.entries()) {
    const pseudoClass = pseudoClasses.get(key);
    const updatedKey = !pseudoClass ? key : `${key}${pseudoClass}`;

    updatedCSSFile += `.${updatedKey} { ${value} }\n`;
  }

  for (const [key, value] of mediaQueries.entries()) {
    updatedCSSFile += `${key} {\n`;

    for (const [subKey, subValue] of value.entries()) {
      const pseudoClass = pseudoClasses.get(key);
      const updatedKey = !pseudoClass ? subKey : `${key}${pseudoClass}`;

      updatedCSSFile += `.${updatedKey} { ${subValue} }\n`;
    }

    updatedCSSFile += "}\n";
  }

  if (configCSS) {
    updatedCSSFile += `\n${configCSS}`;
  }

  return updatedCSSFile;
};
