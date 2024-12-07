type GetImportsInFileArgs = {
  file: string;
};

export const getImportsInFile = ({ file }: GetImportsInFileArgs) => {
  const importRegex = /import\s+(?:[\w{}\*\s,]*\s+from\s+)?["'][^"']+["'];?/g;

  const importStatements = file.match(importRegex);
  if (!importStatements) {
    return [];
  }

  return importStatements as string[];
};
