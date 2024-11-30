import { useMountRequestState } from "@packages/fetch-management";
import { parseDependenciesData } from "./utils";

type UseFetchDependenciesArgs = {
  paginationValue: number;
};

export const useFetchDependencies = (
  { paginationValue }: UseFetchDependenciesArgs = { paginationValue: 1 },
) => {
  const { data, isLoading, isError } = useMountRequestState({
    id: "dependencies",
    callback: ({ updateAdditionalRequests, requestData }) => {
      const currentData = requestData?.data ?? {};
      const parsedData = parseDependenciesData({ currentData });

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
