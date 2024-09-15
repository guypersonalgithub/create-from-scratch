import { NPMRegistry } from "@packages/detect-repository-dependencies-types";
import { Data } from "../../types";
import { usePath } from "@packages/router";
import { SpecificDependencyTable } from "./SpecificDependencyTable";
import { Button } from "@packages/button";
import { useRef } from "react";
import { DependenciesToChange } from "@packages/alter-package-versions-types";
import { UpdateChangedDependenciesArgs } from "./types";

type SpecificDependencyContentProps = {
  data?: NPMRegistry;
  versions: {
    label: string;
    value: string;
  }[];
  depedencyDetails?: Data[number];
};

export const SpecificDependencyContent = ({
  data,
  versions,
  depedencyDetails,
}: SpecificDependencyContentProps) => {
  const changedDependencies = useRef<DependenciesToChange>({});
  const { moveTo } = usePath();
  const { name, description } = data ?? {};

  const updateChangedDependencies = ({ path, newVersion }: UpdateChangedDependenciesArgs) => {
    const { name, instances = [] } = depedencyDetails ?? {};
    const currentPath = instances.find((instance) => instance.path === path);
    if (!name || !currentPath) {
      return;
    }

    const { version, dependencyType } = currentPath;

    if (version === newVersion) {
      return;
    }

    if (!changedDependencies.current[path]) {
      changedDependencies.current[path] = [];
    }

    const currentChanged = changedDependencies.current[path];
    const wasAlreadyChanged = currentChanged.findIndex((changed) => changed.dependency === name);
    if (wasAlreadyChanged !== -1) {
      currentChanged[wasAlreadyChanged].newVersion = newVersion;
    } else {
      currentChanged.push({
        dependencyType: dependencyType as DependenciesToChange[string][number]["dependencyType"],
        dependency: name,
        newVersion,
      });
    }
  };

  return (
    <div>
      <div>{name}</div>
      <div>{description}</div>
      <SpecificDependencyTable
        versions={versions}
        depedencyDetails={depedencyDetails}
        updateChangedDependencies={updateChangedDependencies}
      />
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
        <Button
          onClick={() => {
            moveTo({
              pathname: "/",
              overrideParams: true,
            });
          }}
        >
          Back to main
        </Button>
        <Button>Submit</Button>
      </div>
    </div>
  );
};
