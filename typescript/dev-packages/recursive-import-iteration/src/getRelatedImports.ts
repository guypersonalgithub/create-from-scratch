type GetRelatedImportsArgs = {
  imports: Record<string, unknown>;
  mappedAliases: Record<string, string>;
};

export const getRelatedImports = ({ imports, mappedAliases }: GetRelatedImportsArgs) => {
  const relatedImports: { path: string; isPackage: boolean }[] = [];

  for (const path in imports) {
    if (path.startsWith("@packages")) {
      relatedImports.push({ path: mappedAliases[path], isPackage: true });
    } else if (path.startsWith(".")) {
      relatedImports.push({ path, isPackage: false });
    }
  }

  return relatedImports;
};
