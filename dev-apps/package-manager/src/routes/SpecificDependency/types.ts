import { DependenciesToChange } from "@packages/alter-package-versions-types";
import { ParsedData } from "../../types";

export type UpdateChangedDependenciesArgs = {
  path: string;
} & Omit<DependenciesToChange[string][number], "dependencyType" | "dependency">;

export type SpecificDependencyTableProps = {
  versions: {
    label: string;
    value: string;
  }[];
  depedencyDetails?: ParsedData[number];
  updateChangedDependencies: ({ path, newVersion }: UpdateChangedDependenciesArgs) => void;
};

export type InstancesType = NonNullable<
  SpecificDependencyTableProps["depedencyDetails"]
>["instances"];
