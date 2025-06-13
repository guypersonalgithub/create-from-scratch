import { type DependenciesMap, type ParsedPackageLock } from "./types";

type FillDependenciesMapArgs = {
  name: string;
  fullPathWithFile: string;
  dependencies: Record<string, string>;
  dependencyType: string;
  dependenciesMap: DependenciesMap;
  parsedLockFile: ParsedPackageLock;
  packageIdentifiers?: string[];
};

export const fillDependenciesMap = ({
  name,
  fullPathWithFile,
  dependencies,
  dependencyType,
  dependenciesMap,
  parsedLockFile,
  packageIdentifiers = [],
}: FillDependenciesMapArgs) => {
  for (const dependency in dependencies) {
    const dependencyVersion = dependencies[dependency];
    if (!dependenciesMap[dependency]) {
      dependenciesMap[dependency] = {
        data: {},
        isLocal: false,
      };
    }

    const packageLockDependencyData = parsedLockFile.packages?.[`node_modules/${dependency}`];
    const isLinked = !!packageLockDependencyData?.link;
    const isIdentifiedAsLocal =
      packageIdentifiers.length > 0
        ? !!packageIdentifiers.find(
            (identifier) =>
              packageLockDependencyData?.resolved?.includes(identifier) ||
              dependency.includes(identifier),
          )
        : true;
    const isLocal = isLinked && isIdentifiedAsLocal;

    dependenciesMap[dependency].data[fullPathWithFile] = {
      version: dependencyVersion,
      belongsTo: name,
      dependencyType,
    };

    dependenciesMap[dependency].isLocal = isLocal;
  }
};
