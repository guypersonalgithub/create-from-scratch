import type { ParsedPackageLock } from "@packages/detect-repository-dependencies";
import type { DependenciesProperties } from "./types";
import type { DependencyType } from "@packages/package-json";

type RecursiveDependencyTreeMappingArgs = {
  packageJsonKey?: string;
  parsedLockFile: ParsedPackageLock;
  dependenciesProperties: DependenciesProperties;
  dependency: string;
  version: string;
  isLocal: boolean;
};

export const recursiveDependencyTreeMapping = ({
  packageJsonKey = "",
  parsedLockFile,
  dependenciesProperties,
  dependency,
  version,
  isLocal,
}: RecursiveDependencyTreeMappingArgs) => {
  packageJsonKey = packageJsonKey.length > 0 ? `${packageJsonKey}/` : packageJsonKey;
  packageJsonKey = `${packageJsonKey}node_modules/${dependency}`;

  const packageLockKeyProperties = parsedLockFile.packages[packageJsonKey];
  if (!packageLockKeyProperties) {
    return;
  }

  const {
    dependencies = {},
    devDependencies = {},
    peerDependencies = {},
    optionalDependencies = {},
  } = parsedLockFile.packages[packageJsonKey];

  populateDependencies({
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies,
    packageJsonKey,
    parsedLockFile,
    dependenciesProperties,
    dependency,
    version,
    isLocal,
  });
};

type PopulateDependenciesArgs = Pick<ParsedPackageLock["packages"][string], DependencyType> &
  RecursiveDependencyTreeMappingArgs;

const populateDependencies = ({
  dependencies,
  devDependencies,
  peerDependencies,
  optionalDependencies,
  packageJsonKey,
  parsedLockFile,
  dependenciesProperties,
  dependency,
  version,
  isLocal,
}: PopulateDependenciesArgs) => {
  [
    dependencies ?? {},
    devDependencies ?? {},
    peerDependencies ?? {},
    optionalDependencies ?? {},
  ].forEach((currentDependencies) => {
    for (const currentDependency in currentDependencies) {
      const packageVersion = currentDependencies[currentDependency];

      dependenciesProperties[dependency][version].dependencies[currentDependency] = packageVersion;

      if (isLocal) {
        continue;
      }

      if (!dependenciesProperties[currentDependency]) {
        dependenciesProperties[currentDependency] = {};
      }

      if (!dependenciesProperties[currentDependency][packageVersion]) {
        dependenciesProperties[currentDependency][packageVersion] = {
          belongsTo: [dependency],
          dependencies: {},
        };
      }

      recursiveDependencyTreeMapping({
        packageJsonKey,
        parsedLockFile,
        dependenciesProperties,
        dependency: currentDependency,
        version: packageVersion,
        isLocal,
      });
    }
  });
};
