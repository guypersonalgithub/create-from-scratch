import { getDisplayedRows, Table } from "@packages/table";
import { EllipsisTooltip } from "@packages/tooltip";
import { useQueryParamsState, usePath } from "@packages/router";
import { Spinner, Skeleton } from "@packages/loading";
import { formatDateByLocale } from "@packages/date";
import { Tabs } from "@packages/tabs";
import { useRequestState } from "@packages/fetch-management";
import { useFetchDependencies } from "../useFetchDependencies";
import { getSemVer } from "../utils";
import { type ParsedData } from "../types";
import { type LatestVersion } from "@packages/detect-repository-dependencies-types";
import { useMoveToSpecificDependencyPage } from "./useMoveToSpecificDependencyPage";

type IsDependencyUpToDateArgs = {
  row: ParsedData[number];
  versionsData?: LatestVersion;
};

const isDependencyUpToDate = ({ row, versionsData }: IsDependencyUpToDateArgs) => {
  const { name, instances } = row;
  const { version } = versionsData?.[name] ?? {};

  if (!version) {
    return;
  }

  const versionsSet = new Set<string>();
  instances.forEach((instance) => {
    const { actualVersion } = getSemVer({ version: instance.version });
    versionsSet.add(actualVersion);
  });
  const amount = versionsSet.size;

  const isUpdated = versionsSet.has(version) && amount === 1;

  return isUpdated;
};

export const MainRoute = () => {
  // const { fetchMetadata, isLoadingVersions, isErrorVersions } = useTempRequest();
  const { moveTo } = usePath();
  const { pagination, tab } = useQueryParamsState({ specificParams: ["pagination", "tab"] });
  const paginationValue = Array.isArray(pagination) ? 1 : Number(pagination ?? 1);
  const { data, isLoading, isError } = useFetchDependencies({ paginationValue });
  const { moveToDependencyPage } = useMoveToSpecificDependencyPage();

  const {
    data: versionsData,
    isLoading: isLoadingVersions,
    isError: isErrorVersion,
    fetchData,
  } = useRequestState({ id: "dependencyVersions" });

  const tabValue = Array.isArray(tab) ? "all" : (tab ?? "all");
  const rowsPerPage = 10;

  if (isLoading) {
    return <Spinner />;
  }

  const getDisplayableData = () => {
    if (!data || tabValue === "all") {
      return data;
    }

    if (tabValue === "external") {
      return data.filter((row) => !row.isLocal);
    }

    if (tabValue === "local") {
      return data.filter((row) => row.isLocal);
    }

    if (tabValue === "up-to-date") {
      return data.filter((row) => row.isLocal || isDependencyUpToDate({ row, versionsData }));
    }

    return data.filter((row) => !row.isLocal && !isDependencyUpToDate({ row, versionsData }));
  };

  return (
    <>
      <Tabs
        tabs={
          [
            { label: "All", value: "all" },
            { label: "External", value: "external" },
            { label: "Local", value: "local" },
            { label: "Up to date", value: "up-to-date" },
            { label: "Outdated", value: "outdated" },
          ] as const
        }
        selected={tabValue as "all" | "external" | "local"}
        onClick={(tab) => {
          moveTo({
            pathname: window.location.pathname,
            queryParams: tab === "all" ? undefined : { tab },
            overrideSpecificParams: ["tab", "pagination"],
          });
        }}
      />
      <Table
        headerContainer={{
          backgroundColor: "#242424",
          borderBottom: "1px solid #383232",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
        rowContainer={{
          height: "100%",
        }}
        rows={{
          dataRow: {
            size: 35,
          },
        }}
        dataRowClass={(_, index) => {
          const baseClass = "main-route-table-row";

          return (
            baseClass +
            " " +
            (index % 2 === 0 ? "main-route-table-row-odd" : "main-route-table-row-even")
          );
        }}
        dataRowStyle={() => {
          return {
            paddingLeft: "10px",
            paddingRight: "10px",
          };
        }}
        columns={[
          {
            header: "Name",
            cell: (data) => {
              const { name } = data;

              return <EllipsisTooltip content={name}>{name}</EllipsisTooltip>;
            },
            size: 150,
          },
          {
            header: "Instances",
            cell: (data) => {
              const { instances } = data;
              const amount = instances.length;

              return <EllipsisTooltip content={amount}>{amount}</EllipsisTooltip>;
            },
            size: 100,
          },
          {
            header: "Versions",
            cell: (data) => {
              const { instances } = data;
              const versionsSet = new Set<string>();
              instances.forEach((instance) => {
                versionsSet.add(instance.version);
              });
              const amount = versionsSet.size;

              return <EllipsisTooltip content={amount}>{amount}</EllipsisTooltip>;
            },
            size: 100,
          },
          {
            header: "Latest version",
            cell: (data) => {
              if (isLoadingVersions) {
                return <Skeleton height="100%" width="100%" backgroundColor="lightgray" />;
              }

              const { name } = data;
              const { version } = versionsData?.[name] ?? {};

              if (!version) {
                return <div>---</div>;
              }

              return <EllipsisTooltip content={version}>{version}</EllipsisTooltip>;
            },
            size: 120,
          },
          {
            header: "Last update date",
            cell: (data) => {
              if (isLoadingVersions) {
                return <Skeleton height="100%" width="100%" backgroundColor="lightgray" />;
              }

              const { name } = data;
              const { date } = versionsData?.[name] ?? {};

              if (!date) {
                return <div>---</div>;
              }

              const formattedDate = formatDateByLocale({ dateString: date });

              return <EllipsisTooltip content={formattedDate}>{formattedDate}</EllipsisTooltip>;
            },
            size: 150,
          },
          {
            header: "Status",
            cell: (data) => {
              if (isLoadingVersions) {
                return <Skeleton height="100%" width="100%" backgroundColor="lightgray" />;
              }

              const isUpToDate = isDependencyUpToDate({ row: data, versionsData });

              if (isUpToDate === undefined) {
                return <div>---</div>;
              }

              const text = isUpToDate ? "Up to date" : "Can upgrade";

              return <EllipsisTooltip content={text}>{text}</EllipsisTooltip>;
            },
            size: 100,
          },
        ]}
        data={getDisplayableData()}
        columnGap={10}
        pagination={{
          rowsPerPage,
          paginationProps: {
            currentPage: paginationValue,
            maxPagesToShow: 5,
            onPageChange: (page) => {
              moveTo({
                pathname: window.location.pathname,
                queryParams: page === 1 ? undefined : { pagination: page },
                overrideSpecificParams: ["pagination"],
              });

              const dataArray = data ?? [];

              const packageNames = getDisplayedRows({
                rowsPerPage,
                currentPage: page,
                amountOfRows: dataArray.length,
                data: dataArray,
              })
                .filter((row) => !versionsData?.[row.name] && !row.isLocal)
                .map((row) => row.name);

              if (packageNames.length === 0) {
                return;
              }

              fetchData({
                callback: ({ requestData, previousData }) => {
                  const newData = requestData?.data ?? {};
                  const previous = previousData ?? {};

                  return { ...previous, ...newData };
                },
                url: `http://localhost:${import.meta.env.VITE_BACK_PORT}/latest`,
                params: {
                  packageNames,
                },
              });
            },
          },
        }}
        onRowClick={(row) => moveToDependencyPage({ name: row.name })}
      />
    </>
  );
};
