type ExtractDirectoryPathArgs = {
  path: string;
};

export const extractDirectoryPath = ({ path }: ExtractDirectoryPathArgs) => {
  const identifiers = new Set<string>(["\\", "/"]);

  for (let i = path.length - 1; i >= 0; i--) {
    const current = path[i];
    if (identifiers.has(current)) {
      return path.slice(0, i);
    }
  }

  return path;
};
