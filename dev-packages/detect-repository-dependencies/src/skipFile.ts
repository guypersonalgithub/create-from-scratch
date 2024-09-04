import { Dirent } from "fs";

type ShouldSkipFileArgs = {
  fullPathWithFile: string;
  exclude: Set<string>;
  include: Set<string>;
  file: Dirent;
  includePatterns: RegExp[];
  excludePatterns: RegExp[];
};

export const shouldSkipFile = ({
  fullPathWithFile,
  exclude,
  include,
  file,
  excludePatterns,
  includePatterns,
}: ShouldSkipFileArgs) => {
  const isExcluded =
    exclude.size === 0 ? false : exclude.has(fullPathWithFile) || exclude.has(file.name);

  if (isExcluded) {
    return true;
  }

  const isExcludedRegex =
    excludePatterns.length === 0
      ? false
      : excludePatterns.some((excludePattern) => excludePattern.test(fullPathWithFile)) ||
        excludePatterns.some((excludePattern) => excludePattern.test(file.name));

  if (isExcludedRegex) {
    return true;
  }

  const isIncluded =
    include.size === 0 ? true : include.has(fullPathWithFile) || include.has(file.name);

  if (!isIncluded) {
    return true;
  }

  const isDirectory = file.isDirectory();

  const isIncludedRegex =
    includePatterns.length === 0
      ? true
      : isDirectory ||
        file.name === "package.json" ||
        includePatterns.some((includePattern) => includePattern.test(fullPathWithFile)) ||
        includePatterns.some((includePattern) => includePattern.test(file.name));

  if (!isIncludedRegex) {
    return true;
  }

  return false;
};
