export type { DependenciesMap } from "@packages/detect-repository-dependencies-types";

export type ConfigProperties = {
  include?: string[];
  exclude?: string[];
  includeFilesPattern?: string;
  excludeFilesPattern?: string;
  noNesting?: boolean;
  packageIdentifiers?: string[];
};
