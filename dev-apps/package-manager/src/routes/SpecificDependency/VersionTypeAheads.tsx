import { Typeahead } from "@packages/typeahead";
import { semverOptions } from "../../constants";
import { getSemVer } from "../../utils";
import { InstancesType, SpecificDependencyTableProps } from "./types";
import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from "react";
import { Button } from "@packages/button";

type VersionTypeAheadsProps = {
  data?: InstancesType[number];
  valueCallbacksRef?: MutableRefObject<Dispatch<SetStateAction<string>>[]>;
  index?: number;
  versions: SpecificDependencyTableProps["versions"];
  updateChangedDependencies?: SpecificDependencyTableProps["updateChangedDependencies"];
  versionRef?: MutableRefObject<string>;
};

export const VersionTypeAheads = ({
  data,
  versions,
  updateChangedDependencies,
  valueCallbacksRef,
  index,
  versionRef,
}: VersionTypeAheadsProps) => {
  const [version, setVersion] = useState(data?.version ?? "");
  const { semver, actualVersion } = getSemVer({ version });
  if (updateChangedDependencies && index !== undefined && valueCallbacksRef) {
    valueCallbacksRef.current[index] = setVersion;
  }

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <div style={{ width: "100px" }}>
        <Typeahead
          options={semverOptions}
          initialValue={semver}
          callback={(picked) => {
            const newFullVersion = `${picked}${actualVersion}`;
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
          const newFullVersion = `${semver}${picked}`;
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
  setChecked: Dispatch<SetStateAction<Set<string>>>;
} & Pick<VersionTypeAheadsProps, "versions" | "valueCallbacksRef">;

export const SelectedTriggerPopper = ({
  versions,
  valueCallbacksRef,
  hideTriggerPopper,
  setChecked,
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
      <VersionTypeAheads versions={versions} versionRef={versionRef} />
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
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
            valueCallbacksRef?.current.forEach((callback) => {
              callback(versionRef.current);
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
