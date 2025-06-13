import { Typeahead } from "@packages/typeahead";
import { semverOptions } from "../../constants";
import { getSemVer } from "../../utils";
import { type InstancesType, type SpecificDependencyTableProps } from "./types";
import {
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@packages/button";
import { type DependenciesToChange } from "@packages/alter-package-versions-types";

type VersionTypeAheadsProps = {
  name?: string;
  data?: InstancesType[number];
  valueCallbacksRef?: MutableRefObject<Dispatch<SetStateAction<string>>[]>;
  index?: number;
  versions: SpecificDependencyTableProps["versions"];
  updateChangedDependencies?: SpecificDependencyTableProps["updateChangedDependencies"];
  versionRef?: MutableRefObject<string>;
  changedDependencies: DependenciesToChange;
};

export const VersionTypeAheads = ({
  name,
  data,
  versions,
  updateChangedDependencies,
  valueCallbacksRef,
  index,
  versionRef,
  changedDependencies,
}: VersionTypeAheadsProps) => {
  const getCurrentVersion = () => {
    const currentPathChanges = data ? changedDependencies[data.path] : [];
    const newVersion = currentPathChanges?.find(
      (dependency) => dependency.dependency === name,
    )?.newVersion;

    return newVersion ?? data?.version ?? "";
  };

  const [version, setVersion] = useState(getCurrentVersion());
  const { semver, actualVersion } = getSemVer({ version });
  if (updateChangedDependencies && index !== undefined && valueCallbacksRef) {
    valueCallbacksRef.current[index] = setVersion;
  }

  useEffect(() => {
    setVersion(getCurrentVersion());
  }, [data?.version, data?.path]);

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <div style={{ width: "100px" }}>
        <Typeahead
          options={semverOptions}
          initialValue={semver}
          callback={(picked) => {
            const newFullVersion = `${picked.value}${actualVersion}`;
            if (data) {
              updateChangedDependencies?.({ path: data.path, newVersion: newFullVersion });
            }
            setVersion(newFullVersion);
            if (versionRef) {
              versionRef.current = newFullVersion;
            }
          }}
        />
      </div>
      <Typeahead
        options={versions}
        initialValue={actualVersion}
        callback={(picked) => {
          const newFullVersion = `${semver}${picked.value}`;
          if (data) {
            updateChangedDependencies?.({ path: data.path, newVersion: newFullVersion });
          }
          setVersion(newFullVersion);
          if (versionRef) {
            versionRef.current = newFullVersion;
          }
        }}
      />
    </div>
  );
};

type SelectedTriggerPopperProps = {
  hideTriggerPopper: () => void;
  checked: Set<string>;
  setChecked: Dispatch<SetStateAction<Set<string>>>;
  instances?: InstancesType;
} & Pick<
  VersionTypeAheadsProps,
  "name" | "versions" | "valueCallbacksRef" | "changedDependencies" | "updateChangedDependencies"
>;

export const SelectedTriggerPopper = ({
  name,
  versions,
  valueCallbacksRef,
  hideTriggerPopper,
  checked,
  setChecked,
  instances = [],
  changedDependencies,
  updateChangedDependencies,
}: SelectedTriggerPopperProps) => {
  const versionRef = useRef<string>("");

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyItems: "center",
      }}
    >
      <VersionTypeAheads
        name={name}
        versions={versions}
        versionRef={versionRef}
        changedDependencies={changedDependencies}
      />
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" }}>
        <Button
          onClick={() => {
            hideTriggerPopper();
            setChecked(new Set<string>());
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            const checkedRows: { path: string; index: number }[] = [];
            instances.forEach((instance, index) => {
              if (checked.has(instance.path)) {
                checkedRows.push({ path: instance.path, index });
              }
            });

            checkedRows.forEach((checkedRow) => {
              updateChangedDependencies?.({
                path: checkedRow.path,
                newVersion: versionRef.current,
              });
              const callback = valueCallbacksRef?.current?.[checkedRow.index];
              callback?.(versionRef.current);
            });

            setChecked(new Set<string>());
            hideTriggerPopper();
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
