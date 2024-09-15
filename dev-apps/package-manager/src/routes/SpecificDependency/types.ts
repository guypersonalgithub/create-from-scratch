import { DependenciesToChange } from "@packages/alter-package-versions-types";

export type UpdateChangedDependenciesArgs = {
  path: string;
} & Omit<DependenciesToChange[string][number], "dependencyType" | "dependency">;
