import type { DependencyType } from "@packages/package-json";

export type { DependenciesMap } from "@packages/detect-repository-dependencies-types";

export type ConfigProperties = {
  include?: string[];
  exclude?: string[];
  includeFilesPatterns?: string[];
  excludeFilesPatterns?: string[];
  noNesting?: boolean;
  packageIdentifiers?: string[];
};

export type ParsedPackageLock = {
  packages: Record<
    string,
    {
      version: string;
      resolved: string;
      link?: boolean;
    } & Partial<Record<DependencyType, Record<string, string>>>
  >;
  dependencies: Record<
    string,
    {
      version: string;
      resolved: string;
      integrity: string;
      dev: boolean;
      requires: Record<string, string>;
    }
  >;
};

export type PackageJsonDependencyTypesArray = {
  name: string;
  dependencyTypesArray: {
    dependencyType: DependencyType;
    data: Record<string, string>;
  }[];
};
