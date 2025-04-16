export type DependencyType =
  | "dependencies"
  | "devDependencies"
  | "optionalDependencies"
  | "peerDependencies";

export type PackageJson = {
  name: string;
  version: string;
  description?: string;
  type: "module" | "commonjs";
  private?: boolean;
  workspaces?: string[];
  scripts?: Record<string, string>;
  author?: string;
  license?: string;
  main?: string;
  module?: string;
  types?: string;
  exports?: Record<string, Record<string, string>>;
  files?: string[];
} & Partial<Record<DependencyType, Record<string, string>>>;
