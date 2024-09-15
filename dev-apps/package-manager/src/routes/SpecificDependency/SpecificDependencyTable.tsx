import { useQueryParamsState } from "@packages/router";
import { usePath } from "@packages/router";
import { Typeahead } from "@packages/typeahead";
import { Data } from "../../types";
import { Table } from "@packages/table";
import { EllipsisTooltip } from "@packages/tooltip";
import { semverOptions } from "../../constants";
import { getSemVer } from "../../utils";
import { UpdateChangedDependenciesArgs } from "./types";
import { useState } from "react";

type SpecificDependencyTableProps = {
  versions: {
    label: string;
    value: string;
  }[];
  depedencyDetails?: Data[number];
  updateChangedDependencies: ({ path, newVersion }: UpdateChangedDependenciesArgs) => void;
};

export const SpecificDependencyTable = ({
  versions,
  depedencyDetails,
  updateChangedDependencies,
}: SpecificDependencyTableProps) => {
  const { moveTo } = usePath();
  const { pagination } = useQueryParamsState({ specificParams: ["pagination"] });
  const paginationValue = Array.isArray(pagination) ? 1 : Number(pagination ?? 1);

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
          header: "Path",
          cell: (data) => {
            const { path } = data;

            return <EllipsisTooltip content={path}>{path}</EllipsisTooltip>;
          },
          size: 100,
        },
        {
          header: "Version",
          cell: (data) => {
            const [version, setVersion] = useState(data.version);

            const { semver, actualVersion } = getSemVer({ version });

            return (
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "100px" }}>
                  <Typeahead
                    options={semverOptions}
                    initialValue={semver}
                    callback={(picked) => {
                      const newFullVersion = `${picked}${actualVersion}`;
                      updateChangedDependencies({ path: data.path, newVersion: newFullVersion });
                      setVersion(newFullVersion);
                    }}
                  />
                </div>
                <Typeahead
                  options={versions}
                  initialValue={actualVersion}
                  callback={(picked) => {
                    const newFullVersion = `${semver}${picked}`;
                    updateChangedDependencies({ path: data.path, newVersion: newFullVersion });
                    setVersion(newFullVersion);
                  }}
                />
              </div>
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
