import { NPMRegistry } from "@packages/detect-repository-dependencies-types";
import { ParsedData } from "../../types";
import { usePath } from "@packages/router";
import { SpecificDependencyTable } from "./SpecificDependencyTable";
import { Button } from "@packages/button";
import { useRef } from "react";
import { DependenciesToChange } from "@packages/alter-package-versions-types";
import { UpdateChangedDependenciesArgs } from "./types";
import { useActionState } from "@packages/fetch-management";
import { parseDependenciesData } from "../../utils";

type SpecificDependencyContentProps = {
  data?: NPMRegistry;
  versions: {
    label: string;
    value: string;
  }[];
  depedencyDetails?: ParsedData[number];
};

export const SpecificDependencyContent = ({
  data,
  versions,
  depedencyDetails,
}: SpecificDependencyContentProps) => {
  const changedDependencies = useRef<DependenciesToChange>({});
  const { isLoading, isError, initiateAction } = useActionState({ id: "updateDependency" });
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
      const updatedDependencies = changedDependencies.current[path].filter(
        (updated) => updated.dependency !== name,
      );
      if (updatedDependencies.length === 0) {
        delete changedDependencies.current[path];
      } else {
        changedDependencies.current[path] = updatedDependencies;
      }

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
        name={data?.name}
        versions={versions}
        depedencyDetails={depedencyDetails}
        updateChangedDependencies={updateChangedDependencies}
        changedDependencies={changedDependencies.current}
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
        <Button
          onClick={async () => {
            if (Object.keys(changedDependencies.current).length === 0) {
              return;
            }

            await initiateAction({
              body: changedDependencies.current,
              callback: ({ updateRequests, requestData }) => {
                const { data = {} } = requestData ?? {};

                updateRequests({
                  updateStates: {
                    dependencies: () => {
                      const parsedData = parseDependenciesData({ currentData: data });
                      return parsedData;
                    },
                  },
                });
              },
              url: `http://localhost:${import.meta.env.VITE_BACK_PORT}/updateDependencies`,
              method: "POST",
            });

            changedDependencies.current = {};
          }}
        >
          {!isLoading ? "Submit" : "Loading..."}
        </Button>
      </div>
    </div>
  );
};
