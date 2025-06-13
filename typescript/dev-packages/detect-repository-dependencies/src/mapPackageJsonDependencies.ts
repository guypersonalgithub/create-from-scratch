import { readFileSync } from "fs";
import { fillDependenciesMap } from "./fillDependenciesMap";
import { type DependenciesMap } from "@packages/detect-repository-dependencies-types";
import { type ParsedPackageLock } from "./types";

type MapPackageJsonDependenciesArgs = {
  fullPathWithFile: string;
  dependenciesMap: DependenciesMap;
  parsedLockFile: ParsedPackageLock;
  packageIdentifiers?: string[];
};

export const mapPackageJsonDependencies = ({
  fullPathWithFile,
  dependenciesMap,
  parsedLockFile,
  packageIdentifiers,
}: MapPackageJsonDependenciesArgs) => {
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
};
