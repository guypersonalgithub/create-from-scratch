import { generateRegexOffPattern, getFile } from "../../utils";
import { getConfigFileData } from "./getConfigFileData";
import { getProjectAbsolutePath } from "../../paths";
import { iterateOverAllFiles } from "./iterateOverAllFiles";

export const detectAllRepositoryDependencies = () => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const config = getConfigFileData({ projectAbsolutePath });
  const { include, exclude, includeFilesPattern, excludeFilesPattern, noNesting } = config;

  const gitIgonoreFile = getFile({ path: `${projectAbsolutePath}/.gitignore` }) ?? "";
  const skipFilesAndFolders = gitIgonoreFile.split("\r\n").filter(Boolean);

  const includePattern = generateRegexOffPattern({
    pattern: includeFilesPattern,
    divider: ".",
  });

  const excludePattern = generateRegexOffPattern({
    pattern: excludeFilesPattern,
    divider: ".",
  });

  const dependencies = iterateOverAllFiles({
    projectAbsolutePath,
    relativePath: "",
    include: new Set(include ?? []),
    exclude: new Set(exclude ?? []),
    includePattern,
    excludePattern,
    noNesting,
    skipFilesAndFolders,
  });

  return dependencies;
};
