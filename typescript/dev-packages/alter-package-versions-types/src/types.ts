import { type DependencyType } from "@packages/package-json";

export type DependenciesToChange = Record<
  string,
  {
    dependencyType: DependencyType;
    dependency: string;
    newVersion: string;
  }[]
>;
