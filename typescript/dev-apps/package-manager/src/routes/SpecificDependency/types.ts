import { type DependenciesToChange } from "@packages/alter-package-versions-types";
import { type ParsedData } from "../../types";

export type UpdateChangedDependenciesArgs = {
  path: string;
} & Omit<DependenciesToChange[string][number], "dependencyType" | "dependency">;

export type SpecificDependencyTableProps = {
  name?: string;
  versions: {
    label: string;
    value: string;
  }[];
  depedencyDetails?: ParsedData[number];
  updateChangedDependencies: ({ path, newVersion }: UpdateChangedDependenciesArgs) => void;
  changedDependencies: DependenciesToChange;
};

export type InstancesType = NonNullable<
  SpecificDependencyTableProps["depedencyDetails"]
>["instances"];
