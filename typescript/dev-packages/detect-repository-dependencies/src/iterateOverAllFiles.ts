import { readdirSync } from "fs";
import { DependenciesMap, ParsedPackageLock } from "./types";
import { shouldSkipFile } from "./skipFile";
import { mapPackageJsonDependencies } from "./mapPackageJsonDependencies";

type IterateOverAllFilesArgs = {
  projectAbsolutePath: string;
  relativePath: string;
  iteratedPaths?: Set<string>;
  dependenciesMap?: DependenciesMap;
  packageJsonPaths?: Set<string>;
  include: Set<string>;
  exclude: Set<string>;
  includePatterns: RegExp[];
  excludePatterns: RegExp[];
  noNesting?: boolean;
  packageIdentifiers?: string[];
  skipFilesAndFolders: string[];
  parsedLockFile: ParsedPackageLock;
  skipDependencies?: boolean;
  skipPackageJsonPaths?: boolean;
};

export const iterateOverAllFiles = ({
  projectAbsolutePath,
  relativePath,
  iteratedPaths = new Set<string>(),
  dependenciesMap = {},
  packageJsonPaths = new Set<string>(),
  include,
  exclude,
  includePatterns,
  excludePatterns,
  noNesting,
  packageIdentifiers,
  skipFilesAndFolders,
  parsedLockFile,
  skipDependencies,
  skipPackageJsonPaths,
}: IterateOverAllFilesArgs) => {
  const skippedFolders =
    skipFilesAndFolders.length > 0 ? skipFilesAndFolders : ["node_modules", ".github", ".git"];
  const fullPath = `${projectAbsolutePath}${relativePath}`;
  const files = readdirSync(fullPath, { withFileTypes: true });
  if (iteratedPaths.has(fullPath)) {
    // TODO: Remove this console.error, if two local packages use another local package as a dependency it can be detected as a circular path even though it isn't.
    console.error(
      "Encountered the same folder path twice, there might be a circular path somewhere within the file system, skipping.",
      `Path: ${fullPath}`,
    );
    return { depencencies: dependenciesMap, packageJsonPaths };
  }
  iteratedPaths.add(fullPath);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (skippedFolders.includes(file.name)) {
      continue;
    }

    const fullPathWithFile = `${fullPath}/${file.name}`;

    const skipFile = shouldSkipFile({
      fullPathWithFile,
      exclude,
      include,
      file,
      excludePatterns,
      includePatterns,
    });

    if (skipFile) {
      continue;
    }

    const isDirectory = file.isDirectory();

    if (isDirectory && !noNesting) {
      iterateOverAllFiles({
        projectAbsolutePath,
        relativePath: `${relativePath}/${file.name}`,
        iteratedPaths,
        dependenciesMap,
        packageJsonPaths,
        include,
        exclude,
        includePatterns,
        excludePatterns,
        noNesting,
        packageIdentifiers,
        skipFilesAndFolders,
        parsedLockFile,
        skipDependencies,
        skipPackageJsonPaths,
      });

      continue;
    }

    if (!skipDependencies) {
      mapPackageJsonDependencies({
        fullPathWithFile,
        dependenciesMap,
        parsedLockFile,
        packageIdentifiers,
      });
    }

    if (!skipPackageJsonPaths) {
      packageJsonPaths.add(fullPathWithFile);
    }
  }

  return { dependencies: dependenciesMap, packageJsonPaths };
};
