import { generateRegexOffPattern } from "@packages/regex";
import { getConfigFileData } from "./getConfigFileData";
import { getProjectAbsolutePath } from "@packages/paths";
import { iterateOverAllFiles } from "./iterateOverAllFiles";
import { getFile } from "@packages/files";
import { detectRepositoryPackageManager } from "@packages/package-manager";

export const detectAllRepositoryDependencies = () => {
  const projectAbsolutePath = getProjectAbsolutePath();
  const config = getConfigFileData({ projectAbsolutePath });
  const {
    include,
    exclude,
    includeFilesPattern,
    excludeFilesPattern,
    noNesting,
    packageIdentifiers,
  } = config;

  const { lock } = detectRepositoryPackageManager();
  const lockFile = getFile({ path: `${projectAbsolutePath}/${lock}` });
  const parsedLockFile = (lockFile ? JSON.parse(lockFile) : { packages: {} }) as {
    // TODO: Add methods for yarn and pnpm.
    packages: Record<
      string,
      {
        resolved: string;
        link: boolean;
      }
    >;
  };
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
    packageIdentifiers,
    skipFilesAndFolders,
    parsedLockFile,
  });

  return dependencies;
};
