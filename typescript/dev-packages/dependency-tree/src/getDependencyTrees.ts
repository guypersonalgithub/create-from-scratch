import {
  detectAllRepositoryDependencies,
  type ParsedPackageLock,
} from "@packages/detect-repository-dependencies";
import { type DependenciesProperties, type DependencyTree } from "./types";
import { recursiveDependencyTreeMapping } from "./recursiveDependencyTreeMapping";

export const getDependencyTrees = () => {
  const {
    dependencies = {},
    parsedLockFile = { packages: {}, dependencies: {} } as ParsedPackageLock,
    packageJsonDependencyTypesArrays = [],
  } = detectAllRepositoryDependencies({ includePackageJsonDependencyTypesArrays: true });

  const dependenciesProperties: DependenciesProperties = {};

  for (const dependency in dependencies) {
    const { data, isLocal } = dependencies[dependency];
    dependenciesProperties[dependency] = {};

    for (const path in data) {
      const { version, belongsTo } = data[path];
      if (!dependenciesProperties[dependency][version]) {
        dependenciesProperties[dependency][version] = { belongsTo: [], dependencies: {} };
      }

      dependenciesProperties[dependency][version].belongsTo.push(belongsTo);

      recursiveDependencyTreeMapping({
        parsedLockFile,
        dependenciesProperties,
        dependency,
        version,
        isLocal,
      });
    }
  }

  const dependencyTree: DependencyTree = {};

  packageJsonDependencyTypesArrays.forEach((packageJsonDependencyTypesArray) => {
    const { name, dependencyTypesArray } = packageJsonDependencyTypesArray;

    if (!dependencies[name]) {
      dependencyTree[name] = {};

      dependencyTypesArray.forEach((dependencyTypeArray) => {
        const { data } = dependencyTypeArray;

        for (const property in data) {
          const version = data[property];
          iterateOverNestedDependencies({
            dependencyTree,
            dependenciesProperties,
            property,
            version,
            alreadyIteratedDependencies: new Set(name),
          });
        }
      });
    }
  });
};

type IterateOverNestedDependenciesArgs = {
  dependencyTree: DependencyTree;
  dependenciesProperties: DependenciesProperties;
  property: string;
  version: string;
  alreadyIteratedDependencies: Set<string>;
};

const iterateOverNestedDependencies = ({
  dependencyTree,
  dependenciesProperties,
  property,
  version,
  alreadyIteratedDependencies,
}: IterateOverNestedDependenciesArgs) => {
  const currentKey = `${property}@${version}`;

  if (alreadyIteratedDependencies.has(currentKey)) {
    console.error(
      `"Encountered the same key ${currentKey} more than once - a circular dependency has been detected."`,
    );
    return;
  }

  dependencyTree[currentKey] = {};

  const newIteratedDependenciesSet = new Set(...alreadyIteratedDependencies);
  newIteratedDependenciesSet.add(currentKey);

  const nested = dependenciesProperties[property][version];
  const nestedDependencies = nested.dependencies;

  for (const property in nestedDependencies) {
    const version = nestedDependencies[property];
    iterateOverNestedDependencies({
      dependencyTree: dependencyTree[currentKey],
      dependenciesProperties,
      property,
      version,
      alreadyIteratedDependencies: newIteratedDependenciesSet,
    });
  }
};
