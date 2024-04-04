import { readFileSync, readdirSync } from "fs";
import { generateRegexOffPattern, getProjectAbsolutePath } from "../utils";
import { DependenciesMap } from "./types";
import { getConfigFileData } from "./getConfigFileData";

export const detectAllRepositoryDependencies = () => {
  const absolutePath = getProjectAbsolutePath();
  const config = getConfigFileData({ absolutePath });
  const {
    include,
    exclude,
    includeFilesPattern,
    excludeFilesPattern,
    noNesting,
  } = config;

  const includePattern = generateRegexOffPattern({
    pattern: includeFilesPattern,
    divider: ".",
  });

  const excludePattern = generateRegexOffPattern({
    pattern: excludeFilesPattern,
    divider: ".",
  });

  const dependencies = iterateOverAllFiles({
    absolutePath,
    relativePath: "",
    include: new Set(include ?? []),
    exclude: new Set(exclude ?? []),
    includePattern,
    excludePattern,
    noNesting,
  });

  return dependencies;
};

type IterateOverAllFilesArgs = {
  absolutePath: string;
  relativePath: string;
  iteratedPaths?: Set<string>;
  dependenciesMap?: DependenciesMap;
  include: Set<string>;
  exclude: Set<string>;
  includePattern?: RegExp;
  excludePattern?: RegExp;
  noNesting?: boolean;
};

const iterateOverAllFiles = ({
  absolutePath,
  relativePath,
  iteratedPaths = new Set<string>(),
  dependenciesMap = {},
  include,
  exclude,
  includePattern,
  excludePattern,
  noNesting,
}: IterateOverAllFilesArgs) => {
  const skippedFolders = ["node_modules", ".github", ".git"];
  const fullPath = `${absolutePath}${relativePath}`;
  const files = readdirSync(fullPath, { withFileTypes: true });
  if (iteratedPaths.has(fullPath)) {
    console.error(
      "Encountered the same folder path twice, there might be a circular path somewhere within the file system, skipping.",
      `Path: ${fullPath}`
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

    const isExcluded =
      exclude.size === 0
        ? false
        : exclude.has(fullPathWithFile) || exclude.has(file.name);

    if (isExcluded) {
      continue;
    }

    const isExcludedRegex = !excludePattern
      ? false
      : excludePattern.test(fullPathWithFile) || excludePattern.test(file.name);

    if (isExcludedRegex) {
      continue;
    }

    const isIncluded =
      include.size === 0
        ? true
        : include.has(fullPathWithFile) || include.has(file.name);

    if (!isIncluded) {
      continue;
    }

    const isDirectory = file.isDirectory();

    const isIncludedRegex = !includePattern
      ? true
      : isDirectory ||
        file.name === "package.json" ||
        includePattern.test(fullPathWithFile) ||
        includePattern.test(file.name);

    if (!isIncludedRegex) {
      continue;
    }

    if (isDirectory && !noNesting) {
      iterateOverAllFiles({
        absolutePath,
        relativePath: `${relativePath}/${file.name}`,
        iteratedPaths,
        dependenciesMap,
        include,
        exclude,
        includePattern,
        excludePattern,
        noNesting,
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
      });
    });
  }

  return dependenciesMap;
};

type FillDependenciesMapArgs = {
  name: string;
  fullPathWithFile: string;
  dependencies: Record<string, string>;
  dependencyType: string;
  dependenciesMap: DependenciesMap;
};

const fillDependenciesMap = ({
  name,
  fullPathWithFile,
  dependencies,
  dependencyType,
  dependenciesMap,
}: FillDependenciesMapArgs) => {
  for (const dependency in dependencies) {
    const dependencyVersion = dependencies[dependency];
    if (!dependenciesMap[dependency]) {
      dependenciesMap[dependency] = {};
    }

    dependenciesMap[dependency][fullPathWithFile] = {
      version: dependencyVersion,
      belongsTo: name,
      dependencyType,
    };
  }
};
