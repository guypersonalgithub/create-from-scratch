import { useQueryParamsState } from "@packages/router";
import { usePath } from "@packages/router";
import { Table } from "@packages/table";
import { EllipsisTooltip } from "@packages/tooltip";
import { getSemVer } from "../../utils";
import { SpecificDependencyTableProps } from "./types";
import { CSSProperties, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Checkbox } from "@packages/checkbox";
import { useControlTriggerPopper } from "@packages/trigger-popper";
import { SelectedTriggerPopper, VersionTypeAheads } from "./VersionTypeAheads";

export const SpecificDependencyTable = ({
  versions,
  depedencyDetails,
  updateChangedDependencies,
}: SpecificDependencyTableProps) => {
  const valueCallbacksRef = useRef<Dispatch<SetStateAction<string>>[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set<string>()); // TODO: Consider managing state per row and having access to other states through refs for the header.
  const { moveTo } = usePath();
  const { pagination } = useQueryParamsState({ specificParams: ["pagination"] });
  const paginationValue = Array.isArray(pagination) ? 1 : Number(pagination ?? 1);
  const { showTriggerPopper, hideTriggerPopper } = useControlTriggerPopper();

  useEffect(() => {
    if (checked.size > 0) {
      const style: CSSProperties = {
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "100px",
        backgroundColor: "black",
      };

      const onMount: Keyframe[] = [
        { transform: "translateY(100%)", opacity: 0 },
        { transform: "translateY(0%)", opacity: 1 },
      ];
      const mountOptions: KeyframeAnimationOptions = {
        duration: 300,
      };

      showTriggerPopper({
        content: (
          <SelectedTriggerPopper
            versions={versions}
            hideTriggerPopper={hideTriggerPopper}
            valueCallbacksRef={valueCallbacksRef}
            setChecked={setChecked}
          />
        ),
        style,
        onMount,
        mountOptions,
      });
    } else {
      hideTriggerPopper();
    }
  }, [checked.size]);

  return (
    <Table
      headerContainer={{
        backgroundColor: "#242424",
      }}
      rowContainer={{
        height: "200px",
      }}
      rows={{
        dataRow: {
          size: 25,
        },
      }}
      columns={[
        {
          header: () => (
            <Checkbox
              checked={checked.size === depedencyDetails?.instances?.length}
              onChange={(isChecked) => {
                const updatedChecked = new Set(
                  isChecked ? (depedencyDetails?.instances ?? [])?.map((data) => data.path) : [],
                );
                setChecked(updatedChecked);
              }}
            />
          ),
          cell: (data) => {
            const { path } = data;
            return (
              <Checkbox
                checked={checked.has(path)}
                onChange={() => {
                  const updatedSet = new Set([...checked]);
                  if (updatedSet.has(path)) {
                    updatedSet.delete(path);
                  } else {
                    updatedSet.add(path);
                  }

                  setChecked(updatedSet);
                }}
              />
            );
          },
          size: 30,
        },
        {
          header: "Path",
          cell: (data) => {
            const { path } = data;

            return <EllipsisTooltip content={path}>{path}</EllipsisTooltip>;
          },
          size: 100,
        },
        {
          header: "Version",
          cell: (data, index) => {
            return (
              <VersionTypeAheads
                data={data}
                versions={versions}
                updateChangedDependencies={updateChangedDependencies}
                valueCallbacksRef={valueCallbacksRef}
                index={index}
              />
            );
          },
          size: 300,
        },
        {
          header: "Belongs to",
          cell: (data) => {
            const { belongsTo } = data;

            return <EllipsisTooltip content={belongsTo}>{belongsTo}</EllipsisTooltip>;
          },
          size: 100,
        },
        {
          header: "Dependency type",
          cell: (data) => {
            const { dependencyType } = data;

            return <EllipsisTooltip content={dependencyType}>{dependencyType}</EllipsisTooltip>;
          },
          size: 120,
        },
        {
          header: "Amount of newer verisons",
          cell: (data) => {
            const { version } = data;
            const { actualVersion } = getSemVer({ version });
            const index = versions.findIndex((ver) => ver.label === actualVersion);

            if (index === -1) {
              return <div>---</div>;
            }

            return <EllipsisTooltip content={index}>{index}</EllipsisTooltip>;
          },
          size: 100,
        },
      ]}
      data={depedencyDetails?.instances}
      columnGap={10}
      pagination={{
        rowsPerPage: 10,
        paginationProps: {
          currentPage: paginationValue,
          maxPagesToShow: 5,
          onPageChange: (page) => {
            moveTo({
              pathname: window.location.pathname,
              queryParams: page === 1 ? undefined : { pagination: page },
              overrideSpecificParams: ["pagination"],
            });
          },
        },
      }}
    />
  );
};
