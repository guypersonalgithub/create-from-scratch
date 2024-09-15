import { getDisplayedRows, Table } from "@packages/table";
import { EllipsisTooltip } from "@packages/tooltip";
import { useQueryParamsState, usePath } from "@packages/router";
import { Spinner, Skeleton } from "@packages/loading";
import { formatDateByLocale } from "@packages/date";
import { Tabs } from "@packages/tabs";
import { useRequestState } from "@packages/fetch-management";
import { useFetchDependencies } from "../useFetchDependencies";
import { getSemVer } from "../utils";

export const MainRoute = () => {
  // const { fetchMetadata, isLoadingVersions, isErrorVersions } = useTempRequest();
  const { moveTo } = usePath();
  const { pagination, tab } = useQueryParamsState({ specificParams: ["pagination", "tab"] });
  const paginationValue = Array.isArray(pagination) ? 1 : Number(pagination ?? 1);
  const { data, isLoading, isError } = useFetchDependencies({ paginationValue });

  const {
    data: versionsData,
    isLoading: isLoadingVersions,
    isError: isErrorVersion,
    fetchData,
  } = useRequestState({ id: "dependencyVersions" });

  const tabValue = Array.isArray(tab) ? "all" : tab ?? "all";
  const rowsPerPage = 10;

  if (isLoading) {
    return <Spinner />;
  }

  const getDisplayableData = () => {
    if (tabValue === "all") {
      return data;
    }

    if (tabValue === "external") {
      return data?.filter((row) => !row.isLocal);
    }

    return data?.filter((row) => row.isLocal);
  };

  return (
    <>
      <Tabs
        tabs={
          [
            { label: "All", value: "all" },
            { label: "External", value: "external" },
            { label: "Local", value: "local" },
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
            header: "Name",
            cell: (data) => {
              const { name } = data;

              return <EllipsisTooltip content={name}>{name}</EllipsisTooltip>;
            },
            size: 100,
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
            header: "Can upgrade",
            cell: (data) => {
              if (isLoadingVersions) {
                return <Skeleton height="100%" width="100%" backgroundColor="lightgray" />;
              }

              const { name } = data;
              const { version } = versionsData?.[name] ?? {};
              const { instances } = data;
              const versionsSet = new Set<string>();
              instances.forEach((instance) => {
                const { actualVersion } = getSemVer({ version: instance.version });
                versionsSet.add(actualVersion);
              });
              const amount = versionsSet.size;

              if (!version) {
                return <div>---</div>;
              }

              const isUpdated = versionsSet.has(version) && amount === 1;
              const text = isUpdated ? "Up to date" : "Can upgrade";

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
        onRowClick={(row) => {
          moveTo({
            pathname: `/dependency/${encodeURIComponent(row.name)}`,
            overrideParams: true,
          });
        }}
      />
    </>
  );
};
