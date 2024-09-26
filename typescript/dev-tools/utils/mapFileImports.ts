type MapFileImportsArgs = {
  file: string;
};

export const mapFileImports = ({ file }: MapFileImportsArgs) => {
  const importRegex = /import\s+[^'"]+['"]([^'"]+)['"];?/g;
  let match;
  const imports: string[] = [];

  while ((match = importRegex.exec(file)) !== null) {
    const importString = match[0];
    imports.push(importString);
  }

  return imports;
};
