import { Dirent } from "fs";

type ShouldSkipFileArgs = {
  fullPathWithFile: string;
  exclude: Set<string>;
  include: Set<string>;
  file: Dirent;
  excludePattern?: RegExp;
  includePattern?: RegExp;
};

export const shouldSkipFile = ({
  fullPathWithFile,
  exclude,
  include,
  file,
  excludePattern,
  includePattern,
}: ShouldSkipFileArgs) => {
  const isExcluded =
    exclude.size === 0 ? false : exclude.has(fullPathWithFile) || exclude.has(file.name);

  if (isExcluded) {
    return true;
  }

  const isExcludedRegex = !excludePattern
    ? false
    : excludePattern.test(fullPathWithFile) || excludePattern.test(file.name);

  if (isExcludedRegex) {
    return true;
  }

  const isIncluded =
    include.size === 0 ? true : include.has(fullPathWithFile) || include.has(file.name);

  if (!isIncluded) {
    return true;
  }

  const isDirectory = file.isDirectory();

  const isIncludedRegex = !includePattern
    ? true
    : isDirectory ||
      file.name === "package.json" ||
      includePattern.test(fullPathWithFile) ||
      includePattern.test(file.name);

  if (!isIncludedRegex) {
    return true;
  }

  return false;
};
