import { getDisplayedRows, Table } from "@packages/table";
import { EllipsisTooltip } from "@packages/tooltip";
import { useControlModal } from "@packages/modal";
import { useControlToast } from "@packages/toast";
import { useQueryParamsState, usePath } from "@packages/router";
import { Spinner, Skeleton } from "@packages/loading";
import { formatDateByLocale } from "@packages/date";
import { Tabs } from "@packages/tabs";
import { useMountRequestState, useRequestState } from "@packages/fetch-management";

export const MainRoute = () => {
  const { openModal, closeModal } = useControlModal();
  const { openModal: openModal2, closeModal: closeModal2 } = useControlModal();
  const { showToast, hideToast } = useControlToast();
  const { showToast: showToast2, hideToast: hideToast2 } = useControlToast();

  return (
    <div>
      <button
        onClick={() =>
          showToast({
            content: (
              <div
                style={{
                  width: "fit-content",
                  height: "fit-content",
                  padding: "20px",
                  backgroundColor: "ActiveCaption",
                  borderRadius: "10%",
                  border: "1px solid red",
                }}
              >
                <button
                  onClick={() => {
                    hideToast();
                  }}
                >
                  hide
                </button>
                <button
                  onClick={() => {
                    showToast2({
                      content: (
                        <div
                          style={{
                            width: "fit-content",
                            height: "fit-content",
                            padding: "20px",
                            backgroundColor: "ActiveCaption",
                            borderRadius: "10%",
                            border: "1px solid red",
                          }}
                        >
                          test
                        </div>
                      ),
                    });
                  }}
                >
                  open
                </button>
              </div>
            ),
          })
        }
      >
        open toast
      </button>
      <button
        onClick={() =>
          openModal({
            content: (
              <div
                style={{
                  width: "800px",
                  height: "500px",
                  backgroundColor: "ThreeDShadow",
                  borderRadius: "5%",
                }}
              >
                testing123
                <button
                  onClick={() =>
                    openModal2({
                      content: (
                        <div
                          style={{
                            width: "900px",
                            height: "250px",
                            backgroundColor: "ActiveCaption",
                            borderRadius: "5%",
                            border: "1px solid red",
                          }}
                        >
                          test123456
                        </div>
                      ),
                    })
                  }
                >
                  click
                </button>
              </div>
            ),
          })
        }
      >
        click
      </button>
      <MainRouteTable />
    </div>
  );
};

const MainRouteTable = () => {
  // const { fetchMetadata, isLoadingVersions, isErrorVersions } = useTempRequest();
  const { moveTo } = usePath();
  const { pagination, tab } = useQueryParamsState({ specificParams: ["pagination", "tab"] });
  const paginationValue = Array.isArray(pagination) ? 1 : Number(pagination ?? 1);

  const { data, isLoading, isError } = useMountRequestState({
    id: "dependencies",
    callback: ({ updateAdditionalRequests, requestData }) => {
      const currentData = requestData?.data ?? {};
      const parsedData = Object.entries(currentData).map(([key, value]) => {
        const { data, isLocal } = value;
        const instances = Object.entries(data).map(([path, details]) => {
          return {
            ...details,
            path,
          };
        });

        return {
          name: key,
          instances,
          isLocal,
        };
      });

      updateAdditionalRequests({
        updateStates: {
          dependencyVersions: ({ previousData }) => {
            const newData = requestData?.latestVersions ?? {};
            const previous = previousData ?? {};
            return { ...previous, ...newData };
          },
        },
      });

      return parsedData;
    },
    url: `http://localhost:${import.meta.env.VITE_BACK_PORT}/detectDependencies`,
    params: {
      pagination: paginationValue,
    },
    disableAfterInitialFetch: true,
  });

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
                versionsSet.add(instance.version);
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
