import { DependenciesMap } from "./types";

type FillDependenciesMapArgs = {
  name: string;
  fullPathWithFile: string;
  dependencies: Record<string, string>;
  dependencyType: string;
  dependenciesMap: DependenciesMap;
};

export const fillDependenciesMap = ({
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
