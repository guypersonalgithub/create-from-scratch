import { readFileSync, readdirSync } from "fs";
import { DependenciesMap } from "./types";
import { fillDependenciesMap } from "./fillDependenciesMap";
import { shouldSkipFile } from "./skipFile";

type IterateOverAllFilesArgs = {
  projectAbsolutePath: string;
  relativePath: string;
  iteratedPaths?: Set<string>;
  dependenciesMap?: DependenciesMap;
  include: Set<string>;
  exclude: Set<string>;
  includePattern?: RegExp;
  excludePattern?: RegExp;
  noNesting?: boolean;
  packageIdentifiers?: string[];
  skipFilesAndFolders: string[];
  parsedLockFile: {
    packages: Record<
      string,
      {
        resolved: string;
        link: boolean;
      }
    >;
  };
};

export const iterateOverAllFiles = ({
  projectAbsolutePath,
  relativePath,
  iteratedPaths = new Set<string>(),
  dependenciesMap = {},
  include,
  exclude,
  includePattern,
  excludePattern,
  noNesting,
  packageIdentifiers,
  skipFilesAndFolders,
  parsedLockFile,
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
    return dependenciesMap;
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
      excludePattern,
      includePattern,
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
        include,
        exclude,
        includePattern,
        excludePattern,
        noNesting,
        packageIdentifiers,
        skipFilesAndFolders,
        parsedLockFile,
      });

      continue;
    }

    const packageJsonFile = readFileSync(fullPathWithFile, {
      encoding: "utf-8",
    });
    const parsedFile = JSON.parse(packageJsonFile);
    const {
      name,
      dependencies = {},
      devDependencies = {},
      optionalDependencies = {},
      peerDependencies = {},
    } = parsedFile;

    const dependencyTypesArray: {
      dependencyType: string;
      data: Record<string, string>;
    }[] = [
      { dependencyType: "dependencies", data: dependencies },
      { dependencyType: "devDependencies", data: devDependencies },
      { dependencyType: "optionalDependencies", data: optionalDependencies },
      { dependencyType: "peerDependencies", data: peerDependencies },
    ];
    dependencyTypesArray.forEach((current) => {
      const { dependencyType, data } = current;

      fillDependenciesMap({
        name,
        fullPathWithFile,
        dependencies: data,
        dependencyType,
        dependenciesMap,
        parsedLockFile,
        packageIdentifiers,
      });
    });
  }

  return dependenciesMap;
};
