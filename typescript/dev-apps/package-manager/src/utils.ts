import { DependenciesMap } from "@packages/detect-repository-dependencies-types";
import { semverOptions } from "./constants";

type GetSemVerArgs = {
  version: string;
};

export const getSemVer = ({ version }: GetSemVerArgs) => {
  const semver =
    detectSemVer({ version, amountOfDigits: 2 }) ??
    detectSemVer({ version, amountOfDigits: 1 }) ??
    "";
  const actualVersion = version.slice(semver.length);
  return {
    semver,
    actualVersion,
  };
};

type DetectSemVerArgs = {
  version: string;
  amountOfDigits: number;
};

const detectSemVer = ({ version, amountOfDigits }: DetectSemVerArgs) => {
  const charsToDetect = version.slice(0, amountOfDigits);
  return semverOptions.find((option) => option.value === charsToDetect)?.value;
};

type ParseDependenciesDataArgs = {
  currentData: DependenciesMap;
};

export const parseDependenciesData = ({ currentData }: ParseDependenciesDataArgs) => {
  return Object.entries(currentData).map(([key, value]) => {
    const { data, isLocal } = value;
    const instances = Object.entries(data).map(([path, details]) => {
      return {
        ...details,
        path,
      };
    });

    return {
      name: key,
      instances,
      isLocal,
    };
  });
};
