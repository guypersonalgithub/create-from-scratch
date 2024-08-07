import { DependenciesMap } from "./types";

type FillDependenciesMapArgs = {
  name: string;
  fullPathWithFile: string;
  dependencies: Record<string, string>;
  dependencyType: string;
  dependenciesMap: DependenciesMap;
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

export const fillDependenciesMap = ({
  name,
  fullPathWithFile,
  dependencies,
  dependencyType,
  dependenciesMap,
  parsedLockFile,
}: FillDependenciesMapArgs) => {
  for (const dependency in dependencies) {
    const dependencyVersion = dependencies[dependency];
    if (!dependenciesMap[dependency]) {
      dependenciesMap[dependency] = {
        data: {},
        isLocal: false,
      };
    }

    const isLocal = !!parsedLockFile.packages?.[`node_modules/${dependency}`]?.link;

    dependenciesMap[dependency].data[fullPathWithFile] = {
      version: dependencyVersion,
      belongsTo: name,
      dependencyType,
    };

    dependenciesMap[dependency].isLocal = isLocal;
  }
};
