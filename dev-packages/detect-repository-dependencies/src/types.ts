export type { DependenciesMap } from "@packages/detect-repository-dependencies-types";

export type ConfigProperties = {
  include?: string[];
  exclude?: string[];
  includeFilesPatterns?: string[];
  excludeFilesPatterns?: string[];
  noNesting?: boolean;
  packageIdentifiers?: string[];
};
