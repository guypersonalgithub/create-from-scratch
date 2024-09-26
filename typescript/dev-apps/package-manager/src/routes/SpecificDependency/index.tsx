import { useRouteParamsState } from "@packages/router";
import { Spinner } from "@packages/loading";
import { useMountRequestState } from "@packages/fetch-management";
import { useFetchDependencies } from "../../useFetchDependencies";
import { SpecificDependencyContent } from "./SpecificDependencyContent";

export const SpecificDependency = () => {
  const { dependency } = useRouteParamsState();
  const decodedDependency = dependency ? decodeURIComponent(dependency) : undefined;
  const {
    data: dataDependencies,
    isLoading: isLoadingDependencies,
    isError: isErrorDependencies,
  } = useFetchDependencies();
  const { data, isLoading, isError } = useMountRequestState({
    id: `specificDependency-${decodedDependency}`,
    callback: ({ requestData }) => {
      const currentData = requestData?.data;
      return currentData;
    },
    url: `http://localhost:${import.meta.env.VITE_BACK_PORT}/metadata`,
    params: {
      packageName: decodedDependency,
    },
  });

  if (isLoading || isLoadingDependencies) {
    return <Spinner />;
  }

  const { versions = {} } = data ?? {};
  const versionsArray = Object.keys(versions)
    .map((version) => {
      return {
        label: version,
        value: version,
      };
    })
    .reverse();

  const depedencyDetails = dataDependencies?.find(
    (dependency) => dependency.name === decodedDependency,
  );

  return (
    <SpecificDependencyContent
      data={data}
      versions={versionsArray}
      depedencyDetails={depedencyDetails}
    />
  );
};
