import { useMountRequestState } from "@packages/fetch-management";

type UseFetchDependenciesArgs = {
  paginationValue: number;
};

export const useFetchDependencies = (args?: UseFetchDependenciesArgs) => {
  const { paginationValue = 1 } = args ?? {};
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

  return {
    data,
    isLoading,
    isError,
  };
};
