import { generateRegexOffPattern } from "@packages/regex";
import { getConfigFileData } from "./getConfigFileData";
import { getProjectAbsolutePath } from "@packages/paths";
import { iterateOverAllFiles } from "./iterateOverAllFiles";
import { getFile } from "@packages/files";
import { detectRepositoryPackageManager } from "@packages/package-manager";

type DetectAllRepositoryDependenciesArgs = {
  skipDependencies?: boolean;
  skipPackageJsonPaths?: boolean;
};

export const detectAllRepositoryDependencies = (args?: DetectAllRepositoryDependenciesArgs) => {
  const { skipDependencies, skipPackageJsonPaths } = args ?? {};
  const projectAbsolutePath = getProjectAbsolutePath();
  const config = getConfigFileData({ projectAbsolutePath });
  const {
    include,
    exclude,
    includeFilesPatterns = [],
    excludeFilesPatterns = [],
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
  const dependenseeGitIgnoreFile = getFile({ path: ".gitignore" }) ?? "";
  const skipFilesAndFolders = [
    ...gitIgonoreFile.split("\r\n").filter(Boolean),
    ...dependenseeGitIgnoreFile.split("\r\n").filter(Boolean),
  ];

  const includePatterns = includeFilesPatterns
    .map((includeFilesPattern) => {
      return generateRegexOffPattern({
        pattern: includeFilesPattern,
        divider: ".",
      });
    })
    .filter(Boolean) as RegExp[];

  const excludePatterns = excludeFilesPatterns
    .map((excludeFilesPattern) => {
      return generateRegexOffPattern({
        pattern: excludeFilesPattern,
        divider: ".",
      });
    })
    .filter(Boolean) as RegExp[];

  const { dependencies, packageJsonPaths } = iterateOverAllFiles({
    projectAbsolutePath,
    relativePath: "",
    include: new Set(include ?? []),
    exclude: new Set(exclude ?? []),
    includePatterns,
    excludePatterns,
    noNesting,
    packageIdentifiers,
    skipFilesAndFolders,
    parsedLockFile,
    skipDependencies,
    skipPackageJsonPaths,
  });

  return { dependencies, packageJsonPaths };
};
