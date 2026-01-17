type GetRelatedImportsArgs = {
  imports: Record<string, unknown>;
  mappedAliases: Record<string, string>;
};

export const getRelatedImports = ({ imports, mappedAliases }: GetRelatedImportsArgs) => {
  const relatedImports: { path: string; isPackage: boolean }[] = [];

  for (const path in imports) {
    if (path.startsWith("@packages")) {
      const relatedImportPath = mappedAliases[path];
      if (!relatedImportPath) {
        throw `Missing related import ${path}`;
      }

      relatedImports.push({ path: relatedImportPath, isPackage: true });
    } else if (path.startsWith(".")) {
      relatedImports.push({ path, isPackage: false });
    }
  }

  return relatedImports;
};
