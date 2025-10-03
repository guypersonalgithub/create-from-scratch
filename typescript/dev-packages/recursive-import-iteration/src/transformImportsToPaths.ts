type TransformImportsToPathsArgs = {
  imports: string[];
};

export const transformImportsToPaths = ({ imports }: TransformImportsToPathsArgs) => {
  const from = "from ";

  return imports
    .map((imp) => {
      const index = imp.indexOf(from);
      if (index === -1) {
        return;
      }

      const importedFrom = imp.slice(
        index + from.length + 1, // remove "
        getEndIndex({ imp }),
      );

      if (!importedFrom.startsWith(".") && !importedFrom.startsWith("@packages")) {
        return;
      }

      return importedFrom;
    })
    .filter(Boolean) as string[];
};

type GetEndIndexArgs = {
  imp: string;
};

const getEndIndex = ({ imp }: GetEndIndexArgs) => {
  if (imp.endsWith('";') || imp.endsWith("';")) {
    return imp.length - 2;
  }

  if (imp.endsWith(";")) {
    return imp.length - 1;
  }

  return imp.length;
};
