import { generateRegexOffPattern } from "@packages/regex";
import { getConfigFileData } from "./getConfigFileData";
import { getProjectAbsolutePath } from "@packages/paths";
import { getFile } from "@packages/files";
import { getRepositoryPackageJsons } from "@packages/package-json";
import { mapPackageJsonDependencies } from "./mapPackageJsonDependencies";

type DetectAllRepositoryDependenciesArgs = {
  skipDependencies?: boolean;
  skipPackageJsonPaths?: boolean;
  includePackageJsonDependencyTypesArrays?: boolean;
};

export const detectAllRepositoryDependencies = ({
  skipDependencies,
  skipPackageJsonPaths,
  includePackageJsonDependencyTypesArrays,
}: DetectAllRepositoryDependenciesArgs = {}) => {
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

  const gitIgonoreFile = getFile({ path: `${projectAbsolutePath}/.gitignore` }) ?? "";
  const dependenseeGitIgnoreFile = getFile({ path: ".gitignore" }) ?? "";
  const skipFilesAndFolders = [
    ...gitIgonoreFile.split(/\r\n|\r|\n/).filter(Boolean),
    ...dependenseeGitIgnoreFile.split(/\r\n|\r|\n/).filter(Boolean),
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

  const packageJsonPaths = getRepositoryPackageJsons({
    projectAbsolutePath,
    include: new Set(include ?? []),
    exclude: new Set(exclude ?? []),
    includePatterns,
    excludePatterns,
    skipFilesAndFolders,
  });

  if (skipDependencies) {
    return { packageJsonPaths };
  }

  const { dependenciesMap, parsedLockFile, packageJsonDependencyTypesArrays } = mapPackageJsonDependencies({
    packageJsonPaths: [...packageJsonPaths],
    projectAbsolutePath,
    packageIdentifiers,
    includePackageJsonDependencyTypesArrays,
  });

  if (skipPackageJsonPaths) {
    return { dependencies: dependenciesMap };
  }

  return { dependencies: dependenciesMap, packageJsonPaths, parsedLockFile, packageJsonDependencyTypesArrays };
};
